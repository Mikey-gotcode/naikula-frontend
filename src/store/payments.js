import { defineStore } from 'pinia'

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    payments: {},   // keyed by checkoutRequestId
    lastCheckoutId: null,
  }),
  getters: {
    getPayment: (state) => (checkoutId) => state.payments[checkoutId] || null,

    lastPayment: (state) => {
      return state.lastCheckoutId 
        ? state.payments[state.lastCheckoutId] 
        : null
    },

    latestCheckoutId: (state) => {
      const values = Object.values(state.payments)
      if (!values.length) return null
      // get the last successful or pending checkout_request_id
      return values[values.length - 1]?.checkout_request_id || null
    }
  },
  actions: {
    savePayment(payment) {
      console.log("stored id", payment?.checkout_request_id)
      if (!payment?.checkout_request_id) return
      const id = payment.checkout_request_id
      this.payments[id] = payment
      this.lastCheckoutId = id
      this._persist()
    },
    updatePaymentStatus(checkoutId, status, extra = {}) {
      if (!this.payments[checkoutId]) return
      this.payments[checkoutId] = {
        ...this.payments[checkoutId],
        status,
        ...extra,
      }
      this._persist()
    },
    clearPayments() {
      this.payments = {}
      this.lastCheckoutId = null
      this._persist()
    },
    // ---- persistence helpers ----
    _persist() {
      localStorage.setItem(
        'payments_store',
        JSON.stringify({
          payments: this.payments,
          lastCheckoutId: this.lastCheckoutId,
        })
      )
    },
    loadFromStorage() {
      try {
        const saved = JSON.parse(localStorage.getItem('payments_store'))
        if (saved) {
          this.payments = saved.payments || {}
          this.lastCheckoutId = saved.lastCheckoutId || null
        }
      } catch (e) {
        console.warn('Failed to load payments from storage', e)
      }
    },
  },
})
