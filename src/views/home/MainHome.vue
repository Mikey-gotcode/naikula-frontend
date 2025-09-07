<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header
      class="py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-700"
    >
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-2">
          <img
            src="/src/assets/icons/naikulalogo.png"
            alt="Mookh Logo"
            class="rounded-full w-8 h-8 md:w-10 md:h-10"
          />
          <span class="text-xl md:text-2xl font-bold">NAIKULA.</span>
        </div>
        <div class="hidden md:flex items-center space-x-6 text-sm text-gray-400">
          <a href="#" class="hover:text-white">LEARN MORE</a>
          <router-link to="/login" class="[hover:text-white]">LOGIN</router-link>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button class="text-gray-400 hover:text-white">🔍</button>
        <a href="#" class="text-gray-400 hover:text-white">🛒</a>
        <button class="text-gray-400 hover:text-white">👤</button>
      </div>
    </header>

    <!-- Main -->
    <main class="container mx-auto px-4 md:px-8 py-8">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div class="flex items-center space-x-4 mb-4 md:mb-0">
          <div class="bg-gray-800 text-gray-300 py-2 px-6 rounded-full cursor-pointer hover:bg-gray-700">
            Featured Staff Picks
          </div>
          <div class="bg-yellow-400 text-gray-900 py-2 px-6 rounded-full font-semibold cursor-pointer">
            Events
          </div>
        </div>

        <!-- quick stats -->
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-400">
            Events: <span class="text-white font-semibold">{{ events.length }}</span>
          </div>
          <div class="text-sm text-gray-400">
            Tickets: <span class="text-white font-semibold">{{ totalTickets }}</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-gray-800 rounded-lg p-4 mb-12 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select v-model="filters.country" class="bg-gray-700 text-white p-3 rounded-lg border border-gray-600">
            <option value="all">COUNTRY: ALL</option>
            <option value="kenya">Kenya</option>
            <option value="uganda">Uganda</option>
          </select>

          <div class="flex items-center bg-gray-700 rounded-lg p-1.5 border border-gray-600">
            <input type="date" v-model="filters.startDate" class="bg-transparent text-white p-1.5 w-full" />
            <span class="text-gray-400 mx-2">→</span>
            <input type="date" v-model="filters.endDate" class="bg-transparent text-white p-1.5 w-full" />
          </div>

          <select v-model="filters.eventType" class="bg-gray-700 text-white p-3 rounded-lg border border-gray-600">
            <option value="all">EVENT TYPE: ALL</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="music">Music</option>
            <option value="theatre">Theatre</option>
          </select>

          <select v-model="filters.sortBy" class="bg-gray-700 text-white p-3 rounded-lg border border-gray-600">
            <option value="upcoming">SORT BY: UPCOMING</option>
            <option value="date">Date</option>
            <option value="popular">Popularity</option>
          </select>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="applyFilters" class="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            FILTER
          </button>
          <button @click="resetFilters" class="bg-gray-700 text-gray-300 py-3 px-6 rounded-lg border border-gray-600">
            Reset
          </button>
        </div>
      </div>

      <!-- Events -->
      <div v-if="loading" class="text-center text-lg text-gray-400">
        Loading events...
      </div>

      <div v-else-if="error" class="text-center text-red-400">
        Error loading data: {{ errorMessage }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="event in filteredEvents" :key="event.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div class="relative">
            <img :src="event.imageUrl || placeholderImage" :alt="event.title" class="w-full h-48 object-cover" />
            <div class="absolute top-2 left-2 bg-white text-gray-900 p-2 rounded-lg font-bold text-center">
              <span class="text-sm block">{{ event.date.day }}</span>
              <span class="text-xs block uppercase">{{ event.date.month }}</span>
            </div>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-bold mb-2">{{ event.title }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ event.description }}</p>

            <div class="flex items-center text-gray-400 text-sm mb-2">
              ⏰ <span class="ml-2">{{ event.time || event.prettyTime }}</span>
            </div>

            <div class="flex items-center text-gray-400 text-sm mb-2">
              📍 <span class="ml-2">{{ event.location || event.venue || 'TBA' }}</span>
            </div>

            <div class="flex items-center justify-between mt-4">
              <div class="text-sm text-gray-300">
                Tickets: <span class="text-white font-semibold">{{ ticketsByEvent(event.id) }}</span>
              </div>

              <button @click="openEvent(event)"
                class="bg-yellow-400 text-gray-900 px-3 py-1 rounded-md font-semibold">
                View
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredEvents.length === 0" class="col-span-full text-center text-gray-400">
          No events match your filters.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getEvents, getITickets } from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();

