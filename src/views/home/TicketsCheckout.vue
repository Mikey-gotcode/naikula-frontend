<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-black to-gray-900">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-2">Complete Your Purchase</h1>
        <p class="text-orange-400 text-lg">Secure your tickets now - limited availability!</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Order Summary -->
        <div class="lg:w-2/5">
          <div class="ticket-card rounded-xl p-6 relative overflow-hidden">
            <!-- <div class="ticket-stamp">VIP</div> -->

            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-2xl font-bold text-white">Your Order</h2>
                <p class="text-orange-400 mt-1" v-if="eventTitle">{{ eventTitle }}</p>
              </div>
              <div class="bg-gray-800 px-3 py-1 rounded-full">
                <span class="text-orange-400 font-semibold">Checkout</span>
              </div>
            </div>

            <div class="divider my-4"></div>

            <div class="space-y-4">
              <div v-for="it in cart.items" :key="it.ticket_key" class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-gray-300 font-semibold">{{ it.label }}</div>
                  <div class="text-xs text-gray-400">x{{ it.qty }} · KES {{ it.unit_price.toLocaleString() }}</div>
                </div>
                <div class="text-white font-medium">KES {{ it.subtotal.toLocaleString() }}</div>
              </div>

              <div v-if="!cart.items.length" class="text-gray-400 text-center py-8">
                Your cart is empty.
              </div>
            </div>

            <div class="divider my-4"></div>

            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-white">Total</span>
              <span class="text-2xl font-bold gold-text">KES {{ grandTotal.toLocaleString() }}</span>
            </div>

            <div class="mt-6 bg-black bg-opacity-30 rounded-lg p-4">
              <div class="flex items-center">
                <div class="mr-3">
                  <i class="fas fa-shield-alt text-orange-400 text-xl"></i>
                </div>
                <p class="text-gray-300 text-sm">Your payment details are securely encrypted</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="lg:w-3/5">
          <div class="ticket-card rounded-xl p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Payment Information</h2>

            <form @submit.prevent="onSubmit">
              <div class="mb-4">
                <label class="block text-orange-400 mb-2 font-medium">Full Name</label>
                <input v-model="form.fullName" type="text" class="form-input w-full px-4 py-3 rounded-lg" placeholder="Enter your full name" required />
              </div>

              <div class="mb-4">
                <label class="block text-orange-400 mb-2 font-medium">Email Address</label>
                <input v-model="form.email" type="email" class="form-input w-full px-4 py-3 rounded-lg" placeholder="your.email@example.com" required />
              </div>

              <div class="mb-4">
                <label class="block text-orange-400 mb-2 font-medium">Phone Number</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="text-gray-400">+254</span>
                  </div>
                  <input v-model="form.phone" type="tel" class="form-input w-full pl-14 px-4 py-3 rounded-lg" placeholder="" required />
                </div>
                <p class="text-gray-400 text-sm mt-2">We'll send payment instructions to this number</p>
              </div>

              <div class="mb-6">
                <label class="block text-orange-400 mb-2 font-medium">Payment Method</label>
                <div class="payment-method active rounded-lg p-4 flex items-center">
                  <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <i class="fab fa-mpesa text-black text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-medium">MPesa</h3>
                    <p class="text-gray-400 text-sm">Pay with M-Pesa mobile money</p>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button :disabled="submitting || !cart.items.length" type="submit" class="btn-primary flex-1 py-4 rounded-lg font-bold text-lg pulse">
                  <template v-if="!submitting">Proceed to Payment</template>
                  <template v-else><i class="fas fa-spinner fa-spin mr-2"></i>Processing...</template>
                </button>

                <button type="button" @click="clearCart" class="px-6 py-4 rounded-lg border border-gray-700">Clear</button>
                  <button
                          v-if="payments.lastPayment?.overall_status === 'paid'"
                          type="button"
                          @click="goToDownload"
                          class="px-6 py-4 rounded-lg bg-orange-500 text-black font-semibold hover:bg-orange-400 transition"
                        >
                          Download Ticket
                        </button>
              </div>

              <div class="mt-6 text-center">
                <p class="text-gray-400 text-sm">
                  By completing your purchase, you agree to our
                  <a href="#" class="text-orange-400 hover:underline">Terms of Service</a> and
                  <a href="#" class="text-orange-400 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <div class="flex items-center">
              <i class="fas fa-lock text-orange-400 mr-2"></i>
              <span class="text-gray-400 text-sm">Secure Payment</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-mobile-alt text-orange-400 mr-2"></i>
              <span class="text-gray-400 text-sm">Instant Confirmation</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-ticket-alt text-orange-400 mr-2"></i>
              <span class="text-gray-400 text-sm">Digital Tickets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart.js'
