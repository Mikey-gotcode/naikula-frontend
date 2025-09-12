<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <div class="bg-blue-500 rounded-lg p-2 mr-3">
            <i class="fas fa-ticket-alt text-white text-xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Ticket Management</h1>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="openNewTicketModal" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition">
            <i class="fas fa-plus mr-2"></i> New Ticket
          </button>

          <button class="text-gray-500 hover:text-gray-700 relative">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>

          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="font-semibold text-blue-700">JD</span>
            </div>
            <span class="ml-2 font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Title & Stats -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Ticket Sales</h2>
          <p class="text-gray-600">Manage and track all ticket sales transactions</p>

          <!-- Stats cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500 text-sm">Total Sales</p>
                  <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalSales }}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded-lg">
                  <i class="fas fa-dollar-sign text-blue-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500 text-sm">Pending</p>
                  <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.pending }}</p>
                </div>
                <div class="bg-yellow-100 p-3 rounded-lg">
                  <i class="fas fa-hourglass-half text-yellow-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500 text-sm">Confirmed</p>
                  <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.confirmed }}</p>
                </div>
                <div class="bg-green-100 p-3 rounded-lg">
                  <i class="fas fa-check-circle text-green-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500 text-sm">Cancelled</p>
                  <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.cancelled }}</p>
                </div>
                <div class="bg-red-100 p-3 rounded-lg">
                  <i class="fas fa-times-circle text-red-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow p-6 mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-stretch w-full">
              <div class="relative flex-1">
                <input v-model="search" type="text" placeholder="Search tickets..." class="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>

              <select v-model="filterStatus" class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="used">Used</option>
                <option value="unused">Unused</option>
                <option value="open">Open</option>
              </select>

              <select v-model="filterEventId" class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                <option value="">All Events</option>
                <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.name || ev.title || `Event ${ev.id}` }}</option>
              </select>

              <button @click="applyFilters" class="border border-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                <i class="fas fa-filter mr-2"></i> Filter
              </button>

              <button @click="resetFilters" class="border border-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                Reset
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <button @click="openGenerateBatchModal" class="bg-primary px-4 py-2 rounded text-black">
                <i class="fas fa-layer-group mr-2"></i> Generate Batch
              </button>

              <button @click="openGenerateGroupBatchModal" class="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-white transition">
                <i class="fas fa-users mr-2"></i> Group Batch
              </button>

              <button @click="reload" class="border border-gray-300 rounded-lg px-4 py-2 text-blue-700 hover:bg-gray-50 transition">
                <i class="fas fa-sync-alt"></i> Refresh
              </button>
              <button @click="downloadTicket(paginated)" 
                class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                <i class="fas fa-file-archive mr-2"></i> Download Page as ZIP
              </button>
 
            </div>
          </div>
        </div>

        <!-- Tickets Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                  <td colspan="8" class="py-12 text-center">
                    <div class="loader mx-auto"></div>
                    <p class="mt-4 text-gray-600">Loading tickets...</p>
                  </td>
                </tr>

                <tr v-else-if="filtered.length === 0">
                  <td colspan="8" class="py-12 text-center">
                    <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </td>
                </tr>

                <tr v-else v-for="ticket in paginated" :key="ticket.id || ticket.ticket_number" class="fade-in">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ ticket.id || ticket.ticket_number || ticket.order_id }}
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ ticket.customer_name || ticket.phone_number || ticket.buyer || '-' }}</div>
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ ticket.event_name || ticket.event?.title || ticket.event || ('Event ' + (ticket.event_id || '')) }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ ticket.quantity ?? 1 }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ ticket.amount ?? ticket.price ?? ticket.total ?? '-' }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="statusClass(normalizeStatus(ticket))" class="status-badge">
                      {{ prettyStatus(normalizeStatus(ticket)) }}
                    </span>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(ticket.created_at ?? ticket.date ?? ticket.purchased_at) }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="viewTicket(ticket)" class="text-blue-600 hover:text-blue-900 mr-3">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editTicket(ticket)" class="text-gray-600 hover:text-gray-900 mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="confirmDelete(ticket)" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="p-4 border-t flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ Math.min(startIndex + 1, filtered.length || 0) }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filtered.length }}</span> results
            </div>

            <div class="flex items-center space-x-2">
              <button class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" :disabled="page === 1" @click="page = Math.max(1, page - 1)">
                Previous
              </button>

              <button v-for="pg in pageNumbers" :key="pg" @click="page = pg"
                :class="['px-3 py-1 rounded-md border text-sm font-medium', { 'bg-blue-50 text-blue-600 border-blue-300': page === pg, 'bg-white text-gray-500 border-gray-300': page !== pg } ]">
                {{ pg }}
              </button>

              <button class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" :disabled="page === totalPages" @click="page = Math.min(totalPages, page + 1)">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Ticket Detail Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-semibold">{{ selectedTicket?.ticket_number || selectedTicket?.id }}</h3>
            <p class="text-gray-500 text-sm">{{ selectedTicket?.event_name || selectedTicket?.event?.title }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>

        <div class="mt-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div class="flex-shrink-0">
            <!-- Always show image src if present (backend returns PNG or SVG data URI) -->
            <img 
              v-if="qrSrc" 
              :src="qrSrc" 
              alt="QR code" 
              class="w-48 h-48 object-contain bg-white p-2 rounded text-black" 
            />

            <div v-else class="w-48 h-48 flex items-center justify-center bg-gray-100 rounded text-gray-400">
              No QR
            </div>
          </div>

          <div class="flex-1">
            <dl class="grid grid-cols-1 gap-y-2 text-sm">
              <div>
                <dt class="text-gray-500">Ticket Code</dt>
                <dd class="text-gray-900 font-medium">{{ selectedTicket?.ticket_number || selectedTicket?.code || selectedTicket?.id }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Price</dt>
                <dd class="text-gray-900 font-medium">{{ selectedTicket?.price ?? selectedTicket?.amount ?? '-' }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Status</dt>
                <dd class="text-gray-900 font-medium">{{ prettyStatus(normalizeStatus(selectedTicket)) }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Buyer</dt>
                <dd class="text-gray-900 font-medium">{{ selectedTicket?.customer_name || selectedTicket?.phone_number || '-' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeModal" class="px-4 py-2 border rounded">Close</button>
          <button @click="downloadTicket(selectedTicket)" class="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</button>
        </div>
      </div>
    </div>

    <!-- Generate Batch Modal -->
    <div v-if="showGenerateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
        <div class="flex justify-between items-center">
          <h3 class="text-black text-lg font-semibold">Generate Ticket Batch</h3>
          <button @click="closeGenerateModal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>

        <div class="mt-4 space-y-3">
          <div>
            <label class="text-sm text-gray-600 block mb-1">Event</label>
            <select v-model="batchForm.event_id" class="w-full border rounded px-3 py-2 text-gray-700">
              <option value="">Select event</option>
              <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.name || ev.title || `Event ${ev.id}` }}</option>
            </select>
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">Quantity</label>
            <input v-model.number="batchForm.quantity" type="number" min="1" class="w-full border rounded px-3 py-2 text-gray-700" />
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">Price (per ticket)</label>
            <input v-model.number="batchForm.price" type="number" min="0" class="w-full border rounded px-3 py-2 text-gray-700" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeGenerateModal" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="submitGenerateBatch" :disabled="batchLoading" class="px-4 py-2 bg-blue-600 text-white rounded">
            <span v-if="batchLoading" class="inline-block loader mr-2"></span>
            Generate
          </button>
        </div>
      </div>
    </div>

    <!-- Group Batch Modal -->
    <div v-if="showGenerateGroupModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
        <div class="flex justify-between items-center">
          <h3 class="text-black text-lg font-semibold">Generate Group Ticket Batch</h3>
          <button @click="closeGenerateGroupBatchModal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>

        <div class="mt-4 space-y-3">
          <div>
            <label class="text-sm text-gray-600 block mb-1">Event</label>
            <select v-model="groupBatchForm.event_id" class="w-full border rounded px-3 py-2 text-gray-700">
              <option value="">Select event</option>
              <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.name || ev.title || `Event ${ev.id}` }}</option>
            </select>
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">Group Size</label>
            <input v-model.number="groupBatchForm.group_size" type="number" min="1" class="w-full border rounded px-3 py-2 text-gray-700" />
          </div>

           <div>
            <label class="text-sm text-gray-600 block mb-1">Number of Tickets</label>
            <input v-model.number="groupBatchForm.number_of_tickets" type="number" min="1" class="w-full border rounded px-3 py-2 text-gray-700" />
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">Price (per group)</label>
            <input v-model.number="groupBatchForm.price" type="number" min="0" class="w-full border rounded px-3 py-2 text-gray-700" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeGenerateGroupBatchModal" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="submitGenerateGroupBatch" :disabled="groupBatchLoading" class="px-4 py-2 bg-blue-600 text-white rounded">
            <span v-if="groupBatchLoading" class="inline-block loader mr-2"></span>
            Generate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//import JSZip from "jszip"
//import { saveAs } from "file-saver"
import { ref, computed, onMounted } from 'vue'
import apiClient, { getTickets, deleteTicket, generateBatch, generateBatchForGroups, useTicket, getEvents as apiGetEvents } from '@/api'

/* STATE */
const tickets = ref([])
const events = ref([])
const loading = ref(false)
const error = ref(null)

const page = ref(1)
const perPage = ref(10)
const search = ref('')
const filterStatus = ref('')
const filterEventId = ref('')

const stats = ref({ totalSales: 'KES. 0', pending: 0, confirmed: 0, cancelled: 0, used: 0, unused: 0 })

const showModal = ref(false)
const selectedTicket = ref(null)
const qrSrc = ref(null)

const showGenerateModal = ref(false)
const batchForm = ref({ event_id: '', quantity: 10, price: 1000 })
const batchLoading = ref(false)

const showGenerateGroupModal = ref(false)
const groupBatchForm = ref({ event_id: '', group_size: 5, number_of_tickets:1 , price: 5000 })
const groupBatchLoading = ref(false)

/* HELPERS */

/* normalize various API shapes (array, wrapper, or object map) */
function normalizeTicketArrayFromResponse(res) {
  if (!res) return []
  let payload = res
  if (res && typeof res === 'object' && 'data' in res) payload = res.data

  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.tickets)) return payload.tickets
    if (Array.isArray(payload.items)) return payload.items
    if (Array.isArray(payload.data)) return payload.data

    // convert object map -> array (only include objects that look like tickets)
    const vals = Object.values(payload).filter(v => v && typeof v === 'object' && (v.id || v.ticket_number || v.ticket_code || v.qr_code))
    if (vals.length) return vals
  }
  return []
}