const events = ref([]);
const tickets = ref([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref(null);

const placeholderImage = "https://placehold.co/600x400/364234/EFEFEF?text=No+Image";

/**
 * Normalize helpers
 * (handles axios responses, arrays, or numeric-keyed maps)
 */
function normalizeArrayFromResponse(res, itemKeyCandidates = []) {
  if (!res) return []
  let payload = res
  if (res && typeof res === "object" && "data" in res) payload = res.data

  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === "object") {
    // if payload has candidate key like 'events'
    for (const k of itemKeyCandidates) {
      if (Array.isArray(payload[k])) return payload[k]
    }
    // convert numeric-keyed object => array
    const vals = Object.values(payload).filter(v => typeof v === "object")
    if (vals.length) return vals
  }
  return []
}

/* Simple event shape normalizer so template can expect fields */
function mapEventShape(e) {
  // prefer common keys used in many APIs, provide fallbacks
  return {
    id: e.id ?? e.event_id ?? e._id ?? null,
    title: e.title ?? e.name ?? e.event_title ?? "Untitled Event",
    description: e.description ?? e.summary ?? e.desc ?? "",
    imageUrl: e.image_url ?? e.imageUrl ?? e.image ?? placeholderImage,
    // Accept start_date, date, event_date, or fallback to created_at
    start_date: e.start_date ?? e.date ?? e.event_date ?? e.created_at ?? null,
    // friendly parse for day/month/time
    date: (() => {
      const d = e.start_date ?? e.date ?? e.event_date ?? e.created_at ?? null
      if (!d) return { day: "--", month: "??" }
      const parsed = new Date(d)
      if (isNaN(parsed.getTime())) {
        // attempt simple string split like '2025-08-31'
        const parts = String(d).split(/[-T ]/).filter(Boolean)
        if (parts.length >= 3) {
          const month = new Date(parts[0], Number(parts[1]) - 1, parts[2]).toLocaleString(undefined, { month: "short" })
          return { day: parts[2], month }
        }
        return { day: "--", month: "??" }
      }
      return {
        day: String(parsed.getDate()).padStart(2, "0"),
        month: parsed.toLocaleString(undefined, { month: "short" })
      }
    })(),
    time: e.time ?? e.start_time ?? e.pretty_time ?? null,
    location: e.location ?? e.venue ?? e.place ?? null,
    country: (e.country || e.location_country || "kenya").toString().toLowerCase(),
    eventType: (e.eventType || e.event_type || e.type || "other").toString().toLowerCase()
  }
}
function openEvent(ev) {
  // Preferred: push id only and let EventDetail fetch
  // router.push({ name: 'EventDetail', params: { id: ev.id } })

  // Optional: include the whole event object in history.state for instant render,
  // plus the id param so EventDetail can still fetch fresh data.
  router.push({
    name: 'EventDetail',
    params: { id: ev.id },
    state: { event: ev }
  });
}

/* fetch events + tickets using api methods */
async function fetchData() {
  loading.value = true
  error.value = false
  errorMessage.value = null

  try {
    const [evRes, tkRes] = await Promise.allSettled([getEvents(), getITickets(events.id)])

    // events
    if (evRes.status === "fulfilled") {
      const rawEvents = normalizeArrayFromResponse(evRes.value, ["events", "data", "items"])
      events.value = rawEvents.map(mapEventShape)
    } else {
      console.warn("getEvents failed", evRes.reason)
      // keep events empty and set an error flag
      error.value = true
      errorMessage.value = (evRes.reason?.message || "Failed to load events")
    }

    // tickets
    if (tkRes.status === "fulfilled") {
      const rawTickets = normalizeArrayFromResponse(tkRes.value, ["tickets", "data", "items"])
      tickets.value = rawTickets.map(t => {
        // normalize ticket minimally
        return {
          id: t.id ?? t.ticket_id ?? t._id,
          event_id: t.event_id ?? t.event ?? (t.event && t.event.id) ?? null,
          ticket_number: t.ticket_number ?? t.ticket_code ?? t.code ?? null,
          status: t.status ?? (t.is_paid ? "confirmed" : (t.used !== undefined ? (t.used ? "used" : "unused") : null)),
          price: t.price ?? t.amount ?? t.total ?? null,
          created_at: t.created_at ?? t.purchased_at ?? t.createdAt ?? null
        }
      })
    } else {
      console.warn("getTickets failed", tkRes.reason)
      // still allow events rendering: set tickets to []
      tickets.value = []
      if (!error.value) { // if events already errored we keep that message
        error.value = true
        errorMessage.value = (tkRes.reason?.message || "Failed to load tickets")
      }
    }

  } catch (e) {
    console.error("fetch error", e)
    error.value = true
    errorMessage.value = e.message || "Unknown error"
  } finally {
    loading.value = false
  }
}

/* filters reactive */
const filters = ref({
  country: "all",
  startDate: "",
  endDate: "",
  eventType: "all",
  sortBy: "upcoming"
})

/* computed filtered events */
const filteredEvents = computed(() => {
  let temp = events.value.slice()

  // country
  if (filters.value.country !== "all") {
    temp = temp.filter(e => (e.country || "").toLowerCase() === filters.value.country)
  }

  // event type
  if (filters.value.eventType !== "all") {
    temp = temp.filter(e => (e.eventType || "").toLowerCase() === filters.value.eventType)
  }

  // date range - we interpret start_date on event
  if (filters.value.startDate) {
    const start = new Date(filters.value.startDate)
    temp = temp.filter(e => {
      if (!e.start_date) return false
      const ed = new Date(e.start_date)
      return !isNaN(ed.getTime()) && ed >= start
    })
  }
  if (filters.value.endDate) {
    const end = new Date(filters.value.endDate)
    // include entire day
    end.setHours(23, 59, 59, 999)
    temp = temp.filter(e => {
      if (!e.start_date) return false
      const ed = new Date(e.start_date)
      return !isNaN(ed.getTime()) && ed <= end
    })
  }

  // sorting
  if (filters.value.sortBy === "date" || filters.value.sortBy === "upcoming") {
    temp.sort((a, b) => {
      const da = new Date(a.start_date || a.created_at || 0).getTime()
      const db = new Date(b.start_date || b.created_at || 0).getTime()
      return da - db
    })
  } else if (filters.value.sortBy === "popular") {
    // popularity heuristic: events with more tickets first
    temp.sort((a, b) => ticketsByEvent(b.id) - ticketsByEvent(a.id))
  }

  return temp
})

/* actions */
const applyFilters = () => {
  // simple helper - keeping function for UI button, filtering is reactive
  console.log("apply filters", filters.value)
}

const resetFilters = () => {
  filters.value.country = "all"
  filters.value.startDate = ""
  filters.value.endDate = ""
  filters.value.eventType = "all"
  filters.value.sortBy = "upcoming"
}

/* helpers for tickets */
function ticketsByEvent(eventId) {
  if (!tickets.value || !tickets.value.length) return 0
  return tickets.value.filter(t => String(t.event_id) === String(eventId)).length
}

const totalTickets = computed(() => tickets.value.length)

/* initial load */
onMounted(fetchData)
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
