<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Navigation Bar -->
    <nav class="bg- text-white shadow-lg z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="mr-4 md:hidden">
              <i class="fas fa-bars text-xl"></i>
            </button>
            <div class="flex-shrink-0 flex items-center">
              <i class="fas fa-qrcode text-2xl mr-2"></i>
              <span class="font-bold text-xl">ScanTicket</span>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium bg-indigo-700">Scanner</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Tickets</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Events</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Analytics</a>
            </div>
          </div>
          <div class="flex items-center">
            <button class="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none">
              <i class="fas fa-bell text-xl"></i>
            </button>
            <div class="ml-3 relative">
              <button class="flex text-sm rounded-full focus:outline-none">
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&q=80"
                  alt="user"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="{'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen}"
        class="sidebar-transition fixed md:relative md:translate-x-0 w-64 bg-dark text-white h-full shadow-lg z-20 transform transition-transform duration-300 ease-in-out"
      >
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold">Menu</h2>
        </div>
        <nav class="mt-5 px-2">
          <a href="#" class="flex items-center px-4 py-3 text-base font-medium rounded-md bg-indigo-700">
            <i class="fas fa-qrcode mr-3"></i>
            Scanner
          </a>
          <a href="#" class="mt-1 flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-700">
            <i class="fas fa-ticket-alt mr-3"></i>
            My Tickets
          </a>
          <a href="#" class="mt-1 flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-700">
            <i class="fas fa-calendar-alt mr-3"></i>
            Events
          </a>
          <a href="#" class="mt-1 flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-700">
            <i class="fas fa-chart-bar mr-3"></i>
            Analytics
          </a>
          <a href="#" class="mt-1 flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-700">
            <i class="fas fa-cog mr-3"></i>
            Settings
          </a>
        </nav>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div
        v-if="sidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
      ></div>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">QR Ticket Scanner</h1>
            <p class="text-gray-600 mt-1">Scan QR codes to validate event tickets</p>
          </div>

          <!-- Scanner Card -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-5 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">Camera Scanner</h2>
              <p class="text-gray-600 mt-1">Position the QR code within the frame to scan</p>
            </div>

            <div class="p-4">
              <!-- Camera Preview Area -->
              <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <!-- Scanner Overlay -->
                <div class="scanner-overlay absolute inset-0 pointer-events-none">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="border-4 border-secondary rounded-lg w-64 h-64 relative pointer-events-auto">
                      <div class="scanner-line"></div>
                    </div>
                  </div>
                </div>

                <!-- Camera Preview -->
                <!-- html5-qrcode will inject video/canvas inside #reader -->
                <div id="reader" class="w-full h-full relative" :class="{'hidden': !cameraActive}"></div>

                <!-- Camera Placeholder -->
                <div v-if="!cameraActive" class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <i class="fas fa-camera text-4xl mb-3"></i>
                  <p class="text-lg">Camera Access Required</p>
                  <p class="mt-2 text-center px-4">Click the button below to enable camera access for scanning</p>
                </div>

                <!-- Scan Result Display -->
                <div
                  v-if="scanResult"
                  class="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4"
                >
                  <div
                    :class="{'bg-green-700': scanResult.status === 'valid', 'bg-red-700': scanResult.status === 'invalid'}"
                    class="p-6 rounded-lg text-white text-center shadow-lg transition-all duration-300"
                  >
                    <i
                      :class="{'fa-check-circle': scanResult.status === 'valid', 'fa-times-circle': scanResult.status === 'invalid'}"
                      class="fas text-6xl mb-4"
                    ></i>
                    <h3 class="text-2xl font-bold">{{ scanResult.message }}</h3>
                    <p v-if="scanResult.details" class="mt-2">{{ scanResult.details }}</p>
                    <p v-if="scanResult.code" class="mt-1 text-sm font-mono opacity-75">
                      Ticket Code: {{ scanResult.code }}
                    </p>
                    <button
                      @click="resetScanner"
                      class="mt-4 px-4 py-2 bg-white text-dark rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      Scan Again
                    </button>
                  </div>
                </div>

                <!-- Loading Overlay -->
                <div
                  v-if="loading"
                  class="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center text-white p-4"
                >
                  <i class="fas fa-sync-alt fa-spin text-4xl mb-4"></i>
                  <p class="text-lg font-medium">Verifying Ticket...</p>
                </div>
              </div>

              <!-- Controls -->
              <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  v-if="!cameraActive"
                  @click="startScanning"
                  class="px-6 py-3 bg-primary hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                >
                  <i class="fas fa-camera mr-2"></i>
                  Enable Camera & Start Scanning
                </button>
                <button
                  v-else
                  @click="stopScanning"
                  class="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                >
                  <i class="fas fa-stop mr-2"></i>
                  Stop Scanning
                </button>

                <button
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                  @click="showHistory = !showHistory"
                >
                  <i class="fas fa-history mr-2"></i>
                  Scan History
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Scans -->
          <div class="mt-8 bg-white rounded-xl shadow-lg overflow-hidden" v-show="showHistory">
            <div class="p-5 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">Recent Scans</h2>
            </div>
            <div class="p-4 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Code</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="scan in scanHistory" :key="scan.code + scan.time">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ scan.code }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ scan.event }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="scan.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >{{ scan.status }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ scan.time }}</td>
                  </tr>
                  <tr v-if="scanHistory.length === 0">
                    <td colspan="4" class="text-center py-4 text-gray-500">No scans yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useTicket } from '@/api'