/* Normalize status into canonical tokens */
function normalizeStatus(ticket) {
  if (!ticket) return 'open'
  const raw =
    ticket.status ??
    ticket.state ??
    (ticket.used !== undefined ? (ticket.used ? 'used' : 'unused') : undefined) ??
    (ticket.is_used !== undefined ? (ticket.is_used ? 'used' : 'unused') : undefined) ??
    (ticket.is_paid !== undefined ? (ticket.is_paid ? 'confirmed' : 'pending') : undefined)

  if (raw === undefined || raw === null) return 'open'
  const s = String(raw).toLowerCase().trim()

  if (['pending', 'in-progress', 'processing', 'awaiting_payment'].includes(s)) return 'pending'
  if (['confirmed', 'paid', 'resolved', 'active'].includes(s)) return 'confirmed'
  if (['cancelled', 'closed', 'refunded', 'canceled'].includes(s)) return 'cancelled'
  if (['used', 'redeemed'].includes(s)) return 'used'
  if (['unused', 'not_used', 'available'].includes(s)) return 'unused'

  if (s.includes('used') || s.includes('redeem')) return 'used'
  if (s.includes('unused') || s.includes('avail')) return 'unused'
  if (s.includes('cancel')) return 'cancelled'
  if (s.includes('paid') || s.includes('confirm')) return 'confirmed'
  if (s.includes('pending') || s.includes('process')) return 'pending'

  return 'open'
}

