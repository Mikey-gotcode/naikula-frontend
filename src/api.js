import axios from 'axios'
import { getToken } from '@/store/auth' // adjust if your store path differs

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://www.naikula.co.ke'

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Attach token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* --------------------------------------------------------------------------
   Error Handling Interceptor
---------------------------------------------------------------------------*/
function injectErrorDiv(message, retryFn) {
  if (document.getElementById('api-error-div')) return

  const div = document.createElement('div')
  div.id = 'api-error-div'
  div.style.position = 'fixed'
  div.style.bottom = '20px'
  div.style.right = '20px'
  div.style.background = '#f87171'
  div.style.color = 'white'
  div.style.padding = '15px'
  div.style.borderRadius = '12px'
  div.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)'
  div.style.zIndex = '9999'
  div.style.fontSize = '14px'
  div.style.animation = 'shake 0.3s ease-in-out'

  div.innerHTML = `
    <div style="margin-bottom:8px;">⚠️ ${message}</div>
    <button id="api-retry-btn" style="
      background:#1d4ed8;
      color:white;
      border:none;
      padding:6px 12px;
      border-radius:8px;
      cursor:pointer;
    ">Retry</button>
  `

  document.body.appendChild(div)

  // Retry click
  document.getElementById('api-retry-btn').onclick = () => {
    document.body.removeChild(div)
    retryFn()
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Skip auth-related errors
    if (status === 401 || status === 403) {
      return Promise.reject(error)
    }

    if (status === 429) {
      injectErrorDiv('Too many requests. Please slow down.', () => {
        api.request(error.config)
      })
    } else if (status >= 400 && status < 500) {
      injectErrorDiv('Something went wrong. Please try again.', () => {
        api.request(error.config)
      })
    }

    return Promise.reject(error)
  }
)

/* --------------------------------------------------------------------------
   Public (no auth)
---------------------------------------------------------------------------*/
export const initiatePayment = (data) => api.post('/payments/initiate', data)
export const checkPaymentStatus = (checkoutRequestId) =>
  api.get(`/payments/status/${checkoutRequestId}`)
export const mpesaCallback = (data) => api.post('/payments/callback', data)

export const register = (data) => api.post('/register', data)
export const login = (data) => api.post('/login', data)

/* --------------------------------------------------------------------------
   Authenticated routes
---------------------------------------------------------------------------*/
export const logout = () => api.post('/logout')
export const getUser = () => api.get('/user')

export const getTicket = (id) => api.get(`/tickets/${id}`)
export const getEvents = () => api.get('/events')
export const getEvent = (id) => api.get(`/events/${id}`)
export const getITickets = (id) => api.get('/tickets')
export const getITicketsByEvent = (eventId) =>
  api.get(`/tickets/event/${eventId}`)
export const getITicketsByEventAndStatus = (eventId) =>
  api.get(`/tickets/events/${eventId}`)

/* --------------------------------------------------------------------------
   Admin-only
---------------------------------------------------------------------------*/
export const createAdmin = (data) => api.post('/admin/create-admin', data)

export const viewTicketsHTML = () => api.get('/admin/tickets/view') // returns HTML
export const generateBatch = (data) =>
  api.post('/admin/tickets/generate-batch', data)
export const generateBatchForGroups = (data) =>
  api.post('/admin/tickets/generate-batch-groups', data)
export const getTickets = () => api.get('/admin/tickets')
export const getAdminTicket = (id) => api.get(`/admin/tickets/${id}`)
export const getTicketsByEvent = (eventId) =>
  api.get(`/admin/tickets/event/${eventId}`)
export const deleteTicket = (id) => api.delete(`/admin/tickets/${id}`)

export const getPayments = () => api.get('/admin/payments')
export const getPayment = (id) => api.get(`/admin/payments/${id}`)
export const deletePayment = (id) => api.delete(`/admin/payments/${id}`)

export const createEvent = (data) => api.post('/admin/events', data)
export const updateEvent = (id, data) => api.put(`/admin/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`)

/* --------------------------------------------------------------------------
   Ticket-scanner
---------------------------------------------------------------------------*/
export const verifyTicket = (data) => api.post('/tickets/verify', data)
export const useTicket = (data) => api.post('/tickets/use', data)

/* --------------------------------------------------------------------------
   Poll payment status util
---------------------------------------------------------------------------*/
export const pollPaymentStatus = async (
  checkoutRequestId,
  interval = 3000,
  maxAttempts = 6
) => {
  let attempts = 0
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      attempts++
      try {
        const { data } = await checkPaymentStatus(checkoutRequestId)
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
    mpesa_reference: receipt,
  })
  return data.ticket
}

export default api
