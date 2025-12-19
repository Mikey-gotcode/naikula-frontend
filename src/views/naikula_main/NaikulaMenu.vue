<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="py-6 px-8 bg-primary-500 text-white shadow-lg relative">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">NAIKULA</h1>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex space-x-6">
          <router-link to="/" class="text-white hover:text-opacity-80 transition duration-150">HOME</router-link>
          <router-link to="/naikulatickets" class="text-white hover:text-opacity-80 transition duration-150">EVENTS</router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="md:hidden text-white focus:outline-none" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <transition name="fade">
        <nav v-if="menuOpen"
             class="absolute top-full left-0 w-full bg-primary-600 flex flex-col space-y-4 px-8 py-6 md:hidden shadow-lg z-20">
          <router-link to="/" class="text-white hover:bg-primary-500/50 p-2 rounded transition duration-150">HOME</router-link>
          <router-link to="/naikulatickets" class="text-white hover:bg-primary-500/50 p-2 rounded transition duration-150">EVENTS</router-link>
        </nav>
      </transition>
    </header>

    <!-- Main -->
    <main class="flex-grow flex items-center justify-center py-12 px-4">
      <div class="container mx-auto max-w-4xl">
        <div class="flip-book bg-white rounded-xl shadow-2xl overflow-hidden relative">
          <!-- The book container will be filled by onMounted script -->
          <div ref="bookContainer" class="relative w-full h-[70vh]"></div>

          <!-- Controls (kept above pages using very high z-index) -->
          <div
            class="controls flex items-center space-x-8"
            :style="{ zIndex: controlsZ }"
          >
            <!-- Previous Button -->
            <button
              @click="onPrevClick"
              class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 flame-background rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center disabled:opacity-50"
              :disabled="currentPage === 1"
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 19l-7-7 7-7"/>
              </svg>
              Previous
            </button>

            <!-- Page Indicator -->
            <div class="text-primary-700 font-semibold sm:text-sm md:text-sm lg:text-sm px-4 py-2 bg-primary-100 rounded-full flame-background" aria-live="polite">
              Page <span>{{ currentPage }}</span> of <span>{{ totalPages }}</span>
            </div>

            <!-- Next Button -->
            <button
              @click="onNextClick"
              class="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 flame-background rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center disabled:opacity-50"
              :disabled="currentPage === totalPages"
              aria-label="Next page"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 bg-primary-800 text-white text-center">
      <div class="container mx-auto">
        <p>Naikula-Menu &copy; 2025 - Interactive Page Flip Menu</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/*
  Replace these paths if you placed the images somewhere else.
  These point to:
    src/assets/images/naikulamenu/whattoexpect.jpg
    src/assets/images/naikulamenu/whattoexpect2.jpg
*/
const imagePages = [
  "/src/assets/images/naikulamenu/whattoexpect.jpg",
  "/src/assets/images/naikulamenu/whattoexpect2.jpg"
];

const totalPages = imagePages.length;
const currentPage = ref(1);
const bookContainer = ref(null);
const pages = []; // will hold { element, wrapper, front }
let shadow = null;

// keep controls above everything
const controlsZ = 99999;

// base z-index to manage stacking
let topZ = 1000;

const menuOpen = ref(false);
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  console.log("menuOpen:", menuOpen.value);
}

function onNextClick() {
  console.log("Next clicked", { currentPage: currentPage.value, totalPages });
  flipToNext();
}

function onPrevClick() {
  console.log("Previous clicked", { currentPage: currentPage.value, totalPages });
  flipToPrev();
}

onMounted(() => {
  console.log("mounted -> creating pages", totalPages);
  if (!bookContainer.value) {
    console.error("bookContainer ref not found!");
    return;
  }

  // create the pages from the two assets
  imagePages.forEach((src, idx) => {
    const pageIndex = idx + 1;
    const pageWrapper = document.createElement("div");
    pageWrapper.className = "page-wrapper absolute top-0 left-0 w-full h-full";
    pageWrapper.style.zIndex = String(topZ + (totalPages - idx)); // first page on top

    const page = document.createElement("div");
    page.className = `page ${pageIndex === 1 ? "active-page" : "inactive-page"}`;

    const pageFront = document.createElement("div");
    pageFront.className = "page-content page-front";
    pageFront.innerHTML = `<img loading="eager|lazy"src="${src}" alt="Menu page ${pageIndex}" class="w-full h-full object-cover">`;

    page.appendChild(pageFront);
    pageWrapper.appendChild(page);
    bookContainer.value.appendChild(pageWrapper);

    pages.push({ element: page, wrapper: pageWrapper, front: pageFront });
  });

  // add shadow underneath pages
  shadow = document.createElement("div");
  shadow.className = "page-shadow";
  bookContainer.value.appendChild(shadow);

  console.log("pages created:", pages.length);

  // keyboard nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      console.log("keydown ArrowRight");
      flipToNext();
    } else if (e.key === "ArrowLeft") {
      console.log("keydown ArrowLeft");
      flipToPrev();
    }
  });

  // touch nav
  let touchStartX = 0;
  if (bookContainer.value) {
    bookContainer.value.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    bookContainer.value.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      console.log("touchend", { touchStartX, touchEndX, diff });
      if (diff > 50) flipToNext();
      else if (diff < -50) flipToPrev();
    });
  }
});

