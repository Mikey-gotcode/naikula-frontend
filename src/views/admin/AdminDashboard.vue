<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
      :class="{'sidebar-mobile active': isSidebarOpen, 'sidebar-mobile': !isSidebarOpen}"
      class="sidebar w-64 bg-white shadow-lg fixed h-full z-30 lg:static lg:translate-x-0"
    >
      <div class="p-5 border-b">
        <h1 class="text-2xl font-bold text-primary flex items-center">
          <i class="fas fa-ticket-alt mr-2"></i>
          TicketMaster
        </h1>
        <p class="text-gray-500 text-sm">Event Management System</p>
      </div>

      <div class="p-4">
        <ul class="space-y-2">
          <li>
            <a href="#" class="flex items-center p-3 text-white bg-primary rounded-lg">
              <i class="fas fa-home mr-3"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-calendar-alt mr-3"></i>
              <span>Events</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-ticket-alt mr-3"></i>
              <span>Tickets</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-user-shield mr-3"></i>
              <span>Admins</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-qrcode mr-3"></i>
              <span>Scanners</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-chart-bar mr-3"></i>
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="absolute bottom-0 w-full p-4 border-t">
        <div class="flex items-center">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" class="w-10 h-10 rounded-full">
          <div class="ml-3">
            <p class="font-medium">John Admin</p>
            <p class="text-gray-500 text-sm">Administrator</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden lg:ml-64">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="lg:hidden text-gray-500 mr-4">
              <i class="fas fa-bars text-xl"></i>
            </button>
            <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
          <div class="flex items-center space-x-4">
            <button class="relative text-gray-500">
              <i class="fas fa-bell text-xl"></i>
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="relative">
              <button class="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" class="w-8 h-8 rounded-full">
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-12 text-gray-500">Loading dashboard...</div>
        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="card bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">Total Events</p>
                  <p class="text-black text-3xl font-bold mt-2">{{ stats.totalEvents }}</p>
                </div>
                <div class="p-3 rounded-full bg-blue-100">
                  <i class="fas fa-calendar-alt text-blue-500 text-xl"></i>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-500">Events created in system</div>
            </div>

            <div class="card bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">Total Tickets</p>
                  <p class="text-black text-3xl font-bold mt-2">{{ stats.totalTickets }}</p>
                </div>
                <div class="p-3 rounded-full bg-green-100">
                  <i class="fas fa-ticket-alt text-green-500 text-xl"></i>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-500">Tickets generated</div>
            </div>

            <div class="card bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">Active Scanners</p>
                  <p class="text-black text-3xl font-bold mt-2">{{ stats.activeScanners }}</p>
                </div>
                <div class="p-3 rounded-full bg-purple-100">
                  <i class="fas fa-qrcode text-purple-500 text-xl"></i>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-500">Connected scanner devices (placeholder)</div>
            </div>

            <div class="card bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">Total Revenue</p>
                  <p class="text-black text-3xl font-bold mt-2">{{ stats.totalRevenueFormatted }}</p>
                </div>
                <div class="p-3 rounded-full bg-yellow-100">
                  <i class="fas fa-dollar-sign text-yellow-500 text-xl"></i>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-500">Revenue from payment records</div>
            </div>
          </div>

          <!-- Recent Tickets / Upcoming Events -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="card bg-white rounded-xl shadow">
              <div class="p-5 border-b flex items-center justify-between">
                <h3 class="text-black text-lg font-semibold">Recent Tickets</h3>
                <div class="space-x-2">
                  <button @click="openTicketsHtml" class="text-sm text-primary">Open HTML View</button>
                  <button @click="refreshData" class="text-sm text-gray-600">Refresh</button>
                </div>
              </div>

              <div class="table-container">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="ticket in recentTickets" :key="ticket.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ ticket.id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.eventName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="ticket.statusClass" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{{ ticket.status || 'unknown' }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket.priceDisplay }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="p-4 border-t text-center">
                <button @click="goToTickets" class="text-primary font-medium">View All Tickets</button>
              </div>
            </div>

            <!-- Upcoming Events -->
            <div class="card bg-white rounded-xl shadow">
              <div class="p-5 border-b">
                <h3 class="text-black text-lg font-semibold">Upcoming Events</h3>
              </div>
              <div class="p-4 space-y-4">
                <div v-for="event in upcomingEvents" :key="event.id" class="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div class="p-3 rounded-lg bg-blue-50">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                  </div>
                  <div class="ml-4">
                    <h4 class=" text-black font-medium">{{ event.title }}</h4>
                    <p class="text-gray-500 text-sm">{{ event.start_date || event.date || 'TBA' }} • {{ event.time || '' }}</p>
                  </div>
                  <div class="ml-auto text-right">
                    <p class="text-sm font-medium">{{ event.soldTickets || 0 }} tickets</p>
                    <p class="text-xs text-gray-500">Sold</p>
                  </div>
                </div>
              </div>

              <div class="p-4 border-t text-center">
                <button @click="goToEvents"  class="text-primary font-medium">View All Events</button>
              </div>
            </div>
          </div>

          <!-- Management columns (Tickets/Admins/Scanners) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Tickets Management -->
            <div class="card bg-white rounded-xl shadow">
              <div class="p-5 border-b flex justify-between items-center">
                <h3 class="text-black text-lg font-semibold">Ticket Management</h3>
                <button class="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <i class="fas fa-plus mr-1"></i> Add Ticket
                </button>
              </div>

              <div class="p-4">
                <div class="flex space-x-2 mb-4">
                  <input v-model="ticketSearch" type="text" placeholder="Search tickets..." class="flex-1 border rounded-lg px-4 py-2 text-sm">
                  <button @click="searchTickets" class="bg-gray-100 border rounded-lg px-4 py-2 text-sm">
                    <i class="fas fa-search"></i>
                  </button>
                </div>

                <div class="space-y-3">
                  <div v-for="ticket in filteredTicketList" :key="ticket.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p class="font-medium">{{ ticket.id }}</p>
                      <p class="text-gray-500 text-sm">{{ ticket.eventName }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteTicket(ticket.id)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div v-if="filteredTicketList.length === 0" class="text-gray-400 text-sm">No tickets found.</div>
                </div>
              </div>
            </div>

            <!-- Admins Management -->
            <div class="card bg-white rounded-xl shadow">
              <div class="p-5 border-b flex justify-between items-center">
                <h3 class="text-black text-lg font-semibold">Admin Management</h3>
                <button class="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <i class="fas fa-plus mr-1"></i> Add Admin
                </button>
              </div>

              <div class="p-4">
                <!-- currently placeholders — provide an endpoint /admin/admins to fetch real data -->
                <div class="space-y-3">
                  <div v-for="admin in admins" :key="admin.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div class="flex items-center">
                      <img :src="admin.image" alt="Admin" class="w-8 h-8 rounded-full">
                      <div class="ml-3">
                        <p class="font-medium">{{ admin.name }}</p>
                        <p class="text-gray-500 text-sm">{{ admin.role }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scanners Management -->
            <div class="card bg-white rounded-xl shadow">
              <div class="p-5 border-b flex justify-between items-center">
                <h3 class="text-black text-lg font-semibold">Scanner Management</h3>
                <button class="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center">
                  <i class="fas fa-plus mr-1"></i> Add Scanner
                </button>
              </div>

              <div class="p-4">
                <div class="space-y-3">
                  <div v-for="scanner in scanners" :key="scanner.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div class="flex items-center">
                      <div class="bg-purple-100 p-2 rounded-lg">
                        <i class="fas fa-qrcode text-purple-500"></i>
                      </div>
                      <div class="ml-3">
                        <p class="font-medium">{{ scanner.name }}</p>
                        <p class="text-gray-500 text-sm">{{ scanner.status }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
/*
  AdminDashboard.vue
  - Uses the api utilities you provided (src/api.js)
  - Saves minimal local state, computes derived stats.
  - Notes: endpoints for admins/scanners are placeholders. Add endpoints like
    GET /admin/admins and GET /admin/scanners if you want to populate them from the backend.
*/

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import {
  getEvents,
  getTickets,
  getPayments,
  viewTicketsHTML,
  deleteTicket as apiDeleteTicket
} from '@/api'; // adjust path if needed

const isSidebarOpen = ref(false);
const loading = ref(true);
const error = ref(null);

const events = ref([]);
const tickets = ref([]);
const payments = ref([]);



// placeholder lists for admins/scanners — create backend endpoints to replace these
const admins = ref([
  { id: 1, name: 'John Admin', role: 'Super Admin', image: 'https://randomuser.me/api/portraits/men/32.jpg' }
]);
const scanners = ref([
  { id: 1, name: 'Main Entrance', status: 'Active' }
]);

const ticketSearch = ref('');

const router = useRouter()

// Toggle sidebar for mobile
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// Fetch data from API
async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const [eventsRes, ticketsRes, paymentsRes] = await Promise.allSettled([
      getEvents(),
      getTickets(),
      getPayments()
    ]);

    if (eventsRes.status === 'fulfilled') {
      events.value = Array.isArray(eventsRes.value.data) ? eventsRes.value.data : [];
    } else {
      console.error('getEvents error:', eventsRes.reason);
    }

    if (ticketsRes.status === 'fulfilled') {
      tickets.value = Array.isArray(ticketsRes.value.data) ? ticketsRes.value.data : [];
    } else {
      console.error('getTickets error:', ticketsRes.reason);
    }

    if (paymentsRes.status === 'fulfilled') {
      payments.value = Array.isArray(paymentsRes.value.data) ? paymentsRes.value.data : [];
    } else {
      // not critical — payments may not be implemented
      console.error('getPayments error:', paymentsRes.reason);
    }
  } catch (e) {
    console.error(e);
    error.value = 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
}

// Derived stats
const stats = computed(() => {
  const totalEvents = events.value.length;
  const totalTickets = tickets.value.length;

  // Sum payments amount — try several common field names
  const revenue = payments.value.reduce((acc, p) => {
    const amt = Number(p.amount ?? p.total ?? p.price ?? p.value ?? 0);
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  // activeScanners is placeholder; replace with real endpoint if you have one
  const activeScanners = scanners.value.length;

  function formatCurrency(v) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'KES' }).format(v);
  }

  return {
    totalEvents,
    totalTickets,
    activeScanners,
    totalRevenue: revenue,
    totalRevenueFormatted: formatCurrency(revenue)
  };
});

// Build a small recentTickets array (show newest first)
const recentTickets = computed(() => {
  // Attempt to map event_id to event name if possible
  const eventById = {};
  events.value.forEach(e => {
    // event.id OR e.id depending on backend
    eventById[e.id ?? e._id ?? e.event_id] = e.name ?? e.title ?? e.title ?? `Event ${e.id ?? ''}`;
  });

  return tickets.value
    .slice() // copy
    .reverse() // assume DB returns oldest-first; reverse to get newest first
    .slice(0, 10)
    .map(t => {
      const eventName = (t.event?.name) || eventById[t.event_id] || eventById[t.event?.id] || `Event ${t.event_id ?? ''}`;
      const price = t.price ?? t.amount ?? null;
      const ticketNumberOrId = t.ticket_number ?? t.code ?? t.id;
      return {
        id: ticketNumberOrId,
        eventName,
        status: t.status ?? (t.is_paid ? 'Paid' : 'Unused'),
        statusClass: (t.status === 'used' || t.status === 'expired') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
        priceDisplay: price != null ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'KES' }).format(Number(price)) : '-'
      };
    });
});

