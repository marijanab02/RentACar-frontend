<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Lijeva strana: Logo/ime i linkovi -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-2xl font-extrabold text-blue-600">
            Rent A Car
          </router-link>
          <router-link
            to="/cars"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Automobili
          </router-link>
          <router-link
            to="/users"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Korisnici
          </router-link>
        </div>

        <!-- Desna strana: Prijava / Registracija / Odjava -->
        <div class="flex items-center space-x-4">
          <template v-if="auth.isLoggedIn()">
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            >
              Odjava
            </button>
          </template>
          <template v-else>
            <router-link
              to="/register"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            >
              Registracija
            </router-link>
            <router-link
              to="/login"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            >
              Prijava
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth' // putanja do tvog auth store-a
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login') // vrati korisnika na login stranicu
}
</script>