import { Html5Qrcode } from 'html5-qrcode'

/* Reactive state */
const sidebarOpen = ref(false)
const cameraActive = ref(false)
const loading = ref(false)
const scanResult = ref(null)
const scanHistory = ref([])
const showHistory = ref(false)

let html5QrCode = null
let lastCameraId = null

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

/**
 * Ensure that the injected <video> / <canvas> elements are visible and styled to fill the #reader container.
 * Html5Qrcode injects DOM outside Vue's control; we apply inline styles after start() to make sure
 * the elements are sized correctly and add playsinline to video for mobile.
 */
function ensureInjectedElementsVisible() {
  // small delay to allow library to inject elements
  setTimeout(() => {
    try {
      const container = document.getElementById('reader')
      if (!container) return
      // video and canvas may be children (library uses either)
      const video = container.querySelector('video')
      const canvas = container.querySelector('canvas')
      const wrappers = container.querySelectorAll(':scope > div') // sometimes wrapper divs exist

      const applyStyle = (el) => {
        if (!el) return
        el.style.position = 'absolute'
        el.style.top = '0'
        el.style.left = '0'
        el.style.width = '100%'
        el.style.height = '100%'
        el.style.objectFit = 'cover'
        el.style.zIndex = '1'
        if (el.tagName === 'VIDEO') {
          // avoid mobile forcing fullscreen
          el.setAttribute('playsinline', '')
          el.setAttribute('muted', '')
          el.setAttribute('autoplay', '')
        }
      }

      applyStyle(video)
      applyStyle(canvas)
      wrappers.forEach(w => {
        applyStyle(w)
      })
      // Position overlays above video
      const overlays = document.querySelectorAll('.scanner-overlay')
      overlays.forEach(o => { o.style.zIndex = '5' })
    } catch (e) {
      console.warn('ensureInjectedElementsVisible error', e)
    }
  }, 150)
}

/**
 * Start scanning:
 * - get cameras
 * - prefer back/rear if available (useful on phones)
 * - robustly pick device id (device.id || device.deviceId || device)
 */
