<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-4 py-10">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block loader mb-4"></div>
        <div class="text-gray-400">Loading event...</div>
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-400">
        <p>Failed to load event: {{ errorMessage }}</p>
        <button @click="fetchAll" class="mt-4 px-4 py-2 bg-yellow-400 text-black rounded">Retry</button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left column: Poster + About -->
        <div class="lg:col-span-1">
          <img
            :src="event.imageUrl || placeholderImage"
            :alt="event.title"
            class="w-full rounded-lg object-cover shadow-lg mb-6"
            style="min-height: 320px; max-height: 480px;"
          />

          <div class="bg-gray-900 rounded-lg p-6">
            <h1 class="text-2xl font-bold text-white mb-2">{{ event.title }}</h1>

            <div class="text-gray-400 text-sm mb-4">
              <div class="flex items-center mb-1"><i class="fas fa-map-marker-alt mr-2"></i> {{ event.venue || event.location }}</div>
              <div class="flex items-center mb-1"><i class="far fa-calendar-alt mr-2"></i> {{ prettyDateRange }}</div>
              <div class="flex items-center"><i class="far fa-clock mr-2"></i> {{ event.time || 'TBA' }}</div>
            </div>

            <h3 class="text-sm text-yellow-400 font-semibold mb-2">ABOUT</h3>
            <p class="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
              {{ event.description || 'No description available.' }}
            </p>
          </div>
        </div>

        <!-- Right column: Ticket options -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-gray-900 rounded-lg p-6">
            <h2 class="text-lg font-semibold mb-4">Tickets Available</h2>

            <!-- Single tickets -->
            <div>
              <h3 class="text-sm text-gray-400 font-semibold mb-3">Single Tickets</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="tk in singleTickets"
                  :key="tk.id"
                  class="bg-black/30 p-4 rounded-lg border border-gray-800"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="text-sm text-gray-300 font-semibold">{{ tk.label || tk.title || ticketLabel(tk) }}</div>
                      <div class="text-xs text-gray-400 mt-1">{{ ticketValidOn(tk) }}</div>
                    </div>

                    <div class="text-right">
                      <div class="text-lg font-bold">KES {{ displayPrice(tk).toLocaleString() }}</div>
                      <div class="text-xs text-gray-400">Per ticket</div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button @click="decrement(tk._representativeId)" class="px-2 py-1 bg-gray-800 rounded disabled:opacity-50" :disabled="qtyFor(tk._representativeId) <= 0">-</button>
                      <div class="px-4 py-1 bg-gray-800 rounded w-16 text-center">{{ qtyFor(tk._representativeId) }}</div>
                      <button @click="increment(tk._representativeId)" class="px-2 py-1 bg-gray-800 rounded">+</button>
                    </div>

                    <div class="text-sm text-gray-300">
                      <div>Subtotal</div>
                      <div class="font-semibold">KES {{ (displayPrice(tk) * qtyFor(tk._representativeId)).toLocaleString() }}</div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center space-x-3">
                    <button @click="addToCart(tk)" class="px-4 py-2 bg-yellow-400 text-black rounded font-semibold">Add to cart</button>
                    <button @click="quickBuy(tk)" class="px-4 py-2 bg-transparent border border-gray-700 rounded text-gray-200">Quick buy</button>
                    <div v-if="availabilityText(tk)" class="ml-auto text-xs text-red-400">{{ availabilityText(tk) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Group tickets -->
            <div class="mt-6">
              <h3 class="text-sm text-gray-400 font-semibold mb-3">Group Tickets</h3>
              <div v-if="groupTickets.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="tk in groupTickets"
                  :key="tk.groupKey"
                  class="bg-black/30 p-4 rounded-lg border border-gray-800"
                >
                  <div class="flex justify-between">
                    <div>
                      <div class="text-sm text-gray-300 font-semibold">{{ tk.label || tk.title || ticketLabel(tk) }}</div>
                      <div class="text-xs text-gray-400 mt-1">Group size: <span class="font-medium">{{ tk.group_size || tk.capacity || '—' }}</span></div>
                      <div class="text-xs text-gray-400 mt-1">{{ ticketValidOn(tk) }}</div>
                    </div>

                    <div class="text-right">
                      <div class="text-lg font-bold">KES {{ displayPrice(tk).toLocaleString()}}</div>
                      <div class="text-xs text-gray-400">Per group</div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button @click="decrement(tk._representativeId)" class="px-2 py-1 bg-gray-800 rounded disabled:opacity-50" :disabled="qtyFor(tk._representativeId) <= 0">-</button>
                      <div class="px-4 py-1 bg-gray-800 rounded w-16 text-center">{{ qtyFor(tk._representativeId) }}</div>
                      <button @click="increment(tk._representativeId)" class="px-2 py-1 bg-gray-800 rounded">+</button>
                    </div>

                    <div class="text-sm text-gray-300">
                      <div>Subtotal</div>
                      <div class="font-semibold">KES {{ (displayPrice(tk) * qtyFor(tk._representativeId)).toLocaleString() }}</div>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center space-x-3">
                    <button @click="addToCart(tk)" class="px-4 py-2 bg-yellow-400 text-black rounded font-semibold">Add to cart</button>
                    <button @click="quickBuy(tk)" class="px-4 py-2 bg-transparent border border-gray-700 rounded text-gray-200">Quick buy</button>
                    <div v-if="availabilityText(tk)" class="ml-auto text-xs text-red-400">{{ availabilityText(tk) }}</div>
                  </div>
                </div>
              </div>

              <div v-else class="text-gray-400">No group tickets available.</div>
            </div>
          </div>

          <!-- Cart summary -->
          <div class="bg-gray-900 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div class="text-gray-400">Cart items: <span class="text-white font-semibold">{{ cartStore.totalCount }}</span></div>
              <div class="text-gray-400">Total: <span class="text-white font-semibold">KES {{ cartStore.totalAmount.toLocaleString() }}</span></div>
            </div>

            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <button @click="goToCart" class="px-5 py-2 bg-transparent border border-gray-700 rounded">View Cart</button>
              <button @click="proceedToCheckout" class="px-5 py-2 bg-yellow-400 text-black font-semibold rounded">Checkout</button>
              <button @click="quickBuyCart" class="px-5 py-2 bg-indigo-600 text-white font-semibold rounded">Quick buy cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * EventDetail.vue (corrected)
 *
 * Key fixes:
 *  - mapTicket now recognizes group tickets by `group_id` (not only group_size)
 *  - groupTickets dedupes by group_id when present (else falls back to group_size or unique id)
 *  - representative id assigned per group (used for qty map)
 *
 * Requirements:
 *  - `getEvent`, `getITicketsByEvent`, `initiatePayment` exist in '@/api'
 *  - Pinia cart store at '@/store/cart' exposing useCartStore() with these methods/properties:
 *      - loadFromCookie(), saveToCookie(), addOrUpdate(item), items, totalAmount, totalCount, asPayload
 *    (Adjust store names if yours differ.)
 */

import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEvent, getITicketsByEvent, initiatePayment } from '@/api'
import { useCartStore } from '@/store/cart'

const route = useRoute()
const router = useRouter()
const eventId = route.params.id

const cartStore = useCartStore()
if (typeof cartStore.loadFromCookie === 'function') {
  cartStore.loadFromCookie()
}

const loading = ref(true)
const error = ref(false)
const errorMessage = ref(null)

const event = ref({})
const rawTickets = ref([]) // raw array from API
const placeholderImage = '/src/assets/images/naikulaposter.png'

// qty map keyed by representative id (for single tickets we use the ticket id; for group tickets we use representative id)
const qtyMap = ref({})

// normalize and mapping helpers
function normalizeArray(res, keys = []) {
  if (!res) return []
  let p = res
  if (res && typeof res === 'object' && 'data' in res) p = res.data
  if (Array.isArray(p)) return p
  for (const k of keys) {
    if (p[k] && Array.isArray(p[k])) return p[k]
  }
  if (p && typeof p === 'object') {
    const vals = Object.values(p).filter(v => typeof v === 'object')
    if (vals.length) return vals
  }
  return []
}

function mapEvent(e) {
  return {
    id: e.id ?? e.event_id ?? e._id ?? null,
    title: e.title ?? e.name ?? 'Untitled event',
    description: e.description ?? e.summary ?? e.body ?? '',
    imageUrl: e.image_url ?? e.imageUrl ?? e.image ?? placeholderImage,
    start_date: e.start_date ?? e.date ?? e.event_date ?? e.created_at ?? null,
    end_date: e.end_date ?? e.ends_at ?? null,
    time: e.time ?? e.start_time ?? null,
    location: e.location ?? e.venue ?? e.place ?? null,
    raw: e
  }
}

/**
 * CORRECTED mapTicket:
 * - treats ticket as a group if group_id exists OR group_size > 0 OR explicit flag
 * - preserves group_id and group_size fields
 */
function mapTicket(t) {
  const groupSize = t.group_size ?? null
  const hasGroupId = t.group_id ?? null
  const isGroup =
    !!(
      (groupSize && Number(groupSize) > 0) ||
      hasGroupId ||
      t.is_group ||
      (t.type && String(t.type).toLowerCase() === 'group')
    )

  return {
    id: t.id ?? t.ticket_id ?? t._id ?? null,
    title: t.title ?? t.name ?? t.label ?? null,
    label: t.label ?? t.title ?? t.name ?? null,
    price: Number(t.price ?? t.amount ?? t.total ?? 0) || 0,
    status: (t.status ?? (t.used !== undefined ? (t.used ? 'used' : 'unused') : null)) ?? null,
    group_id: hasGroupId ?? null,      // Keep original group_id if present
    group_size: groupSize,
    is_group: isGroup,
    valid_on: t.valid_on ?? t.date ?? t.starts_at ?? null,
    availability: t.available ?? t.remaining ?? t.stock ?? null,
    raw: t
  }
}

async function fetchAll() {
  loading.value = true
  error.value = false
  errorMessage.value = null

  try {
    const [evRes, tkRes] = await Promise.allSettled([
      getEvent(eventId),
      getITicketsByEvent(eventId)
    ])

    if (evRes.status === 'fulfilled') {
      const raw = evRes.value && evRes.value.data ? evRes.value.data : evRes.value
      event.value = mapEvent(raw)
    } else {
      error.value = true
      errorMessage.value = (evRes.reason?.message || 'Failed to load event')
    }

    if (tkRes.status === 'fulfilled') {
      const arr = normalizeArray(tkRes.value, ['tickets', 'data', 'items'])
      rawTickets.value = arr.map(mapTicket)
    } else {
      rawTickets.value = []
      if (!error.value) {
        error.value = true
        errorMessage.value = (tkRes.reason?.message || 'Failed to load tickets')
      }
    }
  } catch (err) {
    error.value = true
    errorMessage.value = err.message || 'Unknown error'
  } finally {
    buildRepresentativeKeys()
    loading.value = false
  }
}

onMounted(fetchAll)

/* Representative building & computed lists */

/**
 * singleTickets returns ONE representative single ticket (earliest by valid_on/created)
 */
const singleTickets = computed(() => {
  const singles = rawTickets.value.filter(t => !t.is_group)
  if (!singles.length) return []
  singles.sort((a, b) => {
    const da = a.valid_on ? new Date(a.valid_on).getTime() : (a.raw?.created_at ? new Date(a.raw.created_at).getTime() : Infinity)
    const db = b.valid_on ? new Date(b.valid_on).getTime() : (b.raw?.created_at ? new Date(b.raw.created_at).getTime() : Infinity)
    return (da || Infinity) - (db || Infinity)
  })
  const rep = { ...singles[0] }
  rep._representativeId = rep.id
  return [rep]
})

/**
 * groupTickets: dedupe by group_id when present, otherwise by group_size, otherwise by ticket id
 * - each group entry has groupKey (string) and _representativeId (ticket id)
 */
const groupTickets = computed(() => {
  const groups = rawTickets.value.filter(t => t.is_group)
  const map = new Map()

  for (const t of groups) {
    // prefer group_id if present; else size-based key; else unique fallback
    const key = t.group_id ? String(t.group_id) : (t.group_size ? `size_${t.group_size}` : `g_${t.id}`)

    if (!map.has(key)) {
      // pick this ticket as representative for the group
      const copy = { ...t, groupKey: key, _representativeId: t.id }
      map.set(key, copy)
    } else {
      // optionally prefer the representative with earliest valid_on
      const existing = map.get(key)
      const exDate = existing.valid_on ? new Date(existing.valid_on).getTime() : Infinity
      const tDate = t.valid_on ? new Date(t.valid_on).getTime() : Infinity
      if (tDate < exDate) {
        map.set(key, { ...t, groupKey: key, _representativeId: t.id })
      }
    }
  }

  return Array.from(map.values())
})

/* Build qtyMap keys for all representative ids so UI can bind safely */
function buildRepresentativeKeys() {
  const keys = []
  singleTickets.value.forEach(t => keys.push(t._representativeId))
  groupTickets.value.forEach(t => keys.push(t._representativeId))
  rawTickets.value.forEach(t => keys.push(t.id))
  for (const k of Array.from(new Set(keys))) {
    if (!(k in qtyMap.value)) qtyMap.value[k] = 0
  }
}

/* Display helpers */
function ticketLabel(tk) { return tk.label || tk.title || `Ticket ${tk.id}` }
function ticketValidOn(tk) {
  if (!tk || !tk.valid_on) return ''
  const d = new Date(tk.valid_on)
  if (!isNaN(d.getTime())) return d.toLocaleString()
  return String(tk.valid_on)
}
function displayPrice(tk) { return Number(tk.price || 0) }

/* qty helpers */
function qtyFor(repId) { return qtyMap.value[repId] ?? 0 }
function increment(repId) { qtyMap.value[repId] = (qtyMap.value[repId] ?? 0) + 1 }
function decrement(repId) {
  const q = qtyMap.value[repId] ?? 0
  if (q > 0) qtyMap.value[repId] = q - 1
}

/* Cart operations using store */
function addToCart(tk) {
  const repId = tk._representativeId ?? tk.id
  const qty = qtyFor(repId)
  if (!qty || qty <= 0) { alert('Pick a quantity first'); return }

  const groupSize = Number(tk.group_size) || 1
  const price = displayPrice(tk)
  const ticketsConsumed = qty * groupSize
  // choose a unique ticket_key: prefer groupKey for group entries, else repId
  const ticket_key = tk.groupKey ?? repId

  // call store method (store is expected to persist to cookie inside)
  cartStore.addOrUpdate({
    ticket_key,
    ticket_id: repId,
    label: ticketLabel(tk),
    qty,
    unit_price: price,
    group_size: groupSize,
    tickets_consumed: ticketsConsumed,
    event_id: event.value.id
  })

  // reset UI qty
  qtyMap.value[repId] = 0

  // ensure cookie persistence if available
  if (typeof cartStore.saveToCookie === 'function') cartStore.saveToCookie()

  alert('Added to cart')
}

function goToCart() {
  // push a cart/checkout route - here we navigate to a named route EventCheckout
  router.push({ name: 'EventCheckout', query: { eventId: event.value.id } }).catch(() => {})
}

function proceedToCheckout() {
  if (typeof cartStore.saveToCookie === 'function') cartStore.saveToCookie()
  router.push({ name: 'EventCheckout', query: { eventId: event.value.id } }).catch(() => {})
}

/* availability text */
function availabilityText(tk) {
  if (tk.availability === null || tk.availability === undefined) return null
  if (Number(tk.availability) === 0) return 'Sold out'
  if (Number(tk.availability) <= 5) return `${tk.availability} left`
  return null
}

/* quick buy single item */
async function quickBuy(tk) {
  const repId = tk._representativeId ?? tk.id
  const qty = qtyFor(repId)
  if (!qty || qty <= 0) { alert('Pick a quantity for quick buy'); return }
  const groupSize = Number(tk.group_size) || 1
  const payload = {
    items: [{
      ticket_id: repId,
      qty,
      unit_price: displayPrice(tk),
      group_size: groupSize,
      tickets_consumed: qty * groupSize
    }],
    total: displayPrice(tk) * qty,
    event_id: event.value.id
  }
  try {
    loading.value = true
    const res = await initiatePayment(payload)
    const checkout = res?.data?.checkout_url || res?.data?.redirect_url || null
    if (checkout) {
      if (typeof cartStore.saveToCookie === 'function') cartStore.saveToCookie()
      window.location.href = checkout
    } else {
      addToCart(tk)
    }
  } catch (err) {
    console.error('quickBuy failed', err)
    alert('Quick buy failed. Try again.')
  } finally {
    loading.value = false
  }
}

/* quick buy cart */
async function quickBuyCart() {
  if (!cartStore.items.length) { alert('Cart is empty'); return }
  const payload = {
    items: cartStore.asPayload,
    total: cartStore.totalAmount,
    event_id: event.value.id
  }
  try {
    loading.value = true
    const res = await initiatePayment(payload)
    const checkout = res?.data?.checkout_url || res?.data?.redirect_url || null
    if (checkout) {
      if (typeof cartStore.saveToCookie === 'function') cartStore.saveToCookie()
      window.location.href = checkout
    } else {
      alert('Payment initiated. Check your phone for instructions.')
    }
  } catch (err) {
    console.error('quickBuyCart failed', err)
    alert('Quick buy failed. Try again.')
  } finally {
    loading.value = false
  }
}

/* totals exposed from store for template */
const cartTotalAmount = computed(() => cartStore.totalAmount)
const cartTotalCount = computed(() => cartStore.totalCount)

/* pretty date range */
const prettyDateRange = computed(() => {
  if (!event.value.start_date && !event.value.end_date) return 'TBA'
  try {
    const s = event.value.start_date ? new Date(event.value.start_date).toLocaleDateString() : ''
    const e = event.value.end_date ? new Date(event.value.end_date).toLocaleDateString() : ''
    return s && e ? `${s} - ${e}` : (s || e || 'TBA')
  } catch {
    return event.value.start_date || 'TBA'
  }
})

/* keep representative keys up-to-date when tickets change */
watchEffect(() => buildRepresentativeKeys())
</script>

<style scoped>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  border-top: 4px solid #facc15;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin { 0%{ transform: rotate(0deg);} 100%{ transform: rotate(360deg);} }

.bg-black\/30 { background-color: rgba(0,0,0,0.30); }
</style>