/* Flip forward (rotate current away to reveal next) */
function flipToNext() {
  console.log("flipToNext called", { currentPage: currentPage.value, totalPages });
  if (currentPage.value >= totalPages) {
    console.log("flipToNext: already at last page");
    return;
  }

  const currentIndex = currentPage.value - 1;
  const nextIndex = currentIndex + 1;
  const current = pages[currentIndex];
  const next = pages[nextIndex];

  if (!current || !next) {
    console.warn("flipToNext: missing pages", { currentIndex, nextIndex });
    return;
  }

  console.log("flipping forward", { currentIndex, nextIndex });

  // bring next wrapper to top and current just below it
  topZ++;
  next.wrapper.style.zIndex = String(topZ);
  topZ++;
  current.wrapper.style.zIndex = String(topZ - 1);

  current.element.classList.add("page-flipping");
  next.element.classList.remove("inactive-page");
  next.element.classList.add("active-page");

  // rotate current page away (animate)
  current.element.style.transform = "rotateY(-180deg)";
  if (shadow) shadow.style.opacity = "0.7";

  console.log("animation started (next)");

  setTimeout(() => {
    // tidy up after animation
    current.element.classList.remove("page-flipping");
    current.element.classList.add("inactive-page");
    current.element.style.transform = ""; // reset so subsequent flips are clean

    if (shadow) shadow.style.opacity = "0";
    currentPage.value++;
    console.log("animation finished (next)", { currentPage: currentPage.value });
  }, 600); // match CSS transition
}

/* Flip backward (prime previous page rotated away then animate it into view) */
function flipToPrev() {
  console.log("flipToPrev called", { currentPage: currentPage.value });
  if (currentPage.value <= 1) {
    console.log("flipToPrev: already at first page");
    return;
  }

  const currentIndex = currentPage.value - 1;
  const prevIndex = currentIndex - 1;
  const current = pages[currentIndex];
  const prev = pages[prevIndex];

  if (!current || !prev) {
    console.warn("flipToPrev: missing pages", { currentIndex, prevIndex });
    return;
  }

  console.log("flipping backward", { currentIndex, prevIndex });

  // Put prev on top of stack and prime it rotated away (so it animates into view)
  topZ++;
  prev.wrapper.style.zIndex = String(topZ);

  // prime previous to be rotated away instantly (no transition): set transform, then force reflow
  prev.element.style.transition = "none";            // temporarily disable transition
  prev.element.style.transform = "rotateY(180deg)";  // set initial rotated-away state
  // force reflow so the browser registers the initial state
  // eslint-disable-next-line no-unused-expressions
  prev.element.getBoundingClientRect();

  // re-enable transition and animate prev to 0deg
  prev.element.style.transition = ""; // restore css transition defined in stylesheet
  prev.element.classList.remove("inactive-page");
  prev.element.classList.add("active-page");

  // also ensure current appears slightly above for the animation
  topZ++;
  current.wrapper.style.zIndex = String(topZ - 1);

  // animate: rotate previous to 0, rotate current to flip away
  prev.element.style.transform = "rotateY(0deg)";
  current.element.classList.add("page-flipping");
  current.element.style.transform = "rotateY(180deg)";
  if (shadow) shadow.style.opacity = "0.7";

  console.log("animation started (prev)");

  setTimeout(() => {
    // cleanup
    current.element.classList.remove("page-flipping");
    current.element.classList.add("inactive-page");
    current.element.style.transform = "";

    prev.element.style.transform = ""; // ensure reset
    if (shadow) shadow.style.opacity = "0";

    currentPage.value--;
    console.log("animation finished (prev)", { currentPage: currentPage.value });
  }, 600); // match CSS transition
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

/* --- Custom Color Definitions (Simulating Tailwind Config) --- */
:root {
  --primary-500: #ff4e00;
  --primary-600: #cc3e00;
  --primary-700: #992e00;
  --primary-800: #3b0e00;
  --primary-100: #ffc9a8;
  --secondary-500: #ff9d00;
  --secondary-600: #cc7d00;
}

.bg-primary-500 { background-color: var(--primary-500); }
.bg-primary-600 { background-color: var(--primary-600); }
.bg-primary-800 { background-color: var(--primary-800); }
.bg-secondary-500 { background-color: var(--secondary-500); }
.hover\:bg-primary-600:hover { background-color: var(--primary-600); }
.hover\:bg-secondary-600:hover { background-color: var(--secondary-600); }
.bg-primary-100 { background-color: var(--primary-100); }
.text-primary-700 { color: var(--primary-700); }

/* Page flip styles */
.page {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.page-content {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.page-front {
  z-index: 2;
}

.inactive-page {
  z-index: 0;
  transform: rotateY(0deg);
}

.page-flipping {
  z-index: 3;
}

.page-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: -5px 5px 20px rgba(0, 0, 0, 0.3);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.flame-background {
  background: linear-gradient(to right, #ff4e00, #ff9d00, #f57f17);
  background-size: 200% auto;
  animation: flameText 5s linear infinite;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.flip-book {
  perspective: 2000px;
}

.page-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999; /* ensure controls remain on top */
}

/* Mobile dropdown transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes flameText {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* small responsive tweaks */
@media (max-width: 768px) {
  .controls { bottom: 18px; }
  .controls button { padding-left: 12px; padding-right: 12px; }
  .page { transition-duration: 0.5s; }
}
</style>
