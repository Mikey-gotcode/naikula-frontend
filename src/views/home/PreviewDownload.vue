<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
    <div class="max-w-4xl w-full">
      <!-- Back Button -->
      <button @click="goBack" class="back-btn flex items-center text-indigo-600 mb-6 group">
        <i data-feather="arrow-left" class="mr-2"></i>
        <span class="font-medium">Back to Events</span>
      </button>

      <!-- Main Ticket Container -->
      <div class="ticket-container p-6 md:p-10" data-aos="fade-up" data-aos-duration="800">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ ticket?.event_name }}</h1>
          <p class="text-gray-600">Ticket Preview</p>
        </div>

        <div class="flex flex-col lg:flex-row items-center justify-between gap-10">
          <!-- QR Code Section -->
          <div class="flex flex-col items-center">
            <div class="qr-border p-4 mb-6">
              <canvas ref="qrcode"></canvas>
            </div>
            <p class="text-gray-600 text-sm">Scan to verify ticket</p>
          </div>

          <!-- Ticket Details -->
          <div class="w-full lg:w-1/2">
            <div class="space-y-5">
              <div class="detail-item bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Event</h3>
                <p class="text-lg font-medium text-gray-800 mt-1">{{ ticket?.event_name }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="detail-item bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Date & Time</h3>
                  <p class="text-lg font-medium text-gray-800 mt-1">
                    {{ formattedDate(ticket?.event_date) }}<br />
                    {{ formattedTime(ticket?.event_date) }}
                  </p>
                </div>

                <div class="detail-item bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Venue</h3>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ ticket?.venue }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="detail-item bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Attendee</h3>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ ticket?.attendee_name }}</p>
                </div>

                <div class="detail-item bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</h3>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ ticket?.ticket_type }}</p>
                </div>
              </div>

              <div v-if="ticket?.seat" class="detail-item bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 class="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Seat Information</h3>
                <p class="text-lg font-medium text-gray-800 mt-1">{{ ticket.seat }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Download Button -->
        <div class="mt-12 text-center">
          <button
            @click="downloadPDF"
            class="download-btn bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center"
          >
            <i data-feather="download" class="mr-2"></i>
            Download PDF Ticket
          </button>
        </div>
      </div>

      <!-- Footer Note -->
      <p class="text-center text-gray-500 text-sm mt-8">
        Present this ticket at the entrance for admission
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentsStore } from '@/store/payments.js'
import { checkPaymentStatus, fetchTicketByReceipt } from '@/api'
import { jsPDF } from 'jspdf'
import feather from 'feather-icons'
import AOS from 'aos'
import 'aos/dist/aos.css'
import QRCode from 'qrcode'

const router = useRouter()
const payments = usePaymentsStore()
const qrcode = ref(null)
const ticket = ref(null)

function goBack() {
  router.push({ name: 'EventCheckout' })
}

function formattedDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formattedTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

async function fetchTicket() {
  try {
    const lastPayment = payments.lastPayment
    if (!lastPayment) {
      console.warn('No last payment found')
      return
    }

    // 1. Check payment status
    const { data } = await checkPaymentStatus(lastPayment.checkout_request_id)
    if (!data?.payment) return

    // 2. Fetch ticket if payment was successful
    if (data.payment.status === 'successful' && data.payment.mpesa_receipt_number) {
      const receipt = data.payment.mpesa_receipt_number

      const { data: ticketRes } = await fetchTicketByReceipt(receipt).catch(err => {
        console.error("fetchTicketByReceipt error:", err)
        return { data: null }
      })

      if (!ticketRes || !ticketRes.ticket) {
        console.warn('No ticket found in API response', receipt, ticketRes)
        return
      }

      const t = ticketRes.ticket

      // Assign real ticket data
      ticket.value = {
        id: t.id,
        ticket_number: t.ticket_number,
        ticket_code: t.ticket_code,
        price: t.price,
        status: t.status,

        // Event info (if missing from API, fallback to defaults)
        event_name: t.event_name || 'Sample Event',
        event_date: t.event_date || new Date(),
        venue: t.venue || 'Venue TBA',

        // Attendee info
        attendee_name: t.attendee_name || data.payment.phone_number || 'Guest',
        ticket_type: t.ticket_type || 'General',

        seat: t.seat || null,
        qr_code: t.qr_code || null
      }

      // Generate QR Code
      const qrText = JSON.stringify({
        id: ticket.value.id,
        code: ticket.value.ticket_code,
        receipt
      })
      await QRCode.toCanvas(qrcode.value, qrText, {
        width: 180,
        margin: 2,
        color: { dark: "#4f46e5", light: "#ffffff" }
      })
    }
  } catch (err) {
    console.error('Failed to fetch ticket', err)
  }
}

function downloadPDF() {
  if (!ticket.value) return
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 150] })

  // Header
  doc.setFillColor(79, 70, 229)
  doc.rect(0, 0, 100, 25, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16).setFont(undefined, 'bold')
  doc.text(ticket.value.event_name, 50, 12, null, null, 'center')
  doc.setFontSize(12).text(new Date(ticket.value.event_date).getFullYear().toString(), 50, 19, null, null, 'center')

  // Body
  doc.setTextColor(0, 0, 0).setFontSize(10).setFont(undefined, 'normal')
  doc.text('Ticket Preview', 50, 30, null, null, 'center')

  doc.setFontSize(9)
  doc.text(`Ticket #: ${ticket.value.ticket_number}`, 10, 37)
  doc.text(`Code: ${ticket.value.ticket_code}`, 10, 44)
  doc.text(`Event: ${ticket.value.event_name}`, 10, 51)
  doc.text(`Date: ${formattedDate(ticket.value.event_date)} | ${formattedTime(ticket.value.event_date)}`, 10, 58)
  doc.text(`Venue: ${ticket.value.venue}`, 10, 65)
  doc.text(`Attendee: ${ticket.value.attendee_name}`, 10, 72)
  doc.text(`Type: ${ticket.value.ticket_type}`, 10, 79)
  doc.text(`Status: ${ticket.value.status}`, 10, 86)
  doc.text(`Price: ${ticket.value.price}`, 10, 93)
  if (ticket.value.seat) doc.text(`Seat: ${ticket.value.seat}`, 10, 100)

  doc.save(`${ticket.value.event_name}-ticket.pdf`)
}

onMounted(() => {
  AOS.init()
  feather.replace()
  fetchTicket()
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
