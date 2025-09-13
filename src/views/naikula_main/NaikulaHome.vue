<template>
  <div class="bg-black text-white">
    <!-- Audio element -->
    <audio ref="sizzleSound" preload="auto">
      <source src="/src/assets/audio/cooking-frying-sizzling-food-free-kitchen-sound-effect-382864.mp3" type="audio/mpeg" />
    </audio>

    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-70 z-10"></div>
      <div class="parallax-bg absolute inset-0 z-0"></div>

      <div class="relative z-20 text-center px-4">
        <h1 class="text-5xl md:text-7xl font-bold mb-4 flame-text" data-aos="fade-up" data-aos-delay="200">NAIKULA</h1>
        <p class="text-xl md:text-2xl mb-8" data-aos="fade-up" data-aos-delay="400">Where Smoke Meets Perfection</p>
        <button @click="openMenu" class="border-2 border-orange-500 px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300" data-aos="fade-up" data-aos-delay="600">
          Explore Our Menu
        </button>
      </div>

      <div class="smoke-effect" ref="smokeContainer"></div>
    </section>

    <!-- About Section -->
    <section class="py-20 px-4 relative">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2" data-aos="fade-right">
            <img src="/src/assets/images/naikulaphotos/IMG_3246.webp" alt="Grilling Experience" class="rounded-lg shadow-2xl w-full" />
          </div>
          <div class="md:w-1/2" data-aos="fade-left">
            <h2 class="text-4xl font-bold mb-6">The Art of <span class="flame-text">Smoking</span></h2>
            <p class="text-gray-300 mb-6 text-lg">
              At Naikula, we've mastered the ancient art of smoking meats and vegetables over slow-burning wood fires.
              Our chefs combine traditional techniques with modern innovation to create unforgettable flavors.
            </p>
            <p class="text-gray-300 mb-8 text-lg">
              Every dish tells a story of passion, patience, and perfection. Join us for an culinary journey that will ignite your senses.
            </p>
            <button class="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-full transition duration-300">Our Story</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-20 px-4 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16" data-aos="fade-up">Culinary <span class="flame-text">Creations</span></h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" ref="galleryRoot">
          <!-- Gallery items -->
          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="100">
            <img src="/src/assets/images/naikulaphotos/IMG_3403.webp" alt="Smoked Ribs" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">Smoked Ribs</h3>
              <p class="text-gray-400">Slow-cooked to perfection with our signature rub</p>
            </div>
          </div>

          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="200">
            <img src="/src/assets/images/naikulaphotos/DSC_0803.webp" alt="Grilled Vegetables" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">BBQ Sauce Dipped Choma Sausages</h3>
              <p class="text-gray-400">Seasonal produce with herb-infused oils</p>
            </div>
          </div>

          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="300">
            <img src="/src/assets/images/naikulaphotos/IMG_3347.webp" alt="Pulled Pork" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">Smoked Chicken</h3>
              <p class="text-gray-400">12-hour smoked pork with tangy barbecue sauce</p>
            </div>
          </div>

          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="400">
            <img src="/src/assets/images/naikulaphotos/DSC_0802.webp" alt="Smoked Brisket" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">Smoked Brisket</h3>
              <p class="text-gray-400">Texas-style beef brisket with dry rub</p>
            </div>
          </div>

          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="500">
            <img src="/src/assets/images/naikulaphotos/IMG_3388.webp" alt="Grilled Seafood" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">Smoked Pork</h3>
              <p class="text-gray-400">Fresh catch with citrus marinade</p>
            </div>
          </div>

          <div class="gallery-item overflow-hidden rounded-xl shadow-2xl" data-aos="zoom-in" data-aos-delay="600">
            <img src="/src/assets/images/naikulaphotos/IMG_3341.webp" alt="Wood-fired Pizza" class="w-full h-64 object-cover" />
            <div class="p-6 bg-gray-800">
              <h3 class="text-2xl font-bold mb-2">Signature Seasoned Spuds</h3>
              <p class="text-gray-400">Neapolitan style with house-made dough</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="relative py-20 px-4 min-h-screen flex items-center justify-center">
      <div ref="curtainLeftRef" class="curtain-left absolute top-0 left-0 w-1/2 h-full bg-black z-30"></div>
      <div ref="curtainRightRef" class="curtain-right absolute top-0 right-0 w-1/2 h-full bg-black z-30"></div>

      <div class="absolute inset-0 overflow-hidden">
        <div class="events-carousel absolute inset-0 flex transition-transform duration-1000" ref="eventsCarouselRef">
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0714.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0728.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0723.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0762.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0723.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0792.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0823.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/IMG_3430.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
          <div class="w-full h-full flex-shrink-0">
            <img src="/src/assets/images/naikulacarousel/DSC_0841.webp" alt="Event" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="relative z-20 max-w-4xl mx-auto text-center bg-black bg-opacity-70 p-12 rounded-2xl backdrop-blur-sm">
        <h2 class="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">Special <span class="flame-text">Events</span></h2>
        <p class="text-xl mb-8" data-aos="fade-up" data-aos-delay="200">
          Join us for exclusive dining experiences, live music nights, and masterclasses with our chefs.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="bg-gray-900 p-6 rounded-xl" data-aos="fade-up" data-aos-delay="300">
            <i data-feather="music" class="text-orange-500 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Live Music</h3>
            <p class="text-gray-400">Every Friday & Saturday</p>
          </div>
          <div class="bg-gray-900 p-6 rounded-xl" data-aos="fade-up" data-aos-delay="400">
            <i data-feather="users" class="text-orange-500 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Masterclasses</h3>
            <p class="text-gray-400">Learn from our experts</p>
          </div>
          <div class="bg-gray-900 p-6 rounded-xl" data-aos="fade-up" data-aos-delay="500">
            <i data-feather="calendar" class="text-orange-500 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Private Events</h3>
            <p class="text-gray-400">Book us for your special occasion</p>
          </div>
        </div>
         <button @click="openTickets" class="border-2 border-orange-500 px-8 py-3 rounded-full hover:bg-orange-500 transition duration-300 mt-8" data-aos="fade-up" data-aos-delay="600">
          Explore Our Events
        </button>
      </div>
    </section>

    <!-- Contact Section (trimmed for brevity, kept original markup) -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row gap-12">
          <div class="md:w-1/2" data-aos="fade-right">
            <h2 class="text-4xl font-bold mb-6">Get In <span class="flame-text">Touch</span></h2>
            <p class="text-gray-300 mb-8 text-lg">
              Ready to experience the magic of Naikula? Reserve your meal today or inquire about our private events.
            </p>
            <div class="space-y-6">
              <div class="flex items-start">
                <!-- <i data-feather="map-pin" class="text-orange-500 mr-4 mt-1"></i> -->
                <!-- <div>
                  <h3 class="text-xl font-bold mb-1">Location</h3>
                  <p class="text-gray-400">123 Smoke Street, Culinary District</p>
                </div> -->
              </div>
              <div class="flex items-start">
                <i data-feather="clock" class="text-orange-500 mr-4 mt-1"></i>
                <div>
                  <h3 class="text-xl font-bold mb-1">Hours</h3>
                  <p class="text-gray-400">Mon-Sun: 8:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div class="flex items-start">
                <i data-feather="phone" class="text-orange-500 mr-4 mt-1"></i>
                <div>
                  <h3 class="text-xl font-bold mb-1">Reservation</h3>
                  <p class="text-gray-400">(+254) 729 049 847</p>
                  <p class="text-gray-400">(+254) 740 337 043</p>
                  <p class="text-gray-400">(+254) 799 209 905</p>
                </div>
              </div>
            </div>
          </div>

          <div class="md:w-1/2" data-aos="fade-left">
            <form class="bg-gray-900 p-8 rounded-2xl">
              <div class="mb-6">
                <label class="block text-gray-300 mb-2" for="name">Name</label>
                <input id="name" type="text" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500" />
              </div>

              <div class="mb-6">
                <label class="block text-gray-300 mb-2" for="email">Email</label>
                <input id="email" type="email" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500" />
              </div>

              <div class="mb-6">
                <label class="block text-gray-300 mb-2" for="message">Message</label>
                <textarea id="message" rows="5" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"></textarea>
              </div>

              <button type="submit" class="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg transition duration-300">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-12 px-4 border-t border-gray-800">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <h2 class="text-3xl font-bold flame-text">NAIKULA</h2>
            <p class="text-gray-500 mt-2">Smoke & Grill Specialists</p>
          </div>

          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-orange-500 transition duration-300">
              <i data-feather="facebook"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-orange-500 transition duration-300">
              <i data-feather="instagram"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-orange-500 transition duration-300">
              <i data-feather="twitter"></i>
            </a>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Naikula. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import feather from 'feather-icons';
