<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-96 overflow-hidden">
      <!-- Slider Header -->
      <div class="flex justify-around mb-6">
        <button
          :class="['w-1/2 py-2 font-semibold transition', formMode === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500']"
          @click="formMode = 'login'"
        >
          Login
        </button>
        <button
          :class="['w-1/2 py-2 font-semibold transition', formMode === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500']"
          @click="formMode = 'register'"
        >
          Register
        </button>
      </div>

      <!-- Slider Forms -->
      <transition name="slide-fade" mode="out-in">
        <!-- LOGIN FORM -->
        <form v-if="formMode === 'login'" key="login" @submit.prevent="handleLogin">
          <input v-model="email" type="email" placeholder="Email"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="password" type="password" placeholder="Password"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit"
            class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <!-- REGISTER FORM -->
        <form v-else key="register" @submit.prevent="handleRegister">
          <input v-model="name" type="text" placeholder="Full Name"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="email" type="email" placeholder="Email"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="password" type="password" placeholder="Password"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="password_confirmation" type="password" placeholder="Confirm Password"
            class="text-black w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit"
            class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Register
          </button>
        </form>
      </transition>

      <!-- Error Display -->
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const formMode = ref('login') // 'login' | 'register'
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const name = ref('')
const error = ref(null)

const handleLogin = async () => {
  try {
    const user = await auth.login({ email: email.value, password: password.value })
    redirectByRole(user)
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  }
}

const handleRegister = async () => {
  try {
    const user = await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })
    redirectByRole(user)
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  }
}

function redirectByRole(user) {
  if (user.role === 'admin') {
    router.push('/admin')
  } else if (user.role === 'scanner' || user.role === 'ticket-scanner') {
    router.push('/scanner')
  } else {
    error.value = 'Unauthorized role'
  }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