import { usePaymentsStore } from '@/store/payments.js'
import { initiatePayment, checkPaymentStatus } from '@/api'

const router = useRouter()
const eventTitle = 'Naikula Cookout !'
const cart = useCartStore()
const payments = usePaymentsStore()

// ✅ restore saved payments state on load
payments.loadFromStorage()

if (typeof cart.loadFromCookie === 'function') {
  cart.loadFromCookie()
}

watch(
  () => cart.items,
  () => {
    if (typeof cart.saveToCookie === 'function') cart.saveToCookie()
  },
  { deep: true }
)

const submitting = ref(false)
const form = ref({ fullName: '', email: '', phone: '' })
const polling = ref(null)
const checkoutRequestId = ref(null)

const subtotal = computed(() => cart.totalAmount || 0)
const grandTotal = computed(() => Number(subtotal.value || 0))

function clearCart() {
  if (!confirm('Clear cart?')) return
  if (typeof cart.clearCart === 'function') cart.clearCart()
}

function goToDownload() {
  const latestId = payments.latestCheckoutId
  if (latestId) {
    router.push({ name: 'PreviewDownload', params: { id: latestId } })
  } else {
    alert('No completed payment found.')
  }
}

/**
 * Normalize the server returned status into one of:
 * 'paid' | 'partial' | 'pending' | 'failed' | 'unknown'
 * Accepts many variants (success/successful/paid)
 */
function normalizeStatus(raw) {
  if (!raw) return 'unknown'
  const s = String(raw).toLowerCase()
  if (['paid', 'success', 'successful'].includes(s)) return 'paid'
  if (['partial'].includes(s)) return 'partial'
  if (['pending', 'pending_payment', 'waiting'].includes(s)) return 'pending'
  if (['failed', 'error', 'cancelled', 'cancelled_by_user'].includes(s)) return 'failed'
  return 'unknown'
}

async function onSubmit() {
  if (!form.value.fullName || !form.value.email || !form.value.phone) {
    alert('Please fill all fields')
    return
  }
  if (!cart.items.length) {
    alert('Cart is empty')
    return
  }

  submitting.value = true
  try {
    const payload = {
      customer: {
        name: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone
      },
      items: cart.asPayload || cart.items,
      subtotal: subtotal.value,
      total: grandTotal.value,
      meta: { source: 'web-checkout' }
    }

    const res = await initiatePayment(payload)

    // The backend returns an array of payment rows (one per seat) in res.data.payments
    const returnedPayments = res?.data?.payments
    const firstCheckoutId = returnedPayments && returnedPayments.length
      ? returnedPayments[0]?.checkout_request_id
      : (res?.data?.checkout_request_id || null)

    checkoutRequestId.value = firstCheckoutId

    if (res.status === 200 && checkoutRequestId.value) {
      // If we received the full payments array, persist it as a batch aggregate
      if (Array.isArray(returnedPayments) && returnedPayments.length) {
        payments.savePaymentsBatch(checkoutRequestId.value, returnedPayments)
      } else {
        // fallback: store a minimal aggregate so the UI knows we started
        payments.savePayment({
          checkout_request_id: checkoutRequestId.value,
          status: 'pending',
          payload
        })
      }

      alert('Payment initiated — check your phone to complete payment.')
      startPolling(checkoutRequestId.value)
    } else {
      alert('Failed to get CheckoutRequestID. Cannot start polling.')
    }
  } catch (err) {
    console.error('initiatePayment failed', err)
    alert('Payment failed to start. Try again.')
  } finally {
    submitting.value = false
  }
}