import router from '@/router';

gsap.registerPlugin(ScrollTrigger);

/* --- Refs to DOM nodes --- */
const smokeContainer = ref(null);
const sizzleSound = ref(null);
const galleryRoot = ref(null);
const curtainLeftRef = ref(null);
const curtainRightRef = ref(null);
const eventsCarouselRef = ref(null);

/* --- Internal state / handles for cleanup --- */
let smokePuffs = [];
let slidesIntervalId = null;
let galleryPointerOverHandler = null;
let galleryPointerOutHandler = null;
let audioContext = null;
let curtainTrigger = null;
let resizeHandler = null;
let currentIndex = 0; // track index across functions

/* --- Audio unlock on first user gesture --- */
function unlockAudioOnFirstInteraction() {
  const tryUnlock = async () => {
    const audio = sizzleSound.value;
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
    } catch (e) {
      console.debug('AudioContext create/resume failed', e);
    }

    if (audio) {
      try {
        audio.muted = true;
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      } catch (err) {
        console.debug('HTMLAudio unlock attempt failed:', err);
      }
    }
  };

  document.addEventListener('click', tryUnlock, { once: true });
  document.addEventListener('touchstart', tryUnlock, { once: true });
}

/* --- Smoke effect --- */
function createSmokeEffect() {
  const container = smokeContainer.value;
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const puff = document.createElement('div');
    puff.classList.add('smoke-puff');
    const size = Math.random() * 100 + 50;
    puff.style.width = `${size}px`;
    puff.style.height = puff.style.width;
    puff.style.left = `${Math.random() * 100}%`;
    puff.style.bottom = `-50px`;
    puff.style.opacity = '0';
    container.appendChild(puff);
    smokePuffs.push(puff);

    gsap.to(puff, {
      y: -window.innerHeight - 100,
      x: `+=${(Math.random() - 0.5) * 100}`,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      repeat: -1,
      onStart: () => {
        puff.style.opacity = Math.random() * 0.3 + 0.1;
      }
    });
  }
}