// Build upcomingEvents from events — attempt to sort by date if provided
const upcomingEvents = computed(() => {
  const items = events.value.slice();

  // Try to parse a start_date or date field — this is best-effort
  items.sort((a, b) => {
    const ad = a.start_date ?? a.date ?? a.start ?? null;
    const bd = b.start_date ?? b.date ?? b.start ?? null;
    if (!ad && !bd) return 0;
    if (!ad) return 1;
    if (!bd) return -1;
    const at = Date.parse(ad);
    const bt = Date.parse(bd);
    if (isNaN(at) && isNaN(bt)) return 0;
    if (isNaN(at)) return 1;
    if (isNaN(bt)) return -1;
    return at - bt;
  });

  return items.slice(0, 6).map(e => ({
    id: e.id ?? e._id,
    title: e.name ?? e.title ?? `Event ${e.id ?? ''}`,
    start_date: e.start_date ?? e.date ?? null,
    time: e.time ?? e.start_time ?? '',
    soldTickets: e.sold_tickets ?? e.tickets_sold ?? 0
  }));
});

// Tickets list filtering
const filteredTicketList = computed(() => {
  const q = ticketSearch.value.trim().toLowerCase();
  if (!q) return recentTickets.value;
  return recentTickets.value.filter(t => {
    return String(t.id).toLowerCase().includes(q) || String(t.eventName).toLowerCase().includes(q);
  });
});

