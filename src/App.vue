<script setup>
import { ref, onMounted, provide } from "vue";
import { Sun, Moon } from "lucide-vue-next"; // Import icons

const theme = ref(localStorage.getItem("theme") || "light");

// Function to toggle theme
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem("theme", theme.value);
};

// Apply theme on page load
onMounted(() => {
  document.documentElement.classList.toggle("dark", theme.value === "dark");
});

// Provide theme globally so child components can access it
provide("theme", theme);
provide("toggleTheme", toggleTheme);
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
    <!-- Theme Toggle Button -->
    <!-- <button 
      @click="toggleTheme"
      class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      <Sun v-if="theme === 'light'" class="w-6 h-6 text-yellow-500" />
      <Moon v-else class="w-6 h-6 text-gray-300" />
    </button> -->

    <router-view />
  </div>
</template>