function openMenu(){
    router.push({
        name:'NaikulaMenu'
    })
}

function openTickets(){
    router.push({
        name:'NaikulaTickets'
    })
}
/* --- Gallery interaction (delegated, snappier) --- */
function setupGalleryInteraction() {
  const audio = sizzleSound.value;
  const root = galleryRoot.value;
  if (!root) return;

  galleryPointerOverHandler = (ev) => {
    const item = ev.target.closest('.gallery-item');
    if (!item || !root.contains(item)) return;

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.debug('Audio play prevented:', e));
    }

    // snappier hover duration
    gsap.to(item, { scale: 1.05, duration: 0.18, ease: 'power1.out', boxShadow: '0 18px 28px rgba(0,0,0,0.35)' });
  };

  galleryPointerOutHandler = (ev) => {
    const item = ev.target.closest('.gallery-item');
    if (!item || !root.contains(item)) return;
    gsap.to(item, { scale: 1, duration: 0.18, ease: 'power1.in', boxShadow: '0 8px 12px rgba(0,0,0,0.08)' });
  };

  root.addEventListener('pointerover', galleryPointerOverHandler);
  root.addEventListener('pointerout', galleryPointerOutHandler);
}

/* --- Curtain + Carousel effect (fixed directions & reliable trigger)
       IMPORTANT: this version ensures the strip width and slide widths are set so -percent% translations work reliably. */
