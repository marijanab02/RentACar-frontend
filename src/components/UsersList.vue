<template>
<Navbar />
  <div class="px-4 py-6 w-full mx-auto">
    <!-- Naslov i gumb za dodavanje -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">Lista korisnika</h2>
      <button v-if="auth.isCreator()"
        @click="openForm()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
      >
        + Dodaj novog korisnika
      </button>
    </div>

    <!-- Poruka učitavanja ili nema podataka -->
    <div v-if="loading" class="text-center py-12 text-gray-600">
      Učitavanje...
    </div>
    <div v-else-if="users.length === 0" class="text-center py-12 text-gray-600">
      Nema registrovanih korisnika.
    </div>

    <!-- Tablica korisnika -->
    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-lg shadow mb-8">
        <thead class="bg-blue-600">
          <tr>
            <th class="px-4 py-3 text-left text-white font-medium">ID</th>
            <th class="px-4 py-3 text-left text-white font-medium">Ime</th>
            <th class="px-4 py-3 text-left text-white font-medium">Prezime</th>
            <th class="px-4 py-3 text-left text-white font-medium">Email</th>
            <th class="px-4 py-3 text-left text-white font-medium">Vozačka br.</th>
            <th class="px-4 py-3 text-left text-white font-medium">Telefon</th>
            <th class="px-4 py-3 text-left text-white font-medium">Spol</th>
            <th class="px-4 py-3 text-center text-white font-medium">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, idx) in users"
            :key="user.id"
            :class="idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
            class="hover:bg-gray-100 transition-colors"
          >
            <td class="px-4 py-3 text-gray-800 font-semibold">{{ user.id }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.fname }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.lname }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.lic_num || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.phone_num || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">
              <span class="uppercase">{{ user.gender || 'N/A' }}</span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                v-if="auth.isAdmin()"
                @click="openForm(user)"
                class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                title="Uredi"
              >
                Uredi
              </button>
              <button
                v-if="auth.isAdmin()"
                @click="confirmDelete(user)"
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
            {{ editingUser ? 'Uredi korisnika' : 'Novi korisnik' }}
          </h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Ime -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Ime:</label>
              <input
                v-model="form.fname"
                required
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Prezime -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Prezime:</label>
              <input
                v-model="form.lname"
                required
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Email:</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Lozinka (samo za novi ili ako se mijenja) -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Lozinka:</label>
              <input
                v-model="form.password"
                type="password"
                :required="!editingUser"
                minlength="6"
                placeholder="— Ostavite prazno ako ne mijenjate —"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Broj vozačke dozvole -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Broj vozačke dozvole:</label>
              <input
                v-model="form.lic_num"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Broj mobitela -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Broj mobitela:</label>
              <input
                v-model="form.phone_num"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Spol -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">Spol:</label>
              <select
                v-model="form.gender"
                class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Odaberi...</option>
                <option value="M">Muški</option>
                <option value="F">Ženski</option>
                <option value="O">Ostalo</option>
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
                {{ editingUser ? 'Spremi promjene' : 'Dodaj korisnika' }}
              </button>
            </div>
          </form>

          <!-- Poruka nakon spremanja -->
          <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
          <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
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
            Jeste li sigurni da želite obrisati korisnika
            <span class="font-medium">{{ userToDelete?.fname }} {{ userToDelete?.lname }}</span>?
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Odustani
            </button>
            <button
              @click="deleteUser"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow"
            >
              Obriši
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import api from '../services/api'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'UsersList',
  components: { Navbar }, 
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    return { auth, router }
  },
  data() {
    return {
      users: [],
      loading: true,
      showForm: false,
      editingUser: null,
      form: {
        fname: '',
        lname: '',
        email: '',
        password: '',
        lic_num: '',
        phone_num: '',
        gender: '',
      },
      message: '',
      error: '',
      showDeleteConfirm: false,
      userToDelete: null,
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      this.loading = true
      try {
        const response = await api.get('/users')
        this.users = response.data
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Niste prijavljeni ili nemate dopuštenje!')
          this.auth.logout()
          this.router.push('/login')
        } else if (err.response?.status === 403) {
          alert('Samo administratori mogu pristupiti ovoj stranici!')
          this.router.push('/')
        } else {
          console.error('Greška pri dohvaćanju korisnika:', err)
        }
      } finally {
        this.loading = false
      }
    },

    openForm(user = null) {
      this.error = ''
      this.message = ''
      if (user) {
        this.editingUser = user
        this.form = {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          password: '',
          lic_num: user.lic_num || '',
          phone_num: user.phone_num || '',
          gender: user.gender || '',
        }
      } else {
        this.editingUser = null
        this.form = {
          fname: '',
          lname: '',
          email: '',
          password: '',
          lic_num: '',
          phone_num: '',
          gender: '',
        }
      }
      this.showForm = true
    },

    closeForm() {
      this.showForm = false
      this.error = ''
      this.message = ''
    },

    async submitForm() {
      try {
        if (this.editingUser) {
          // Update
          const payload = { ...this.form }
          if (!payload.password) {
            delete payload.password
          }
          const response = await api.put(`/users/${this.editingUser.id}`, payload)
          const updated = response.data.user
          const idx = this.users.findIndex(u => u.id === this.editingUser.id)
          if (idx !== -1) {
            this.users.splice(idx, 1, updated)
          }
          this.message = 'Korisnik uspješno ažuriran.'
        } else {
          // Create
          const response = await api.post('/users', this.form)
          const novi = response.data.user
          this.users.push(novi)
          this.message = 'Korisnik uspješno kreiran.'
        }
        this.closeForm()
      } catch (err) {
        if (err.response?.status === 422) {
          // Validation error
          this.error = Object.values(err.response.data.errors).flat().join(' ')
        } else if (err.response?.status === 401) {
          alert('Sesija je istekla ili nemate ovlasti.')
          this.auth.logout()
          this.router.push('/login')
        } else {
          console.error('Greška prilikom spremanja korisnika:', err)
          this.error = 'Došlo je do greške, provjeri podatke i pokušaj ponovno.'
        }
      }
    },

    confirmDelete(user) {
      this.userToDelete = user
      this.showDeleteConfirm = true
    },

    cancelDelete() {
      this.showDeleteConfirm = false
      this.userToDelete = null
    },

    async deleteUser() {
      try {
        await api.delete(`/users/${this.userToDelete.id}`)
        this.users = this.users.filter(u => u.id !== this.userToDelete.id)
        this.cancelDelete()
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Sesija je istekla ili nemate ovlasti.')
          this.auth.logout()
          this.router.push('/login')
        } else {
          console.error('Greška prilikom brisanja korisnika:', err)
          alert('Greška prilikom brisanja korisnika.')
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
