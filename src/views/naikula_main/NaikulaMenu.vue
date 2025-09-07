<template>
  <div class="coming-soon-root relative min-h-screen flex items-center justify-center text-center">
    <!-- Background Video -->
    <video
      class="bg-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source
        src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-green-mountains-and-a-lake-847-large.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>

    <!-- Cinematic Overlay and Content -->
    <div class="content absolute inset-0 flex flex-col items-center justify-center p-8 rounded-xl m-4">
      <div class="space-y-6">
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-bold fade-in"
          :style="{ animationDelay: '0.5s' }"
        >
          {{ title }}
        </h1>

        <p
          class="text-lg sm:text-xl md:text-2xl text-gray-300 slide-in-up"
          :style="{ animationDelay: '1.0s' }"
        >
          {{ tagline }}
        </p>

        <div
          class="flex justify-center items-center space-x-4 md:space-x-8 mt-12 slide-in-up"
          :style="{ animationDelay: '1.5s' }"
        >
          <div v-if="days > 0" class="flex flex-col items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
            <span class="text-4xl md:text-5xl font-bold gradient-text">{{ days }}</span>
            <span class="text-sm md:text-base text-gray-400">Days</span>
          </div>

          <div class="flex flex-col items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
            <span class="text-4xl md:text-5xl font-bold gradient-text">{{ hours }}</span>
            <span class="text-sm md:text-base text-gray-400">Hours</span>
          </div>

          <div class="flex flex-col items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
            <span class="text-4xl md:text-5xl font-bold gradient-text">{{ minutes }}</span>
            <span class="text-sm md:text-base text-gray-400">Minutes</span>
          </div>

          <div class="flex flex-col items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
            <span class="text-4xl md:text-5xl font-bold gradient-text">{{ seconds }}</span>
            <span class="text-sm md:text-base text-gray-400">Seconds</span>
          </div>
        </div>

        <div class="pt-12 slide-in-up" :style="{ animationDelay: '2.0s' }">
          <button class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 transform-gpu">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const title = ref('A New Era is Dawning');
const tagline = ref('Prepare for an unparalleled experience. Coming Soon.');

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

// target date is 14 days from now
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 14);

let intervalId = null;

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    days.value = hours.value = minutes.value = seconds.value = 0;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return;
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
}

onMounted(() => {
  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style>
/* fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.coming-soon-root {
  font-family: 'Inter', sans-serif;
  overflow: hidden; /* prevent scroll from video */
  min-height: 100vh;
  background-color: #0f1724; /* fallback */
}

/* background video styles (covers viewport) */
.bg-video {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
}

/* overlay content */
.content {
  background: rgba(0, 0, 0, 0.65);
}

/* simple entrance animations */
.fade-in {
  animation: fadeIn 2s ease-in-out forwards;
}
.slide-in-up {
  animation: slideInUp 1.5s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* gradient text used for numbers */
.gradient-text {
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(90deg, #fb7185, #f97316);
}

/* subtle custom scrollbar (component scoped-ish - will apply in browsers that support it) */
.coming-soon-root ::-webkit-scrollbar {
  width: 8px;
}
.coming-soon-root ::-webkit-scrollbar-thumb {
  background-color: #333;
  border-radius: 4px;
}
</style>
