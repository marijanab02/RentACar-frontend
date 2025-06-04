<template>
<div class="min-h-screen flex flex-col bg-gray-50">
   <Navbar />
  <div class="px-4 py-6 w-full mx-auto">
  
    <!-- Naslov i gumb za dodavanje -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">Lista automobila</h2>
      <button
        v-if="auth.isCreator()"
        @click="openForm()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
      >
        + Dodaj novi auto
      </button>
    </div>

    <!-- Poruka učitavanja ili nema podataka -->
    <div v-if="loading" class="text-center py-12 text-gray-600">
      Učitavanje...
    </div>
    <div v-else-if="cars.length === 0" class="text-center py-12 text-gray-600">
      Nema dostupnih automobila.
    </div>

    <!-- Tablica automobila -->
    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-lg shadow mb-8">
        <thead class="bg-blue-600">
          <tr>
            <th class="px-4 py-3 text-left text-white font-medium">Slika</th>
            <th class="px-4 py-3 text-left text-white font-medium">Naziv</th>
            <th class="px-4 py-3 text-left text-white font-medium">Gorivo</th>
            <th class="px-4 py-3 text-left text-white font-medium">Kapacitet</th>
            <th class="px-4 py-3 text-left text-white font-medium">Cijena (€)</th>
            <th class="px-4 py-3 text-left text-white font-medium">Dostupan</th>
            <th class="px-4 py-3 text-center text-white font-medium">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(car, idx) in cars"
            :key="car.CAR_ID"
            :class="idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
            class="hover:bg-gray-100 transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center">
                <div class="w-16 h-10 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    v-if="car.CAR_IMG"
                    :src="`http://localhost:8000/storage/${car.CAR_IMG}`"
                    alt="Car Image"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
                  >
                    Nema slike
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-gray-800 font-semibold">{{ car.CAR_NAME }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ car.FUEL_TYPE }}</td>
            <td class="px-4 py-3 text-gray-600">{{ car.CAPACITY }}</td>
            <td class="px-4 py-3 text-gray-800 font-semibold">
              {{ Number(car.PRICE).toFixed(2) }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="car.AVAILABLE === 'Y'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'"
                class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ car.AVAILABLE === 'Y' ? 'Da' : 'Ne' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                v-if="auth.isAdmin()"
                @click="openForm(car)"
                class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                title="Uredi"
              >
                Uredi
              </button>
              <button
                v-if="auth.isAdmin()"
                @click="confirmDelete(car)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                title="Obriši"
              >
                Obriši
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal za dodavanje / uređivanje -->
    <transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-2">
          <h3 class="text-2xl font-semibold mb-4 text-gray-800">
            {{ editingCar ? 'Uredi automobil' : 'Novi automobil' }}
          </h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Naziv (obavezno polje) -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Naziv:</label>
              <input
                v-model="form.CAR_NAME"
                required
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Tip goriva (obavezno polje) -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Tip goriva:</label>
              <select
                v-model="form.FUEL_TYPE"
                required
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Odaberi...</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="GAS">Gas</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </div>

            <!-- Kapacitet i Cijena (€) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">Kapacitet:</label>
                <input
                  type="number"
                  v-model.number="form.CAPACITY"
                  required
                  min="2"
                  class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">Cijena (€):</label>
                <input
                  type="number"
                  v-model.number="form.PRICE"
                  required
                  min="0"
                  step="0.01"
                  class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Upload slike -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Slika:</label>
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div v-if="file" class="mt-2">
                <span class="text-sm text-gray-600">Odabrana: {{ file.name }}</span>
              </div>
            </div>

            <!-- Dostupan (obavezno polje) -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Dostupan:</label>
              <select
                v-model="form.AVAILABLE"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Y">Da</option>
                <option value="N">Ne</option>
              </select>
            </div>

            <!-- Gumbi za Odustani / Spremi -->
            <div class="flex justify-end gap-3 mt-4">
              <button
                type="button"
                @click="closeForm"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Odustani
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
              >
                {{ editingCar ? 'Spremi promjene' : 'Dodaj automobil' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal za potvrdu brisanja -->
    <transition name="fade">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 mx-2 text-center">
          <h4 class="text-lg font-semibold mb-3 text-gray-800">Potvrda brisanja</h4>
          <p class="mb-5">
            Jeste li sigurni da želite obrisati automobil
            <span class="font-medium">{{ carToDelete?.CAR_NAME }}</span>?
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Odustani
            </button>
            <button
              @click="deleteCar"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow"
            >
              Obriši
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import api from '../services/api'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CarsList',
  components: { Navbar }, 
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    return { auth, router }
  },
  data() {
    return {
      cars: [],
      loading: true,
      showForm: false,
      editingCar: null,
      form: {
        CAR_NAME: '',
        FUEL_TYPE: '',
        CAPACITY: 1,
        PRICE: 0,
        CAR_IMG: '',
        AVAILABLE: 'Y',
      },
      file: null,         
      showDeleteConfirm: false,
      carToDelete: null,
    }
  },

  mounted() {
      this.getCars();
    },
  methods: {
    async getCars() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8000/api/cars-api');
        this.cars = response.data
      } catch (error) {
        // Handle 401 specifically
        if (error.response?.status === 401) {
          alert('Niste prijavljeni ili vaše sesije je istekla!')
          this.auth.logout()
          this.router.push('/login')
        } else if (error.response?.status === 403) {
          alert('Samo administratori mogu pristupiti ovoj stranici!')
        } else {
          console.error('Greška pri dohvaćanju automobila:', error)
        }
      } finally {
        this.loading = false
      }
    },

    openForm(car = null) {
      if (car) {
        this.editingCar = car
        this.form = {
          CAR_NAME: car.CAR_NAME,
          FUEL_TYPE: car.FUEL_TYPE,
          CAPACITY: car.CAPACITY,
          PRICE: car.PRICE,
          CAR_IMG: car.CAR_IMG,
          AVAILABLE: car.AVAILABLE,
        }
        this.file = null
      } else {
        this.editingCar = null
        this.form = {
          CAR_NAME: '',
          FUEL_TYPE: '',
          CAPACITY: 1,
          PRICE: 0,
          CAR_IMG: '',
          AVAILABLE: 'Y',
        }
        this.file = null
      }
      this.showForm = true
    },

    closeForm() {
      this.showForm = false
    },

    onFileChange(event) {
      const selected = event.target.files[0]
      if (selected) {
        this.file = selected
        this.form.CAR_IMG = ''  // uklanjamo staru putanju ako je edit
      }
    },

    async submitForm() {
      try {
        const formData = new FormData()
        formData.append('CAR_NAME', this.form.CAR_NAME)
        formData.append('FUEL_TYPE', this.form.FUEL_TYPE)
        formData.append('CAPACITY', this.form.CAPACITY)
        formData.append('PRICE', this.form.PRICE)
        formData.append('AVAILABLE', this.form.AVAILABLE)

        if (this.file) {
          formData.append('CAR_IMG', this.file)
        }

        if (this.editingCar) {
          formData.append('_method', 'PUT')
          
          const response = await api.post(
            `/cars-api/${this.editingCar.CAR_ID}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          const updatedCar = response.data.cars;
          const idx = this.cars.findIndex(c => c.CAR_ID === this.editingCar.CAR_ID);
          if (idx !== -1) {
            this.cars.splice(idx, 1, updatedCar);
          }
          // ... update logic ...
        } else {
          const response = await api.post('/cars-api', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          const newCar = response.data.cars
          this.cars.push(newCar)
        }

        this.closeForm()
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Sesija je istekla, prijavite se ponovno!')
          this.auth.logout()
          this.router.push('/login')
        } else {
          console.error('Greška pri spremanju automobila:', error)
          alert('Došlo je do pogreške. Provjeri sve unesene podatke i pokušaj ponovno.')
        }
      }
    },

    confirmDelete(car) {
      this.carToDelete = car
      this.showDeleteConfirm = true
    },

    cancelDelete() {
      this.showDeleteConfirm = false
      this.carToDelete = null
    },

    async deleteCar() {
      try {
        await api.delete(`/cars-api/${this.carToDelete.CAR_ID}`)
         this.cars = this.cars.filter(c => c.CAR_ID !== this.carToDelete.CAR_ID)
        this.cancelDelete()
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Sesija je istekla, prijavite se ponovno!')
          this.auth.logout()
          this.router.push('/login')
        } else {
          console.error('Greška pri brisanju automobila:', error)
          alert('Došlo je do pogreške prilikom brisanja.')
        }
      }
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>