// Actions
function searchTickets() {
  // computed already reactive
}

async function openTicketsHtml() {
  try {
    // viewTicketsHTML returns HTML from the backend. open in new window.
    const res = await viewTicketsHTML();
    const w = window.open('', '_blank');
    if (!w) {
      alert('Blocked by popup blocker — please allow popups to view ticket preview');
      return;
    }
    w.document.open();
    w.document.write(res.data);
    w.document.close();
  } catch (e) {
    console.error('Failed to open tickets HTML:', e);
    alert('Failed to open tickets HTML preview. See console for details.');
  }
}

function goToTickets() {
  // navigation: if you're using vue-router, you'd router.push('/admin/tickets')
  // For now simply open the admin tickets API JSON in a new tab
  router.push('/admin/ticketsmanagement')
}


function goToEvents() {
  // navigation: if you're using vue-router, you'd router.push('/admin/tickets')
  // For now simply open the admin tickets API JSON in a new tab
  router.push('/admin/eventsmanagement')
}

async function deleteTicket(id) {
  if (!confirm('Delete ticket #' + id + '?')) return;
  try {
    await apiDeleteTicket(id);
    // remove locally
    tickets.value = tickets.value.filter(t => (t.id ?? t.ticket_number ?? t.code) !== id);
  } catch (e) {
    console.error('deleteTicket error', e);
    alert('Failed to delete ticket. Check console.');
  }
}

async function refreshData() {
  await fetchData();
}

// initial load
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* small scoped styles — keep tailwind for the bulk */
.sidebar-mobile {
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}
.sidebar-mobile.active {
  transform: translateX(0);
}
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
.table-container { max-height: 400px; overflow-y: auto; }
.text-primary { color: #4f46e5; }
.bg-primary { background: #4f46e5; }
</style>
