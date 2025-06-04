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
      <div class="mt-4">
        <button
          @click="redirectToGoogle"
          class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <!-- Google G ikona -->
            <path d="M533.5 278.4c0-17.7-1.6-35-4.6-51.8H272v98h146.8c-6.3 34-25 62.7-53.3 82v67h86.1c50.4-46.6 81.9-114.6 81.9-195.2z" fill="#4285F4"/>
            <path d="M272 544.3c72.6 0 133.7-24.1 178.3-65.3l-86.1-67c-23.9 16.1-54.6 25.7-92.2 25.7-70.9 0-131.1-47.9-152.5-112.5H32.4v70.7C76.6 484.3 168 544.3 272 544.3z" fill="#34A853"/>
            <path d="M119.5 322.2c-10.5-31.5-10.5-65.4 0-96.9v-70.7H32.4c-43.8 87.7-43.8 191.5 0 279.2l87.1-70.7z" fill="#FBBC05"/>
            <path d="M272 107.7c39.5 0 75.1 13.6 103.1 40.3l77.3-77.3C405.7 23 345.1 0 272 0 168 0 76.6 60 32.4 140.2l87.1 70.7C140.9 155.6 201.1 107.7 272 107.7z" fill="#EA4335"/>
          </svg>
          Prijava putem Google
        </button>
      </div>
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

const redirectToGoogle = () => {
  window.location.href = 'http://localhost:8000/auth/google';
}
</script>

<style scoped>
/* Nema dodatnog CSS-a jer sve stilove preuzimamo iz Tailwinda */
</style>
