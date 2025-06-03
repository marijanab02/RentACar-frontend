<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <div class="px-4 py-6 w-full mx-auto">
      <div v-if="!auth.isLoggedIn()" class="text-center py-12 text-gray-600">
        Molimo prijavite se kako biste vidjeli svoje rezervacije.
      </div>

      <div v-else>
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">Lista bookinga</h2>
          <button
            v-if="auth.isLoggedIn()"
            @click="openForm()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          >
            + Kreiraj novi booking
          </button>
        </div>

        <div v-if="loading" class="text-center py-12 text-gray-600">Učitavanje...</div>
        <div v-else-if="bookings.length === 0" class="text-center py-12 text-gray-600">Nema unosa.</div>

        <div v-else class="overflow-x-auto">
          <table class="w-full bg-white rounded-lg shadow mb-8">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left">ID</th>
                <th class="px-4 py-3 text-left">Auto</th>
                <th class="px-4 py-3 text-left">Mjesto</th>
                <th class="px-4 py-3 text-left">Datum</th>
                <th class="px-4 py-3 text-left">Trajanje</th>
                <th class="px-4 py-3 text-left">Cijena</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-center">Akcije</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-100">
                <td class="px-4 py-3">{{ booking.id }}</td>
                <td class="px-4 py-3">{{ getCarName(booking.car_id) }}</td>
                <td class="px-4 py-3">{{ booking.book_place }}</td>
                <td class="px-4 py-3">{{ booking.book_date }}</td>
                <td class="px-4 py-3">{{ booking.duration }} dana</td>
                <td class="px-4 py-3">{{ booking.price }} €</td>
                <td class="px-4 py-3">{{ booking.book_status }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    v-if="auth.isAdmin() || booking.user_id === auth.user?.id"
                    @click="() => openForm(booking)"
                    class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mr-2"
                  >Uredi</button>
                  <button
                    v-if="auth.isAdmin() || booking.user_id === auth.user?.id"
                    @click="() => confirmDelete(booking)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >Obriši</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Forma -->
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
          <h3 class="text-xl font-semibold mb-4">{{ editingBooking ? 'Uredi' : 'Novi' }} booking</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block font-medium">Automobil</label>
              <select v-model="form.car_id" required class="w-full border p-2 rounded">
                <option v-for="car in cars" :key="car.CAR_ID" :value="car.CAR_ID">
                  {{ car.CAR_NAME }}
                </option>
              </select>
            </div>
            <div>
              <label class="block font-medium">Mjesto preuzimanja</label>
              <input v-model="form.book_place" required class="w-full border p-2 rounded" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-medium">Datum početka</label>
                <input v-model="form.book_date" type="date" required class="w-full border p-2 rounded" />
              </div>
              <div>
                <label class="block font-medium">Datum povratka</label>
                <input v-model="form.return_date" type="date" class="w-full border p-2 rounded" />
              </div>
            </div>
            <div>
              <label class="block font-medium">Trajanje (u danima)</label>
              <input v-model.number="form.duration" type="number" required min="1" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-medium">Cijena (€)</label>
              <input v-model.number="form.price" type="number" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-medium">Status</label>
              <select v-model="form.book_status" required class="w-full border p-2 rounded">
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label class="block font-medium">Telefon (opcionalno)</label>
              <input v-model="form.phone_num" class="w-full border p-2 rounded" />
            </div>
            <div>
              <label class="block font-medium">Destinacija (opcionalno)</label>
              <input v-model="form.destination" class="w-full border p-2 rounded" />
            </div>
            <div class="flex justify-end gap-3">
              <button @click="closeForm" type="button" class="px-4 py-2 border rounded">Odustani</button>
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Spremi</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal za potvrdu brisanja -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-center">
          <h4 class="text-lg font-semibold mb-4">Potvrda brisanja</h4>
          <p class="mb-4">Jeste li sigurni da želite obrisati booking #{{ bookingToDelete?.id }}?</p>
          <div class="flex justify-center gap-4">
            <button @click="cancelDelete" class="px-4 py-2 border rounded">Odustani</button>
            <button @click="deleteBooking" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Obriši</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const bookings = ref([])
const cars = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingBooking = ref(null)
const showDeleteConfirm = ref(false)
const bookingToDelete = ref(null)

const getBookingId = (booking) => booking.BOOK_ID ?? booking.id ?? null

const form = ref({
  id: null,
  car_id: '',
  book_place: '',
  book_date: '',
  return_date: '',
  duration: 1,
  phone_num: '',
  destination: '',
  price: 0,
  book_status: 'PENDING',
  user_id: auth.user?.id,
})

const getBookings = async () => {
  loading.value = true

  try {
    if (!auth.isLoggedIn()) {
      bookings.value = []
      return
    }

    const res = await api.get('/bookings')

    if (auth.isAdmin()) {
      bookings.value = res.data
    } else {
      bookings.value = res.data.filter(b => b.user_id === auth.user?.id)
    }
  } catch (err) {
    console.error('Greška pri dohvaćanju bookinga:', err)
  } finally {
    loading.value = false
  }
}

const getCars = async () => {
  try {
    const res = await api.get('/cars-api')
    cars.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju auta:', err)
  }
}

const getCarName = (car_id) => {
  const found = cars.value.find(car => car.CAR_ID === car_id)
  return found ? found.CAR_NAME : 'Nepoznato'
}

const openForm = (booking = null) => {
  showForm.value = true
  editingBooking.value = booking

  if (booking) {
    form.value = {
      id: getBookingId(booking),
      ...booking,
      user_id: booking.user_id ?? auth.user?.id,
      return_date: booking.return_date || '',
      phone_num: booking.phone_num || '',
      destination: booking.destination || ''
    }
  } else {
    form.value = {
      id: null,
      car_id: '',
      book_place: '',
      book_date: '',
      return_date: '',
      duration: 1,
      phone_num: '',
      destination: '',
      price: 0,
      book_status: 'PENDING',
      user_id: auth.user?.id
    }
  }
}

const closeForm = () => {
  showForm.value = false
  editingBooking.value = null
}

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      return_date: form.value.return_date || null,
      phone_num: form.value.phone_num || null,
      destination: form.value.destination || null,
    }

    if (editingBooking.value && form.value.id) {
      const res = await api.put(`/bookings/${form.value.id}`, payload)
      const updated = res.data.booking
      const idx = bookings.value.findIndex(b => getBookingId(b) === form.value.id)
      if (idx !== -1) bookings.value.splice(idx, 1, updated)
    } else {
      const res = await api.post('/bookings', payload)
      bookings.value.push(res.data.booking)
    }

    closeForm()
  } catch (err) {
    if (err.response?.status === 422) {
      alert(Object.values(err.response.data.errors).flat().join(' '))
    } else {
      console.error('Greška prilikom spremanja:', err)
      alert('Greška: provjeri podatke.')
    }
  }
}

const confirmDelete = (booking) => {
  bookingToDelete.value = booking
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  bookingToDelete.value = null
}

const deleteBooking = async () => {
  const bookingId = getBookingId(bookingToDelete.value)
  if (!bookingId) {
    console.error("Nema ID-a za brisanje!")
    return
  }
  try {
    await api.delete(`/bookings/${bookingId}`)
    bookings.value = bookings.value.filter(b => getBookingId(b) !== bookingId)
    cancelDelete()
  } catch (err) {
    console.error('Greška pri brisanju:', err)
    alert('Greška pri brisanju bookinga.')
  }
}

onMounted(() => {
  getBookings()
  getCars()
})
</script>
