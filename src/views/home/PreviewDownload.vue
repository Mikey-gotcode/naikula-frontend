<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans antialiased">
    <div class="max-w-4xl mx-auto space-y-6">

      <div class="flex items-center space-x-4">
        <button @click="goBack"
          class="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight flex-1">
          Your Tickets
        </h1>
      </div>

      <div v-if="tickets.length > 0" class="space-y-6">

        <!-- Ticket Selector -->
        <div v-if="tickets.length > 1" class="flex flex-wrap gap-2 justify-center" data-aos="fade-up">
          <button v-for="(ticket, index) in tickets" :key="index" @click="selectTicket(index)"
            :class="['px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200', index === selectedIndex ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50']">
            Ticket {{ index + 1 }}
          </button>
        </div>

        <!-- Single Ticket Display -->
        <div v-if="selectedTicket" class="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border border-gray-200"
          data-aos="fade-up" data-aos-delay="100">

          <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <div class="flex-1">
              <span
                :class="['inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide', { 'bg-green-100 text-green-700': selectedTicket.status?.toLowerCase() === 'success', 'bg-yellow-100 text-yellow-700': selectedTicket.status?.toLowerCase() === 'pending' || selectedTicket.status?.toLowerCase() === 'processing', 'bg-red-100 text-red-700': selectedTicket.status?.toLowerCase() === 'failed' }]">
                {{ selectedTicket.status || 'Unknown' }}
              </span>
              <h2 class="text-3xl font-extrabold text-gray-900 mt-2">
                {{ selectedTicket.event_name || 'N/A' }}
              </h2>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-500">
                Ticket Code
              </p>
              <p class="text-2xl font-bold text-gray-800 tracking-wider">
                {{ displayedTicketCode }}
              </p>
            </div>
          </div>

          <hr class="border-t border-dashed border-gray-300 my-6">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendee</p>
              <p class="text-lg font-medium text-gray-900">{{ selectedTicket.attendee_name || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</p>
              <p class="text-lg font-medium text-gray-900">{{ selectedTicket.venue || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
              <p class="text-lg font-medium text-gray-900">{{ formattedDate(selectedTicket.event_date) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</p>
              <p class="text-lg font-medium text-gray-900">{{ formattedTime(selectedTicket.event_date) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</p>
              <p class="text-lg font-medium text-gray-900">{{ selectedTicket.ticket_type || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</p>
              <p class="text-lg font-medium text-gray-900">{{ selectedTicket.price ? `KES ${selectedTicket.price}` : 'N/A' }}</p>
            </div>
          </div>

          <div class="flex justify-center mt-8">
            <!-- If backend returned a QR data URI (svg/png), show it directly -->
            <img
              v-if="selectedTicket?.qr_code"
              :src="selectedTicket.qr_code"
              alt="Ticket QR"
              class="w-48 h-48 border-4 border-white shadow-lg rounded-xl object-contain"
            />

            <!-- Otherwise render the generated QR on canvas -->
            <canvas
              v-else
              ref="qrcode"
              class="w-48 h-48 border-4 border-white shadow-lg rounded-xl"
            ></canvas>
          </div>


          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button @click="downloadPDF(selectedTicket)"
              class="w-full sm:w-auto px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors duration-200 shadow-md">
              <i data-feather="download" class="w-5 h-5"></i>
              <span>Download Ticket</span>
            </button>
            <button v-if="tickets.length > 1" @click="downloadAllGroupTickets"
              class="w-full sm:w-auto px-6 py-3 rounded-full bg-indigo-50 text-indigo-700 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors duration-200">
              <i data-feather="download" class="w-5 h-5"></i>
              <span>Download All Tickets</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-12 bg-white rounded-3xl shadow-xl" data-aos="fade-up">
        <p class="text-2xl font-bold text-gray-900 mb-2">No Tickets Found</p>
        <p class="text-gray-500">We could not find any tickets for this transaction.</p>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentsStore } from '@/store/payments.js'
import apiClient, { checkPaymentStatus, fetchTicketByReceipt } from '@/api'
import { jsPDF } from 'jspdf'
import feather from 'feather-icons'
import AOS from 'aos'
import 'aos/dist/aos.css'
import QRCode from 'qrcode'

/* -------------------------
   Refs / stores / constants
   ------------------------- */
const router = useRouter()
const route = useRoute()
const payments = usePaymentsStore()
const qrcode = ref(null)

const tickets = ref([])          // populated ticket objects
const selectedIndex = ref(0)     // selected ticket index

// compute selected ticket
const selectedTicket = computed(() => tickets.value[selectedIndex.value] || null)

// prefer ticket_code, fallback to ticket_number
const displayedTicketCode = computed(() => {
  const t = selectedTicket.value
  return t?.ticket_code || t?.ticket_number || 'N/A'
})

// checkout id from route or store
const checkoutId = ref(route.params.id || payments.latestCheckoutId || payments.lastCheckoutId || null)

/* -------------------------
   UI helpers
   ------------------------- */
function goBack() {
  router.push({ name: 'EventCheckout' }).catch(() => {})
}

function formattedDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formattedTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function selectTicket(idx) {
  if (idx < 0 || idx >= tickets.value.length) return
  selectedIndex.value = idx
}

/* Price formatter used by template (call as formatPrice(selectedTicket.price)) */
function formatPrice(price) {
  if (price === null || price === undefined || price === '') return 'N/A'
  const n = Number(price)
  if (Number.isNaN(n)) return String(price)
  return `KES ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/* -------------------------
   Download helpers
   ------------------------- */
async function downloadPDF(ticket) {
  if (!ticket?.id) return

  try {
    const res = await apiClient.get(`/tickets/${ticket.id}/download`, {
      responseType: 'blob'
    })

    const contentType = res.headers['content-type'] || ''
    let fileExtension = 'pdf'
    let fileName = `ticket-${ticket.ticket_code || ticket.id}`

    if (contentType.includes('zip')) {
      fileExtension = 'zip'
      fileName = `group-ticket-${ticket.group_code || ticket.id}`
    }

    const blob = new Blob([res.data], { type: contentType })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.${fileExtension}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to download file', e)
    alert('Download failed')
  }
}

async function downloadAllGroupTickets() {
  if (tickets.value.length > 1) {
    await downloadPDF(tickets.value[0])
  } else {
    console.warn('No group tickets to download.')
  }
}

/* -------------------------
   Core: load tickets logic
   (tries checkPaymentStatus -> fetchTicketByReceipt -> per-ticket endpoint -> fallback)
   ------------------------- */
async function loadTicketsFromCheckout(checkout) {
  if (!checkout) return

  try {
    const statusRes = await checkPaymentStatus(checkout)
    const data = statusRes?.data ?? statusRes ?? null
    console.log('Full API Response:', data)
    if (!data || (!data.payments && !data.payment)) {
      console.warn('No payments data returned from checkPaymentStatus')
      return
    }

    const paymentsArray = Array.isArray(data.payments)
      ? data.payments
      : data.payment
      ? [data.payment]
      : []

    if (!paymentsArray.length) {
      console.warn('Payments array is empty')
      return
    }

    // Map receipts -> payments
    const receiptMap = {}
    for (const p of paymentsArray) {
      if (!p || typeof p !== 'object') continue
      const r =
        p.mpesa_receipt_number ??
        p.receipt ??
        p.mpesa_receipt ??
        p.receiptNumber ??
        p.mpesaReceipt ??
        null
      if (r) {
        receiptMap[String(r)] = receiptMap[String(r)] || []
        receiptMap[String(r)].push(p)
      }
    }

    const resultsMap = new Map() // dedupe by ticket_number or id

    const pushTicket = (t) => {
      if (!t) return
      const key = t.ticket_number ? `tn_${t.ticket_number}` : t.id ? `id_${t.id}` : JSON.stringify(t)
      if (!resultsMap.has(key)) resultsMap.set(key, t)
    }

    // If receipts are present, prefer fetching by receipt
    if (Object.keys(receiptMap).length) {
      for (const receipt of Object.keys(receiptMap)) {
        const paymentsForReceipt = receiptMap[receipt] || []
        try {
          console.log(`Fetching ticket(s) for receipt: ${receipt}`)
          const resp = await fetchTicketByReceipt(receipt)
          const ticketRes = resp?.data ?? resp ?? null
          console.log(`fetchTicketByReceipt(${receipt}) returned:`, ticketRes)

          // normalize ticket rows
          let ticketRows = []
          if (!ticketRes) {
            ticketRows = []
          } else if (Array.isArray(ticketRes)) {
            ticketRows = ticketRes
          } else if (Array.isArray(ticketRes.payments)) {
            ticketRows = ticketRes.payments
          } else if (Array.isArray(ticketRes.tickets)) {
            ticketRows = ticketRes.tickets
          } else if (Array.isArray(ticketRes.data)) {
            ticketRows = ticketRes.data
          } else if (ticketRes.payment) {
            ticketRows = [ticketRes.payment]
          } else if (ticketRes.ticket) {
            ticketRows = [ticketRes.ticket]
          } else {
            const arrVals = Object.values(ticketRes).find((v) => Array.isArray(v) && v.length)
            ticketRows = arrVals ?? []
          }

          if (ticketRows.length) {
            for (const row of ticketRows) {
              const mapped = {
                id: row.ticket_id ?? row.id ?? row.ticket?.id ?? null,
                ticket_number: row.ticket_number ?? row.ticket?.ticket_number ?? null,
                ticket_code: row.ticket_code ?? row.ticket?.ticket_code ?? null,
                price: row.amount ?? row.price ?? row.ticket?.price ?? null,
                status: row.status ?? row.ticket?.status ?? null,
                event_name: row.event_name ?? row.ticket?.event_name ?? null,
                event_date: row.event_date ?? row.ticket?.event_date ?? row.ticket?.starts_at ?? null,
                venue: row.venue ?? row.ticket?.venue ?? null,
                attendee_name: row.customer_name ?? row.ticket?.attendee_name ?? null,
                ticket_type: row.ticket_type ?? row.ticket?.ticket_type ?? null,
                seat: row.seat ?? row.ticket?.seat ?? null,
                qr_code: row.qr_code ?? row.ticket?.qr_code ?? null,
                mpesa_receipt_number: row.mpesa_receipt_number ?? receipt
              }
              pushTicket(mapped)
            }
            // got rows — move to next receipt
            continue
          }

          // If fetchTicketByReceipt returned nothing, attempt per-ticket endpoint
          const ticketIds = paymentsForReceipt.map((p) => p.ticket_id).filter((tid) => tid !== null && tid !== undefined)

          if (ticketIds.length) {
            console.log(
              `fetchTicketByReceipt returned empty — attempting per-ticket fetch for receipt ${receipt}:`,
              ticketIds
            )

            const fetches = ticketIds.map((tid) =>
              apiClient
                .get(`/tickets/${tid}`)
                .then((r) => r?.data ?? null)
                .catch((e) => {
                  console.warn(`Failed to fetch ticket id ${tid}`, e)
                  return null
                })
            )

            const settled = await Promise.allSettled(fetches)
            let mappedAny = false

            for (let i = 0; i < settled.length; i++) {
              const s = settled[i]
              const tid = ticketIds[i]
              if (s.status === 'fulfilled') {
                const row = s.value
                if (!row) continue
                const ticketRow = Array.isArray(row) ? row[0] : row.ticket ? row.ticket : row.data ? row.data : row
                if (!ticketRow) continue

                const mapped = {
                  id: ticketRow.id ?? ticketRow.ticket_id ?? tid,
                  ticket_number: ticketRow.ticket_number ?? ticketRow.code ?? null,
                  ticket_code: ticketRow.ticket_code ?? null,
                  price: ticketRow.price ?? ticketRow.amount ?? null,
                  status: ticketRow.status ?? null,
                  event_name: ticketRow.event_name ?? null,
                  event_date: ticketRow.event_date ?? ticketRow.starts_at ?? null,
                  venue: ticketRow.venue ?? null,
                  attendee_name: ticketRow.attendee_name ?? ticketRow.customer_name ?? null,
                  ticket_type: ticketRow.ticket_type ?? null,
                  seat: ticketRow.seat ?? null,
                  qr_code: ticketRow.qr_code ?? null,
                  mpesa_receipt_number: paymentsForReceipt[0]?.mpesa_receipt_number ?? receipt
                }
                pushTicket(mapped)
                mappedAny = true
              } else {
                console.warn(`Per-ticket fetch rejected for id ${tid}`, s.reason)
              }
            }

            if (mappedAny) {
              continue
            } else {
              console.warn(`Per-ticket fetches for receipt ${receipt} returned no usable data.`)
            }
          } else {
            console.warn(`No ticket_ids available for payments under receipt ${receipt}; skipping per-ticket fetch.`)
          }

          // fallback: use payment rows
          console.warn(`fetchTicketByReceipt and per-ticket fetches failed/empty for ${receipt}; falling back to payment rows.`)
          for (const p of paymentsForReceipt) {
            if (!p || typeof p !== 'object') continue
            pushTicket({
              id: p.ticket_id ?? null,
              ticket_number: p.ticket_number ?? null,
              ticket_code: p.ticket_code ?? null,
              price: p.amount ?? null,
              status: p.status ?? null,
              event_name: p.event_name ?? null,
              event_date: p.event_date ?? null,
              venue: p.venue ?? null,
              attendee_name: p.customer_name ?? null,
              ticket_type: p.ticket_type ?? null,
              seat: p.seat ?? null,
              qr_code: p.qr_code ?? null,
              mpesa_receipt_number: p.mpesa_receipt_number ?? receipt
            })
          }
        } catch (err) {
          console.error(`Failed processing receipt ${receipt}:`, err)
          for (const p of paymentsForReceipt) {
            if (!p || typeof p !== 'object') continue
            pushTicket({
              id: p.ticket_id ?? null,
              ticket_number: p.ticket_number ?? null,
              ticket_code: p.ticket_code ?? null,
              price: p.amount ?? null,
              status: p.status ?? null,
              event_name: p.event_name ?? null,
              event_date: p.event_date ?? null,
              venue: p.venue ?? null,
              attendee_name: p.customer_name ?? null,
              ticket_type: p.ticket_type ?? null,
              seat: p.seat ?? null,
              qr_code: p.qr_code ?? null,
              mpesa_receipt_number: p.mpesa_receipt_number ?? receipt
            })
          }
        }
      } // end receipts loop
    } else {
      // no receipts => populate direct from payments array
      console.warn('No receipts found in payments; populating from payment rows.')
      for (const p of paymentsArray) {
        if (!p || typeof p !== 'object') continue
        pushTicket({
          id: p.ticket_id ?? null,
          ticket_number: p.ticket_number ?? null,
          ticket_code: p.ticket_code ?? null,
          price: p.amount ?? null,
          status: p.status ?? null,
          event_name: p.event_name ?? null,
          event_date: p.event_date ?? null,
          venue: p.venue ?? null,
          attendee_name: p.customer_name ?? null,
          ticket_type: p.ticket_type ?? null,
          seat: p.seat ?? null,
          qr_code: p.qr_code ?? null,
          mpesa_receipt_number: p.mpesa_receipt_number ?? null
        })
      }
    }

    // finalize results and update reactive state
    const results = Array.from(resultsMap.values())
    tickets.value = results
    console.log('Final populated tickets array:', tickets.value)

    if (selectedIndex.value >= tickets.value.length) selectedIndex.value = 0
    await generateQrForSelected()
  } catch (err) {
    console.error('Failed to load tickets for checkout', checkout, err)
  }
}

/* -------------------------
   QR generation / display
   - If backend returned svg/png data uri in ticket.qr_code -> we show <img> in template
   - Otherwise we render a generated QR on the canvas
   ------------------------- */
async function generateQrForSelected() {
  try {
    const t = selectedTicket.value
    if (!t) return

    // If backend provided an SVG/PNG data URI, clear canvas (no draw)
    if (t.qr_code) {
      const c = qrcode.value
      if (c && c.getContext) {
        const ctx = c.getContext('2d')
        ctx && ctx.clearRect(0, 0, c.width || 0, c.height || 0)
      }
      return
    }

    // fallback to ticket_code or ticket_number
    const qrData = t.ticket_code ?? t.ticket_number
    if (!qrData) {
      console.warn('No ticket_code or ticket_number available to generate QR.')
      const c = qrcode.value
      if (c && c.getContext) {
        const ctx = c.getContext('2d')
        ctx && ctx.clearRect(0, 0, c.width || 0, c.height || 0)
      }
      return
    }

    if (!qrcode.value) {
      console.warn('QR canvas ref not ready.')
      return
    }

    // size and DPI handling to avoid blur
    const displaySize = 200
    const ratio = window.devicePixelRatio || 1
    const canvasEl = qrcode.value

    canvasEl.width = displaySize * ratio
    canvasEl.height = displaySize * ratio
    canvasEl.style.width = `${displaySize}px`
    canvasEl.style.height = `${displaySize}px`

    // clear first
    const ctx = canvasEl.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    const qrText = JSON.stringify({ code: qrData, id: t.id })
    console.log('QR Code data to be encoded:', qrText)

    // draw to canvas at pixel resolution
    await QRCode.toCanvas(canvasEl, qrText, {
      width: displaySize * ratio,
      margin: 2 * ratio,
      color: { dark: '#4f46e5', light: '#ffffff' }
    })
  } catch (err) {
    console.error('Failed to generate QR', err)
  }
}

/* regenerate QR when selected ticket or tickets list changes */
watch(selectedIndex, () => {
  generateQrForSelected()
})

watch(tickets, (nv) => {
  if (nv && nv.length) generateQrForSelected()
})

/* -------------------------
   lifecycle
   ------------------------- */
onMounted(async () => {
  AOS.init()
  feather.replace()

  if (!checkoutId.value) {
    checkoutId.value = payments.latestCheckoutId || payments.lastCheckoutId || null
  }

  if (checkoutId.value) {
    await loadTicketsFromCheckout(checkoutId.value)
  } else {
    console.warn('No checkout id available to load tickets')
  }
})
</script>


<style scoped>
.ticket-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  overflow: hidden;
  background: white;
}
.qr-border {
  border: 12px solid rgba(79, 70, 229, 0.1);
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.detail-item {
  transition: all 0.3s ease;
}
.detail-item:hover {
  transform: translateY(-2px);
}
.download-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
}
.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(99, 102, 241, 0.4);
}
.back-btn {
  transition: all 0.3s ease;
}
.back-btn:hover {
  transform: translateX(-5px);
}
</style>
 