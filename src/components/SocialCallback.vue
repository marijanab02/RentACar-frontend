<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-700 font-medium">Učitavanje, čekajte...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    alert('Dogodila se greška kod Google prijave.')
    return router.push('/login')
  }

  localStorage.setItem('token', token)
  auth.token = token

  import('axios').then(({ default: axios }) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  })

  try {
    const { default: axios } = await import('axios')
    axios.defaults.baseURL = 'http://localhost:8000/api'
    axios.defaults.withCredentials = true

    const response = await axios.get('/user')
    auth.user = response.data 
    localStorage.setItem('user', JSON.stringify(response.data))
  } catch (e) {
    console.error('Ne mogu dohvatiti korisnika nakon Google prijave:', e)
    auth.logout()
    return router.push('/login')
  }
  router.push('/')
})
</script>

<style scoped>
/* Po želji možeš stilizirati loading screen */
</style>
