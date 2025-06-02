<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navigacijska traka -->
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
          <!-- Desna strana: Prijava / Registracija -->
          <div class="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </nav>

    <!-- Glavni sadržaj -->
    <main class="flex-grow flex flex-col justify-center items-center px-4">
      <div class="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-extrabold text-gray-800 mb-6 text-center">Registracija korisnika</h2>
        <form @submit.prevent="submitForm" class="space-y-5">
          <!-- Ime -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="fname">Ime</label>
            <input
              id="fname"
              v-model="form.fname"
              type="text"
              placeholder="Unesite ime"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Prezime -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="lname">Prezime</label>
            <input
              id="lname"
              v-model="form.lname"
              type="text"
              placeholder="Unesite prezime"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
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
              v-model="form.password"
              type="password"
              placeholder="Unesite lozinku"
              required
              minlength="6"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Broj vozačke dozvole -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="lic_num">Broj vozačke dozvole</label>
            <input
              id="lic_num"
              v-model="form.lic_num"
              type="text"
              placeholder="Unesite broj vozačke"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Broj mobitela -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="phone_num">Broj mobitela</label>
            <input
              id="phone_num"
              v-model="form.phone_num"
              type="text"
              placeholder="Unesite broj mobitela"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Spol -->
          <div>
            <label class="block text-gray-700 font-medium mb-1" for="gender">Spol</label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Odaberite spol</option>
              <option value="M">Muški</option>
              <option value="F">Ženski</option>
              <option value="O">Ostalo</option>
            </select>
          </div>

          <!-- Gumb za registraciju -->
          <div>
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow"
            >
              Registriraj se
            </button>
          </div>
        </form>

        <!-- Poruke o uspjehu / grešci -->
        <p v-if="message" class="text-green-600 mt-4 text-center">{{ message }}</p>
        <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const showForm = ref(false)  // ne koristimo modal, ali ostaje deklaracija
const message = ref('')
const error = ref('')

const form = ref({
  fname: '',
  lname: '',
  email: '',
  password: '',
  lic_num: '',
  phone_num: '',
  gender: '',
})

const router = useRouter()

async function submitForm() {
  try {
    const response = await axios.post('http://rentacar.test/api/users', form.value)
    message.value = 'Uspješno ste registrirani!'
    error.value = ''
    // Praznimo formu
    form.value = {
      fname: '',
      lname: '',
      email: '',
      password: '',
      lic_num: '',
      phone_num: '',
      gender: '',
    }
    // Preusmjeri na login
    router.push('/login')
  } catch (err) {
    if (err.response?.status === 422) {
      error.value = Object.values(err.response.data.errors).flat().join(' ')
    } else {
      error.value = err.response?.data?.message || 'Greška prilikom registracije.'
    }
    message.value = ''
  }
}
</script>

<style scoped>
/* Sve stilove radimo kroz Tailwind klase. */
</style>