function setupCurtainEffect() {
  const curtainLeft = curtainLeftRef.value;
  const curtainRight = curtainRightRef.value;
  const eventsSection = eventsCarouselRef.value;
  if (!curtainLeft || !curtainRight || !eventsSection) return;

  // Use the outer <section> as the trigger for stable behaviour
  const triggerEl = eventsSection.closest('section') || eventsSection.parentElement || eventsSection;

  // Ensure initial positions
  gsap.set(curtainLeft, { xPercent: 0, transformOrigin: 'left center' });
  gsap.set(curtainRight, { xPercent: 0, transformOrigin: 'right center' });

  // Destroy existing trigger if any
  if (curtainTrigger && typeof curtainTrigger.kill === 'function') {
    try { curtainTrigger.kill(); } catch(e) {}
    curtainTrigger = null;
  }

  curtainTrigger = ScrollTrigger.create({
    trigger: triggerEl,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(curtainLeft, { xPercent: -100, duration: 0.8, ease: 'power2.out' });
      gsap.to(curtainRight, { xPercent: 100, duration: 0.8, ease: 'power2.out' });
    },
    onLeaveBack: () => {
      gsap.to([curtainLeft, curtainRight], { xPercent: 0, duration: 0.6, ease: 'power2.in' });
    },
    invalidateOnRefresh: true
  });

  // --- Ensure carousel strip and slides sizing are correct ---
  // prevent CSS transitions from fighting GSAP
  try {
    eventsSection.style.transition = 'none';
    eventsSection.style.willChange = 'transform';
    eventsSection.style.display = 'flex';
  } catch (e) {}

  const slides = Array.from(eventsSection.querySelectorAll(':scope > div'));
  const totalSlides = slides.length || 1;

  // set explicit widths so percent transforms work predictably
  try {
    eventsSection.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / totalSlides}%`;
      slide.style.flex = '0 0 auto';
    });
  } catch (e) {
    console.debug('Failed to set slide widths:', e);
  }

  // keep currentIndex defined outside so resize can restore position
  currentIndex = 0;

  // function to move to next slide with snappier duration
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    const percent = (currentIndex * (100 / totalSlides));
    gsap.to(eventsSection, {
      x: `-${percent}%`,
      duration: 0.7,
      ease: 'power2.inOut'
    });
  }

  // start/stop helpers (we'll keep them but do not auto-pause on hover)
  function startCarouselInterval() {
    if (slidesIntervalId) return;
    slidesIntervalId = setInterval(nextSlide, 3000);
  }
  function stopCarouselInterval() {
    if (!slidesIntervalId) return;
    clearInterval(slidesIntervalId);
    slidesIntervalId = null;
  }

  // start the carousel
  stopCarouselInterval();
  startCarouselInterval();

  // handle window resize: recalc widths and restore current transform
  resizeHandler = () => {
    // recompute sizes
    try {
      const slidesNow = Array.from(eventsSection.querySelectorAll(':scope > div'));
      const count = slidesNow.length || 1;
      eventsSection.style.width = `${count * 100}%`;
      slidesNow.forEach(s => {
        s.style.width = `${100 / count}%`;
        s.style.flex = '0 0 auto';
      });
      // re-calc translate for currentIndex
      const percent = (currentIndex * (100 / count));
      gsap.set(eventsSection, { x: `-${percent}%` });
      // also refresh ScrollTrigger measurements
      ScrollTrigger.refresh();
    } catch (err) {
      console.debug('resizeHandler error', err);
    }
  };

  window.addEventListener('resize', resizeHandler);
}

/* --- Parallax setup --- */
function setupParallax() {
  gsap.utils.toArray('.parallax-layer').forEach(layer => {
    gsap.to(layer, {
      y: -(layer.offsetHeight * 0.3 || 200),
      ease: 'none',
      scrollTrigger: {
        trigger: layer.parentElement,
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });
}

/* --- Lifecycle --- */
onMounted(async () => {
  await nextTick();

  AOS.init({ duration: 1000, once: true });
  feather.replace();

  // Unlock audio on first user gesture
  unlockAudioOnFirstInteraction();

  // Initialize features
  createSmokeEffect();
  setupGalleryInteraction();
  setupCurtainEffect();
  setupParallax();

  // Force a ScrollTrigger refresh after setup (ensures correct sizes/positions)
  setTimeout(() => ScrollTrigger.refresh(), 300);
});

onBeforeUnmount(() => {
  // Remove delegated listeners
  const root = galleryRoot.value;
  if (root && galleryPointerOverHandler) root.removeEventListener('pointerover', galleryPointerOverHandler);
  if (root && galleryPointerOutHandler) root.removeEventListener('pointerout', galleryPointerOutHandler);
  galleryPointerOverHandler = null;
  galleryPointerOutHandler = null;

  // Remove resize handler
  if (resizeHandler) {
    try { window.removeEventListener('resize', resizeHandler); } catch (e) {}
    resizeHandler = null;
  }

  // Remove smoke elements
  smokePuffs.forEach(p => p.remove());
  smokePuffs = [];

  // Clear carousel interval
  if (slidesIntervalId) {
    clearInterval(slidesIntervalId);
    slidesIntervalId = null;
  }

  // Kill created curtain trigger
  if (curtainTrigger && typeof curtainTrigger.kill === 'function') {
    curtainTrigger.kill();
    curtainTrigger = null;
  }

  // Kill all ScrollTriggers and GSAP tweens
  try { ScrollTrigger.getAll().forEach(t => t.kill()); } catch (e) { /* ignore */ }
  try { gsap.killTweensOf('*'); } catch (e) { /* ignore */ }

  // Close AudioContext if we created one
  if (audioContext && typeof audioContext.close === 'function') {
    audioContext.close().catch(() => {});
    audioContext = null;
  }
});
</script>


<style>
/* Keep the custom fonts & styles. You can move fonts into your global CSS if preferred. */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@300;400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Lobster&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
:root {
  --flame-gradient: linear-gradient(135deg, #ff4e00, #ff9d00, #ff4e00);
}

body, .body {
  font-family: 'Raleway', sans-serif;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: "Alfa Slab One", serif;
}

/* flame animation */
.flame-bg {
  background: var(--flame-gradient);
  background-size: 400% 400%;
  animation: flameAnimation 8s ease infinite;
}

@keyframes flameAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* curtain transitions */
.curtain-left, .curtain-right {
  transition: transform 1.2s cubic-bezier(0.65, 0, 0.35, 1);
}

/* Ensure the carousel behaves as a flex strip and let JS set widths */
.events-carousel {
  transition: none !important;
  will-change: transform;
  display: flex !important;        /* ensure flex layout */
  align-items: stretch;
}

/* smoke effect */
.smoke-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.smoke-puff {
  position: absolute;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
}

/* gallery hover: remove transform here so GSAP handles scaling */
.gallery-item {
  transition: box-shadow 0.18s ease;
}

.gallery-item:hover {
  box-shadow: 0 18px 28px rgba(0, 0, 0, 0.35);
}

/* flame text gradient */
.flame-text {
  background: linear-gradient(to right, #ff4e00, #ff9d00, #ff4e00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: flameText 3s linear infinite;
}

@keyframes flameText {
  to {
    background-position: 200% center;
  }
}

/* parallax background sample */
.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.parallax-bg {
  background-image: url('/src/assets/images/naikulaphotos/chickenwithspudskachumbari.webp');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}
</style>