/* status -> css class */
function statusClass(status) {
  const s = String(status ?? '').toLowerCase()
  if (['pending','in-progress','processing'].includes(s)) return 'status-in-progress'
  if (['confirmed','paid','resolved','active'].includes(s)) return 'status-resolved'
  if (['cancelled','closed','refunded','used'].includes(s)) return 'status-closed'
  if (['unused'].includes(s)) return 'status-open'
  return 'status-open'
}

/* friendly label */
function prettyStatus(s) {
  if (!s) return ''
  return String(s).replace(/(^|-)/g, v => v.toUpperCase()).replace(/_/g, ' ')
}

/* date */
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleString()
}

/* compute dashboard stats */
function computeStats() {
  const arr = tickets.value || []
  const pending = arr.filter(t => normalizeStatus(t) === 'pending').length
  const confirmed = arr.filter(t => normalizeStatus(t) === 'confirmed').length
  const cancelled = arr.filter(t => normalizeStatus(t) === 'cancelled').length
  const used = arr.filter(t => normalizeStatus(t) === 'used').length
  const unused = arr.filter(t => normalizeStatus(t) === 'unused').length

  const revenue = arr.reduce((acc, t) => {
    const raw = t.amount ?? t.price ?? t.total ?? 0
    const n = Number(String(raw).replace(/[^\d.-]/g, '')) || 0
    return acc + n
  }, 0)

  stats.value = {
    totalSales: `KES. ${revenue.toLocaleString()}`,
    pending, confirmed, cancelled, used, unused
  }
}

