<template>
  <div class="min-h-screen bg-gray-100">
    <!-- top header (full width) -->
    <header class="bg-white shadow z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-primary-600 rounded-lg p-2">
              <i class="fas fa-ticket-alt text-white"></i>
            </div>
            <h1 class="text-lg font-semibold text-gray-800">Events Management</h1>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="openModal()"
              class="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-black hover:brightness-95 transition"
            >
              <i class="fas fa-plus mr-2"></i> Add Event
            </button>
            <button @click="reload" class="p-2 rounded-md bg-blue-50 border hover:bg-blue-400">
              <i class="fas fa-sync"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- main container -->
    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- white card that contains the page -->
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Event List</h2>
            <p class="text-sm text-gray-500">Manage events and create ticket batches</p>
          </div>

          <!-- loading -->
          <div v-if="loading" class="py-16 flex flex-col items-center justify-center">
            <div class="loader mb-4"></div>
            <p class="text-gray-600">Loading events…</p>
          </div>

          <!-- empty state -->
          <div v-else-if="events.length === 0" class="py-16 text-center text-gray-500">
            <p>No events found. Click <strong>Add Event</strong> to create your first event.</p>
          </div>

          <!-- grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="ev in events"
              :key="ev.id"
              class="rounded-lg border p-5 bg-white hover:shadow-md transition flex flex-col"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 bg-blue-50 p-3 rounded-md">
                  <i class="fas fa-calendar-alt text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-800">{{ ev.name || ev.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">
                    <i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                    {{ ev.venue ?? '-' }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    <i class="fas fa-clock mr-2 text-gray-400"></i>
                    {{ formatDate(ev.date) }} <span v-if="ev.time">• {{ ev.time }}</span>
                  </p>
                </div>
                <div class="ml-2 text-right">
                  <button @click="openModal(ev)" class="text-indigo-600 hover:text-indigo-800 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="removeEvent(ev.id)" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <p class="text-gray-600 mt-4 text-sm flex-1">{{ ev.description }}</p>

              <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>Tickets: <strong>{{ ev.tickets_count ?? '-' }}</strong></div>
                <div class="text-xs">
                  <span v-if="typeof ev.price !== 'undefined' && ev.price !== null">
                    Price: <strong class="text-gray-800">KES {{ formatNumber(ev.price) }}</strong>
                  </span>
                  <span v-else>Price: <strong>-</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add / Edit modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-xl p-6 shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">{{ editingEvent.id ? 'Edit Event' : 'Create Event' }}</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
        </div>

        <form @submit.prevent="saveEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="editingEvent.name" required class="text-black mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="editingEvent.date" type="date" required class="text-black mt-1 block w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Time</label>
              <input v-model="editingEvent.time" type="time" class="text-black mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
            <input v-model="editingEvent.venue" required class="text-black mt-1 block w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="editingEvent.description" rows="4" required class="text-black mt-1 block w-full rounded-md border px-3 py-2"></textarea>
          </div>

          <!-- NEW: Price field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Price (KES)</label>
            <input
              v-model.number="editingEvent.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="text-black mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div class="flex justify-end space-x-3 mt-3">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 rounded-md bg-primary-600 text-white">
              <span v-if="saving" class="inline-block loader mr-2"></span>
              {{ editingEvent.id ? 'Save' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent
} from '@/api' // adjust path if needed

// UI state
const loading = ref(false)
const saving = ref(false)
const isModalOpen = ref(false)
const events = ref([])

const editingEvent = reactive({
  id: null,
  name: '',
  date: '',
  time: '',
  venue: '',
  description: '',
  status: '',
  price: 0 // <-- price added
})

function resetEditing() {
  editingEvent.id = null
  editingEvent.name = ''
  editingEvent.date = ''
  editingEvent.time = ''
  editingEvent.venue = ''
  editingEvent.description = ''
  editingEvent.status = ''
  editingEvent.price = 0
}

function openModal(ev = null) {
  if (ev) {
    editingEvent.id = ev.id
    editingEvent.name = ev.name ?? ev.name ?? ''
    editingEvent.date = ev.date ?? ''
    editingEvent.time = ev.time ?? ''
    editingEvent.venue = ev.venue ?? ''
    editingEvent.description = ev.description ?? ''
    editingEvent.status = ev.status ?? ''
    editingEvent.price = typeof ev.price !== 'undefined' && ev.price !== null ? Number(ev.price) : 0
  } else {
    resetEditing()
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  resetEditing()
}

function formatDate(v) {
  if (!v) return '-'
  try {
    const d = new Date(v)
    if (isNaN(d.getTime())) return v
    return d.toLocaleDateString()
  } catch {
    return v
  }
}

function formatNumber(val) {
  if (val === null || typeof val === 'undefined') return '-'
  const n = Number(val)
  if (isNaN(n)) return val
  return n.toLocaleString()
}

async function loadEvents() {
  loading.value = true
  try {
    const res = await apiGetEvents()
    const payload = res?.data ?? res
    if (Array.isArray(payload)) events.value = payload
    else if (Array.isArray(payload.events)) events.value = payload.events
    else if (Array.isArray(payload.data)) events.value = payload.data
    else events.value = payload.items ?? payload.events ?? payload.data ?? []
  } catch (err) {
    console.error('loadEvents failed', err)
    events.value = []
  } finally {
    loading.value = false
  }
}

async function saveEvent() {
  if (!editingEvent.name || !editingEvent.date || !editingEvent.venue || !editingEvent.description) {
    alert('Fill name, date, venue and description')
    return
  }

  // price validation
  if (editingEvent.price === null || editingEvent.price === '' || isNaN(Number(editingEvent.price)) || Number(editingEvent.price) < 0) {
    alert('Enter a valid price (>= 0)')
    return
  }

  saving.value = true
  const payload = {
    name: editingEvent.name,
    date: editingEvent.date,
    time: editingEvent.time,
    venue: editingEvent.venue,
    description: editingEvent.description,
    status: editingEvent.status,
    price: Number(editingEvent.price) // include price in payload
  }

  try {
    if (editingEvent.id) {
      const res = await apiUpdateEvent(editingEvent.id, payload)
      const updated = res?.data ?? res
      const idx = events.value.findIndex(e => e.id === editingEvent.id)
      if (idx !== -1) {
        // replace with server response where possible; fallback to payload
        events.value[idx] = updated && updated.id ? updated : { id: editingEvent.id, ...payload }
      }
    } else {
      const res = await apiCreateEvent(payload)
      const created = res?.data ?? res
      if (created && created.id) events.value.unshift(created)
      else events.value.unshift({ id: Date.now(), ...payload })
    }
    closeModal()
  } catch (err) {
    console.error('saveEvent failed', err)
    alert('Save failed — check console')
  } finally {
    saving.value = false
  }
}

async function removeEvent(id) {
  if (!confirm('Delete event?')) return
  try {
    await apiDeleteEvent(id)
    events.value = events.value.filter(e => e.id !== id)
  } catch (err) {
    console.error('delete failed', err)
    alert('Delete failed — check console')
  }
}

async function reload() {
  await loadEvents()
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
/* primary color used in component */
:root {
  --primary-600: #4f46e5;
}

/* small utility for primary color usage */
.bg-primary-600 { background-color: var(--primary-600); }
.text-primary-600 { color: var(--primary-600); }

/* loader */
.loader {
  border: 3px solid rgba(0,0,0,0.05);
  border-top-color: var(--primary-600);
  border-radius: 9999px;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ensure modal content is centered on small screens */
@media (max-width: 640px) {
  .modal > div { width: 100%; margin: 0 12px; }
}
</style>
