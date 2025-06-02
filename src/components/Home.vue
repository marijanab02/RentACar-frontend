<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />

    <!-- Glavni sadržaj -->
    <main class="flex-grow flex flex-col justify-center items-center text-center px-4">
      <h1 class="text-5xl font-extrabold text-gray-800 mb-6">Dobrodošli na Rent A Car</h1>
      <p class="text-lg text-gray-600 max-w-2xl mb-8">
        Izaberite jedno od sljedećih:
      </p>
      <div class="flex space-x-6">
        <router-link
          to="/cars"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
        >
          Pregled automobila
        </router-link>
        <router-link
          to="/users"
          class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
        >
          Pregled korisnika
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
/* Nema dodatnih stilova jer se sve radi preko Tailwinda */
</style>