/* FILTERS & PAGINATION */
const filtered = computed(() => {
  const s = (search.value || '').toString().toLowerCase().trim()
  const statusFilter = (filterStatus.value || '').toString().toLowerCase().trim()
  const eventFilter = (filterEventId.value || '').toString().trim()

  return tickets.value.filter(t => {
    const matchesSearch = !s || (
      (t.ticket_number && String(t.ticket_number).toLowerCase().includes(s)) ||
      (t.ticket_code && String(t.ticket_code).toLowerCase().includes(s)) ||
      (t.customer_name && String(t.customer_name).toLowerCase().includes(s)) ||
      (t.phone_number && String(t.phone_number).toLowerCase().includes(s)) ||
      JSON.stringify(t).toLowerCase().includes(s)
    )

    const tStatus = normalizeStatus(t)
    const matchesStatus = !statusFilter || tStatus === statusFilter
    const matchesEvent = !eventFilter || String(t.event_id) === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const startIndex = computed(() => (page.value - 1) * perPage.value)
const endIndex = computed(() => Math.min(startIndex.value + perPage.value, filtered.value.length))
const paginated = computed(() => filtered.value.slice(startIndex.value, endIndex.value))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

/* MODAL HANDLERS */
function viewTicket(ticket) {
  selectedTicket.value = ticket
  qrSrc.value = ticket.qr_code || ticket.qr || null
  showModal.value = true
}
function closeModal() {
  showModal.value = false
  selectedTicket.value = null
  qrSrc.value = null
}

/* DOWNLOAD PDF or ZIP (uses apiClient) */
async function downloadTicket(ticket) {
  if (!ticket?.id) return;

  try {
    const res = await apiClient.get(`/tickets/${ticket.id}/download`, {
      responseType: "blob",
    });

    // Detect file type from response headers
    const contentType = res.headers["content-type"] || "";
    let fileExtension = "pdf"; // default for single
    let fileName = `ticket-${ticket.ticket_number || ticket.id}`;

    if (contentType.includes("zip")) {
      fileExtension = "zip";
      fileName = `group-ticket-${ticket.group_code || ticket.id}`;
    }

    const blob = new Blob([res.data], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Trigger browser download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Failed to download file", e);
    alert("Download failed");
  }
}



/* STUBS for missing actions (so UI won't crash) */
function openNewTicketModal() {
  alert('Open new ticket modal (stub). Implement as needed.')
}
function editTicket(ticket) {
  alert('Edit ticket (stub). Implement as needed for ticket id: ' + (ticket?.id || ticket?.ticket_number))
}

/* BATCH ops */
function openGenerateBatchModal() { showGenerateModal.value = true }
function closeGenerateModal() { showGenerateModal.value = false }
async function submitGenerateBatch() {
  if (!batchForm.value.event_id) { alert('Pick an event'); return }
  batchLoading.value = true
  try {
    const res = await generateBatch({ ...batchForm.value })
    const created = normalizeTicketArrayFromResponse(res)
    tickets.value.push(...created)
    computeStats()
    alert('Batch generated')
    closeGenerateModal()
  } catch (e) {
    console.error('batch failed', e)
    alert('Batch failed')
  } finally { batchLoading.value = false }
}

/* Group batch */
function openGenerateGroupBatchModal() { showGenerateGroupModal.value = true }
function closeGenerateGroupBatchModal() { showGenerateGroupModal.value = false }
async function submitGenerateGroupBatch() {
  if (!groupBatchForm.value.event_id) { alert('Pick an event'); return }
  groupBatchLoading.value = true
  try {
    const res = await generateBatchForGroups({ ...groupBatchForm.value })
    const created = normalizeTicketArrayFromResponse(res)
    tickets.value.push(...created)
    computeStats()
    alert('Group batch generated')
    closeGenerateGroupBatchModal()
  } catch (e) {
    console.error('Group batch failed', e)
    alert('Group batch failed')
  } finally { groupBatchLoading.value = false }
}

/* CRUD */
async function confirmDelete(ticket) {
  if (!confirm(`Delete ticket ${ticket.id}?`)) return
  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter(t => t.id !== ticket.id)
    computeStats()
    alert('Deleted')
  } catch (e) {
    console.error('delete failed', e)
    alert('Delete failed')
  }
}

/* Filters controls */
function applyFilters() { page.value = 1 }
function resetFilters() { search.value = ''; filterStatus.value = ''; filterEventId.value = '' }

/* LOAD */
async function reload() {
  loading.value = true
  try {
    const res = await getTickets()
    tickets.value = normalizeTicketArrayFromResponse(res)
    // fallback in case API returned object map in res.data
    if (!tickets.value.length && res && res.data) {
      tickets.value = normalizeTicketArrayFromResponse(res.data)
    }
    computeStats()
    const evRes = await apiGetEvents()
    events.value = normalizeTicketArrayFromResponse(evRes)
  } catch (e) {
    console.error('load failed', e)
    error.value = e
  } finally { loading.value = false }
}

onMounted(reload)
</script>

<style scoped>
/* loader */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 22px;
  height: 22px;
  animation: spin 1s linear infinite;
}
@keyframes spin { 0%{ transform: rotate(0deg);} 100%{ transform: rotate(360deg);} }

.fade-in { animation: fadeIn .35s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

.status-badge {
  padding: .25rem .75rem;
  border-radius: 9999px;
  font-size: .75rem;
  font-weight: 500;
}
.status-in-progress { background-color: #ffedd5; color: #c2410c; }
.status-resolved { background-color: #d1fae5; color: #065f46; }
.status-closed { background-color: #e5e7eb; color: #4b5563; }
.status-open { background-color: #dbeafe; color: #1e40af; }

@media (max-width: 768px) {
  .loader { width: 30px; height: 30px; }
}
</style>
