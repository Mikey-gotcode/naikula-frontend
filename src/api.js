import axios from 'axios'
import { getToken } from '@/store/auth' // adjust if your store path differs

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://www.naikula.co.ke/api'

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 20000,
  // withCredentials: true, // enable if you rely on cookie-based auth (Sanctum cookie). For token-based auth this can stay false.
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Attach token automatically if present (uses getToken() exported from store/auth.js)
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      // If token already includes Bearer prefix keep it, otherwise add it
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/*
|--------------------------------------------------------------------------
| Public (no auth)
|--------------------------------------------------------------------------
*/
export const initiatePayment = (data) => api.post('/payments/initiate', data)
export const checkPaymentStatus = (checkoutRequestId) => api.get(`/payments/status/${checkoutRequestId}`)
export const mpesaCallback = (data) => api.post('/payments/callback', data)

export const register = (data) => api.post('/register', data)
export const login = (data) => api.post('/login', data)

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/
export const logout = () => api.post('/logout')
export const getUser = () => api.get('/user')

export const getTicket = (id) => api.get(`/tickets/${id}`)
export const getEvents = () => api.get('/events')
export const getEvent = (id) => api.get(`/events/${id}`)
export const getITickets = (id) => api.get('/tickets')
export const getITicketsByEvent = (eventId) => api.get(`/tickets/event/${eventId}`)
export const getITicketsByEventAndStatus = (eventId) => api.get(`/tickets/events/${eventId}`)

/*
|--------------------------------------------------------------------------
| Admin-only
|--------------------------------------------------------------------------
*/
export const createAdmin = (data) => api.post('/admin/create-admin', data)

export const viewTicketsHTML = () => api.get('/admin/tickets/view') // returns HTML
export const generateBatch = (data) => api.post('/admin/tickets/generate-batch', data)
// ✅ New method to generate a batch of group tickets
export const generateBatchForGroups = (data) => api.post('/admin/tickets/generate-batch-groups', data)
export const getTickets = () => api.get('/admin/tickets')
export const getAdminTicket = (id) => api.get(`/admin/tickets/${id}`)
export const getTicketsByEvent = (eventId) => api.get(`/admin/tickets/event/${eventId}`)
export const deleteTicket = (id) => api.delete(`/admin/tickets/${id}`)

export const getPayments = () => api.get('/admin/payments')
export const getPayment = (id) => api.get(`/admin/payments/${id}`)
export const deletePayment = (id) => api.delete(`/admin/payments/${id}`)

export const createEvent = (data) => api.post('/admin/events', data)
export const updateEvent = (id, data) => api.put(`/admin/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`)

/*
|--------------------------------------------------------------------------
| Ticket-scanner
|--------------------------------------------------------------------------
*/
export const verifyTicket = (data) => api.post('/tickets/verify', data)
// ✅ New unified method to use tickets
export const useTicket = (data) => api.post('/tickets/use', data);

/**
 * Poll payment status until it succeeds or times out
 * @param {string} checkoutRequestId
 * @param {number} interval - polling interval in ms
 * @param {number} maxAttempts - max number of polls
 */
export const pollPaymentStatus = async (checkoutRequestId, interval = 5000, maxAttempts = 12) => {
  let attempts = 0
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      attempts++
      try {
        const { data } = await checkPaymentStatus(checkoutRequestId)
        // adjust conditions depending on your PaymentsController response
        if (data.status === 'success' || data.status === 'failed') {
          clearInterval(timer)
          resolve(data)
        }
      } catch (err) {
        clearInterval(timer)
        reject(err)
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer)
        reject(new Error('Payment status polling timed out'))
      }
    }, interval)
  })
}

export async function fetchTicketByReceipt(receipt) {
  const { data } = await api.post('/tickets/by-reference', {
    mpesa_reference: receipt
  })
  return data.ticket
}


export default api