const startScanning = async () => {
    // security check: getUserMedia only works on secure contexts or localhost
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        scanResult.value = {
            status: 'invalid',
            message: 'Insecure origin',
            details: 'Camera access requires HTTPS or localhost. Serve the app via localhost or HTTPS.'
        }
        return
    }

    loading.value = true
    scanResult.value = null

    try {
        // create (or clear) instance
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('reader', { verbose: false })
        } else {
            // Clear any previous DOM inserted by prior runs
            try { html5QrCode.clear() } catch (e) { /* ignore */ }
        }

        const qrCodeConfig = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            // Directly use facingMode for robust mobile camera selection
            formats: [Html5Qrcode.QrCode],
            facingMode: 'environment'
        }

        // Check if `facingMode` is supported and available
        try {
            await html5QrCode.start({ facingMode: "environment" }, qrCodeConfig,
                (decodedText, decodedResult) => { handleScan(decodedText) },
                (err) => { /* non-fatal scan errors */ }
            );
        } catch (e) {
            console.warn('FacingMode "environment" failed, falling back to default camera.', e);
            // Fallback to a simpler start if "environment" facing mode is not supported
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                await html5QrCode.start(devices[0].id, qrCodeConfig,
                    (decodedText, decodedResult) => { handleScan(decodedText) },
                    (err) => { /* non-fatal scan errors */ }
                );
            } else {
                throw new Error('No camera devices found and facingMode failed.');
            }
        }

        // After start, ensure the injected elements are visible
        ensureInjectedElementsVisible()

        cameraActive.value = true
        loading.value = false
        console.info('Scanner started.')
    } catch (err) {
        console.error('Camera access / start failed:', err)
        loading.value = false
        cameraActive.value = false
        scanResult.value = {
            status: 'invalid',
            message: 'Camera access failed',
            details: err?.message || String(err)
        }
    }
}

/**
 * stopScanning - stops and clears injected DOM so restart works reliably.
 */
const stopScanning = async () => {
  if (!html5QrCode) {
    cameraActive.value = false
    return
  }
  try {
    await html5QrCode.stop()
  } catch (e) {
    // sometimes stop() throws if already stopped — ignore
    console.warn('html5QrCode.stop() error', e)
  }
  try {
    html5QrCode.clear()
  } catch (e) {
    console.warn('html5QrCode.clear() error', e)
  }
  cameraActive.value = false
  loading.value = false
  console.info('Scanner stopped')
}

/**
 * handleScan - stops scanning, verifies with API, shows result and pushes to history.
 */
const handleScan = async (decodedText) => {
  // immediate stop to avoid duplicate reads
  try { await stopScanning() } catch (e) { /* ignore */ }
  loading.value = true

  try {
    const resp = await useTicket({ ticket_code: decodedText })
    const data = resp.data || {}
    scanResult.value = {
      status: 'valid',
      message: 'Ticket is Valid',
      details: data.message || 'Ticket has been successfully verified.',
      code: decodedText,
      event: data.event_name || data.event || 'Unknown Event'
    }
    addScanToHistory(decodedText, 'valid', scanResult.value.event)
  } catch (err) {
    console.error('API verify error', err)
    const errData = err?.response?.data
    scanResult.value = {
      status: 'invalid',
      message: 'Invalid Ticket',
      details: errData?.error || errData?.message || 'This ticket is not valid or has been used.',
      code: decodedText
    }
    addScanToHistory(decodedText, 'invalid', errData?.event_name || 'N/A')
  } finally {
    loading.value = false
  }
}

/* Adds a scan to front of history */
function addScanToHistory(code, status, event = 'N/A') {
  scanHistory.value.unshift({
    code,
    status: (status || '').charAt(0).toUpperCase() + (status || '').slice(1),
    event,
    time: new Date().toLocaleString()
  })
  // limit history length to avoid memory blow-up
  if (scanHistory.value.length > 200) scanHistory.value.splice(200)
}

const resetScanner = async () => {
  scanResult.value = null
  await stopScanning()
  await startScanning()
}

/* cleanup on unmount */
onBeforeUnmount(async () => {
  try {
    await stopScanning()
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
/* Ensure injected video/canvas fill the reader container if library injects differently.
   This will apply to the injected elements thanks to the #reader rules below. */
#reader,
#reader > div,
#reader > video,
#reader > canvas {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  object-fit: cover !important;
  z-index: 1;
}

/* Make your overlays sit above the camera */
.scanner-overlay {
  position: relative;
  overflow: hidden;
  z-index: 5;
  pointer-events: none; /* let clicks pass through, overlay is visual only */
}
.scanner-overlay .border-secondary {
  pointer-events: auto; /* if overlay needs interactions (rare) */
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 4px;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: scan 2s linear infinite;
}
@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

/* small responsive / layout helpers */
.aspect-video {
  aspect-ratio: 16 / 9;
  min-height: 220px;
}

/* sidebar transition */
.sidebar-transition {
  transition: transform 0.3s ease-in-out;
}

/* quick utilities (if you want to debug) */
.debug-border {
  outline: 2px dashed rgba(255, 0, 0, 0.3);
}
</style>