function startPolling(checkoutId) {
  console.log('polling this transaction', checkoutId)
  stopPolling()
  polling.value = setInterval(async () => {
    try {
      if (!checkoutId) return

      const res = await checkPaymentStatus(checkoutId)
      const data = res?.data ?? {}

      // Prefer aggregate overall_status, fall back to status or single payment row
      const overallRaw = data.overall_status ?? data.status
      const normalized = normalizeStatus(overallRaw)

      // If backend returned payments array, persist whole batch
      if (Array.isArray(data.payments) && data.payments.length) {
        payments.savePaymentsBatch(checkoutId, data.payments)
      }

      // If backend sent a single payment object, merge it
      if (data.payment) {
        const single = data.payment
        // backend might use 'status' or 'payment.status'
        const singleStatus = normalizeStatus(single.status ?? single.payment_status ?? overallRaw)
        payments.savePayment({ ...single, checkout_request_id: checkoutId })
        payments.updatePaymentStatus(checkoutId, normalized, { last_polled: new Date().toISOString() })
      } else {
        // update aggregate overall status only
        payments.updatePaymentStatus(checkoutId, normalized, { last_polled: new Date().toISOString() })
      }

      // Decide outcomes based on normalized overall status
      if (normalized === 'paid') {
        stopPolling()
        if (typeof cart.saveToCookie === 'function') cart.saveToCookie()

        // navigate to preview / download page
        router.push({
          name: 'PreviewDownload',
          params: { id: checkoutId }
        })
      } else if (normalized === 'failed') {
        stopPolling()
        alert('Payment failed. Please try again.')
      }
      // else: pending/partial/unknown -> keep polling
    } catch (err) {
      if (err?.response?.status === 404) {
        stopPolling()
        console.warn('Payment not found, stopping poll.')
      } else {
        console.error('Polling error', err)
      }
    }
  }, 5000)
}

function stopPolling() {
  if (polling.value) {
    clearInterval(polling.value)
    polling.value = null
  }
}

onMounted(() => {
  // load saved contact if needed
})
</script>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.ticket-card {
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.12);
}
.form-input {
  background-color: rgba(30, 30, 30, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.08);
  color: #f5f5f5;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
}
.form-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 0 6px rgba(255, 215, 0, 0.06);
}
.btn-primary {
  background: linear-gradient(45deg, #FFA500, #FFD700);
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.18);
  transition: all 0.2s ease;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 165, 0, 0.2); }
.payment-method { border: 2px solid transparent; transition: all 0.2s ease; }
.payment-method.active { border-color: #ffa600; background-color: rgba(255, 215, 0, 0.06); }
.ticket-stamp {
  position: absolute; top: 20px; right: 20px; width: 80px; height: 80px;
  border-radius: 50%; background: radial-gradient(circle, #FFD700 40%, transparent 70%);
  display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000;
  transform: rotate(15deg); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.divider { height: 1px; background: linear-gradient(to right, transparent, #FFD700, transparent); }
.gold-text { color: #FFD700; }
.orange-text { color: #FFA500; }
.pulse { animation: pulse 2s infinite; }
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.35); }
  70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
}
.loader { border: 4px solid rgba(255,255,255,0.08); border-radius: 50%; border-top: 4px solid #facc15; width: 36px; height: 36px; animation: spin 1s linear infinite; display:inline-block; }
@keyframes spin { 0%{ transform: rotate(0deg);} 100%{ transform: rotate(360deg);} }
.bg-black\/30 { background-color: rgba(0,0,0,0.30); }
</style>
