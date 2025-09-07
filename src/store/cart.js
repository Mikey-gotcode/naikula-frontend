// src/stores/cart.js
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const COOKIE_KEY = 'naikula_cart'
const COOKIE_EXPIRES_DAYS = 7

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // [{ ticket_key, ticket_id, label, qty, unit_price, subtotal, group_size, tickets_consumed }]
  }),

  getters: {
    totalAmount: (state) => state.items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0),
    totalCount: (state) => state.items.reduce((s, it) => s + (Number(it.qty) || 0), 0),
    asPayload: (state) => state.items.map(i => ({
      ticket_key: i.ticket_key,
      ticket_id: i.ticket_id,
      qty: i.qty,
      unit_price: i.unit_price,
      group_size: i.group_size || 1,
      tickets_consumed: i.tickets_consumed || (i.qty * (i.group_size || 1))
    }))
  },

  actions: {
    addOrUpdate(item) {
      // item must include ticket_key (unique per option), ticket_id, qty and unit_price
      if (!item || !item.ticket_key) throw new Error('Invalid cart item')
      const idx = this.items.findIndex(i => String(i.ticket_key) === String(item.ticket_key))
      const subtotal = Number(item.unit_price || 0) * Number(item.qty || 0)
      const group_size = Number(item.group_size || 1)
      const tickets_consumed = Number(item.tickets_consumed ?? (item.qty * group_size))

      if (idx === -1) {
        this.items.push({
          ...item,
          qty: Number(item.qty),
          unit_price: Number(item.unit_price),
          subtotal,
          group_size,
          tickets_consumed
        })
      } else {
        const it = this.items[idx]
        it.qty = Number(it.qty || 0) + Number(item.qty || 0)
        it.tickets_consumed = (it.tickets_consumed || 0) + tickets_consumed
        it.subtotal = it.unit_price * it.qty
      }
      this.saveToCookie()
    },

    setQty(ticket_key, qty) {
      const idx = this.items.findIndex(i => String(i.ticket_key) === String(ticket_key))
      if (idx === -1) return
      qty = Number(qty)
      if (qty <= 0) {
        this.items.splice(idx, 1)
      } else {
        const it = this.items[idx]
        it.qty = qty
        it.tickets_consumed = qty * (it.group_size || 1)
        it.subtotal = it.unit_price * it.qty
      }
      this.saveToCookie()
    },

    remove(ticket_key) {
      const idx = this.items.findIndex(i => String(i.ticket_key) === String(ticket_key))
      if (idx !== -1) {
        this.items.splice(idx, 1)
        this.saveToCookie()
      }
    },

    clearCart() {
      this.items = []
      this.saveToCookie()
    },

    loadFromCookie() {
      try {
        const txt = Cookies.get(COOKIE_KEY)
        if (!txt) return
        const parsed = JSON.parse(txt)
        if (Array.isArray(parsed)) {
          // Defensive: coerce types
          this.items = parsed.map((i) => ({
            ticket_key: i.ticket_key,
            ticket_id: i.ticket_id,
            label: i.label,
            qty: Number(i.qty || 0),
            unit_price: Number(i.unit_price || 0),
            subtotal: Number(i.subtotal || (Number(i.unit_price || 0) * Number(i.qty || 0))),
            group_size: Number(i.group_size || 1),
            tickets_consumed: Number(i.tickets_consumed || (Number(i.qty || 0) * Number(i.group_size || 1)))
          }))
        }
      } catch (e) {
        // ignore invalid cookie JSON
        console.warn('Failed to read cart cookie', e)
      }
    },

    saveToCookie() {
      try {
        const copy = this.items.map(i => ({
          ticket_key: i.ticket_key,
          ticket_id: i.ticket_id,
          label: i.label,
          qty: i.qty,
          unit_price: i.unit_price,
          subtotal: i.subtotal,
          group_size: i.group_size,
          tickets_consumed: i.tickets_consumed
        }))
        Cookies.set(COOKIE_KEY, JSON.stringify(copy), { expires: COOKIE_EXPIRES_DAYS, sameSite: 'Lax' })
      } catch (e) {
        console.warn('Failed to save cart cookie', e)
      }
    }
  }
})
