import { defineStore } from 'pinia'

/**
 * payments store
 *
 * New internal shape:
 * {
 *   payments: {
 *     [checkoutRequestId]: {
 *       checkout_request_id: string,
 *       overall_status: 'pending'|'paid'|'partial'|'failed'|'unknown',
 *       total_payments: number,
 *       counts: { paid: number, pending: number, failed: number, ... },
 *       payments: [ { id, ticket_id, amount, status, mpesa_receipt_number, ... }, ... ],
 *       last_updated: ISOString
 *     }
 *   },
 *   lastCheckoutId: string|null
 * }
 *
 * The store will accept either:
 *  - an aggregate payload returned by the backend status endpoint (has `payments` array)
 *  - a single payment row (with checkout_request_id) and it will merge it into the existing aggregate.
 */
export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    // keyed by checkoutRequestId
    payments: {},
    lastCheckoutId: null,
  }),

  getters: {
    // raw aggregate object for a checkout id
    getPayment: (state) => (checkoutId) => state.payments[checkoutId] || null,

    // last aggregate
    lastPayment: (state) => {
      return state.lastCheckoutId ? state.payments[state.lastCheckoutId] : null
    },

    // compatibility getter that tries to return the actual checkout id
    latestCheckoutId: (state) => {
      // fast path: explicit lastCheckoutId
      if (state.lastCheckoutId) return state.lastCheckoutId

      const values = Object.values(state.payments)
      if (!values.length) return null

      // return the last inserted (by insertion order of object values)
      const last = values[values.length - 1]
      return last?.checkout_request_id || null
    },

    // convenience: get payments array for a checkout
    paymentsFor: (state) => (checkoutId) => {
      const agg = state.payments[checkoutId]
      return agg ? agg.payments || [] : []
    },

    // find a single payment row by its internal payment.id across all checkouts
    findPaymentById: (state) => (paymentId) => {
      for (const agg of Object.values(state.payments)) {
        const found = (agg.payments || []).find((p) => p.id === paymentId)
        if (found) return { checkout_request_id: agg.checkout_request_id, payment: found }
      }
      return null
    }
  },

  actions: {
    // Save an aggregate payload (e.g., result from /payments/status endpoint)
    // Accepts both new aggregate shape or old single-payment objects.
    savePayment(payload) {
      if (!payload) return

      // If payload already has payments[] (aggregate form), store as-is (normalize)
      if (Array.isArray(payload.payments)) {
        const id = payload.checkout_request_id || (payload.payments[0] && payload.payments[0].checkout_request_id)
        if (!id) return

        const normalized = this._normalizeAggregate(id, payload)
        // ensure reactive update
        this.payments = { ...this.payments, [id]: normalized }
        this.lastCheckoutId = id
        this._persist()
        return
      }

      // If payload is a single payment row, merge it into the existing aggregate or create new aggregate
      const id = payload.checkout_request_id
      if (!id) return

      const existing = this.payments[id] || this._emptyAggregate(id)

      // Merge or upsert the single payment row (by payment.id if available, otherwise append)
      const paymentsArr = Array.isArray(existing.payments) ? [...existing.payments] : []
      const incomingId = payload.id ?? null

      if (incomingId) {
        const idx = paymentsArr.findIndex((p) => p.id === incomingId)
        if (idx >= 0) {
          paymentsArr[idx] = { ...paymentsArr[idx], ...payload }
        } else {
          paymentsArr.push(payload)
        }
      } else {
        // no payment id: push as best effort
        paymentsArr.push(payload)
      }

      // Recompute counts & overall_status
      const counts = this._computeCounts(paymentsArr)
      const overall = this._deriveOverallStatus(counts)

      const normalized = {
        checkout_request_id: id,
        overall_status: overall,
        total_payments: paymentsArr.length,
        counts,
        payments: paymentsArr,
        last_updated: new Date().toISOString()
      }

      this.payments = { ...this.payments, [id]: normalized }
      this.lastCheckoutId = id
      this._persist()
    },

    // Save a batch of payment rows for a checkout (backend status payload)
    savePaymentsBatch(checkoutId, paymentsArray = []) {
      if (!checkoutId || !Array.isArray(paymentsArray)) return
      const normalized = this._normalizeAggregate(checkoutId, { checkout_request_id: checkoutId, payments: paymentsArray })
      this.payments = { ...this.payments, [checkoutId]: normalized }
      this.lastCheckoutId = checkoutId
      this._persist()
    },

    // Update top-level aggregate status (overall) and/or attach extra fields
    updatePaymentStatus(checkoutId, overallStatus, extra = {}) {
      if (!this.payments[checkoutId]) return
      const existing = this.payments[checkoutId]
      const merged = {
        ...existing,
        overall_status: overallStatus,
        ...extra,
        last_updated: new Date().toISOString()
      }
      this.payments = { ...this.payments, [checkoutId]: merged }
      this._persist()
    },

    // Update a single payment row inside an aggregate checkout
    // paymentPatch must contain either id or ticket_id to find the row
    updateSinglePayment(checkoutId, paymentIdentifier, patch = {}) {
      const agg = this.payments[checkoutId]
      if (!agg) return
      const arr = [...(agg.payments || [])]
      const idx = arr.findIndex((p) => (paymentIdentifier.id ? p.id === paymentIdentifier.id : p.ticket_id === paymentIdentifier.ticket_id))
      if (idx === -1) return
      arr[idx] = { ...arr[idx], ...patch }
      const counts = this._computeCounts(arr)
      const overall = this._deriveOverallStatus(counts)
      const normalized = {
        ...agg,
        payments: arr,
        counts,
        overall_status: overall,
        last_updated: new Date().toISOString()
      }
      this.payments = { ...this.payments, [checkoutId]: normalized }
      this._persist()
    },

    // Remove a checkout aggregate entirely
    removeCheckout(checkoutId) {
      if (!this.payments[checkoutId]) return
      const copy = { ...this.payments }
      delete copy[checkoutId]
      this.payments = copy
      if (this.lastCheckoutId === checkoutId) this.lastCheckoutId = null
      this._persist()
    },

    clearPayments() {
      this.payments = {}
      this.lastCheckoutId = null
      this._persist()
    },

    // ---- persistence helpers ----
    _persist() {
      try {
        localStorage.setItem(
          'payments_store',
          JSON.stringify({
            payments: this.payments,
            lastCheckoutId: this.lastCheckoutId,
          })
        )
      } catch (e) {
        console.warn('Failed to persist payments store', e)
      }
    },

    loadFromStorage() {
      try {
        const raw = localStorage.getItem('payments_store')
        if (!raw) return
        const saved = JSON.parse(raw)

        // Backwards compatibility: old store may have single-payment objects keyed by checkoutId
        const savedPayments = saved.payments || {}
        const normalized = {}

        for (const [k, v] of Object.entries(savedPayments)) {
          if (!v) continue

          // If already an aggregate (has payments array), keep
          if (Array.isArray(v.payments)) {
            normalized[k] = v
            continue
          }

          // If saved value is a single payment row (old format), convert to aggregate
          if (v.checkout_request_id && !Array.isArray(v.payments)) {
            const checkoutId = v.checkout_request_id
            normalized[checkoutId] = this._normalizeAggregate(checkoutId, { checkout_request_id: checkoutId, payments: [v] })
            continue
          }

          // Fallback: try to detect payments array
          if (Array.isArray(v)) {
            normalized[k] = this._normalizeAggregate(k, { checkout_request_id: k, payments: v })
            continue
          }

          // otherwise ignore
        }

        this.payments = normalized
        this.lastCheckoutId = saved.lastCheckoutId || null
      } catch (e) {
        console.warn('Failed to load payments from storage', e)
      }
    },

    // ---- small helpers ----

    _emptyAggregate(checkoutId) {
      return {
        checkout_request_id: checkoutId,
        overall_status: 'pending',
        total_payments: 0,
        counts: {},
        payments: [],
        last_updated: new Date().toISOString()
      }
    },

    // Normalize an aggregate payload into canonical internal shape
    _normalizeAggregate(checkoutId, payload) {
      const paymentsArray = Array.isArray(payload.payments) ? payload.payments : []
      // ensure every payment has checkout_request_id set
      const normalizedPayments = paymentsArray.map((p) => ({ ...p, checkout_request_id: checkoutId }))

      const counts = this._computeCounts(normalizedPayments)
      const overall = payload.overall_status || this._deriveOverallStatus(counts)

      return {
        checkout_request_id: checkoutId,
        overall_status: overall,
        total_payments: normalizedPayments.length,
        counts,
        payments: normalizedPayments,
        last_updated: new Date().toISOString()
      }
    },

    // compute counts for statuses in a payments array
    _computeCounts(paymentsArray) {
      const counts = {}
      for (const p of paymentsArray) {
        const s = p.status || 'unknown'
        counts[s] = (counts[s] || 0) + 1
      }
      return counts
    },

    // derive an overall status from counts: paid | partial | pending | failed | unknown
    _deriveOverallStatus(counts) {
      const total = Object.values(counts).reduce((a, b) => a + b, 0)
      const paid = counts.paid || 0
      const pending = counts.pending || 0
      const failed = counts.failed || 0

      if (total === 0) return 'pending'
      if (paid === total) return 'paid'
      if (paid > 0 && paid < total) return 'partial'
      if (pending === total) return 'pending'
      if (failed === total) return 'failed'
      return 'unknown'
    }
  },
})
