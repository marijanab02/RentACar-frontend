<template>
<Navbar />
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
  
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
      <h2 class="text-2xl font-extrabold text-gray-800 mb-6 text-center">Prijava</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-gray-700 font-medium mb-1" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Unesite email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Lozinka -->
        <div>
          <label class="block text-gray-700 font-medium mb-1" for="password">Lozinka</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Unesite lozinku"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Gumb za prijavu -->
        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow"
          >
            Prijavi se
          </button>
        </div>
      </form>

      <!-- Link na registraciju -->
      <p class="text-sm text-center text-gray-600 mt-4">
        Nemate račun? 
        <router-link to="/register" class="text-blue-600 hover:underline font-medium">
          Registrirajte se
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value);
  if (success) {
    router.push(auth.isAdmin() ? '/users' : '/');
  } else {
    alert('Neuspješna prijava! Provjerite podatke.');
  }
};
</script>

<style scoped>
/* Nema dodatnog CSS-a jer sve stilove preuzimamo iz Tailwinda */
</style>
