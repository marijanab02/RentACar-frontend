import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../components/Home.vue'
import CarsList from '../components/CarList.vue'
import Login from '../components/LoginView.vue'
import RegisterUser from '../components/RegisterUser.vue'
import UsersList from '../components/UsersList.vue'
import BookingList from '../components/BookingList.vue'



import SocialCallback from '../components/SocialCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/auth/callback',       // **Nova ruta za obradu Google callbacka**
      name: 'social-callback',
      component: SocialCallback,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    { path: '/cars', component: CarsList },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser,
    },
    {
      path: '/users',
      component: UsersList,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('../components/BookingList.vue'), // ili promijeni ako je u "views"
      meta: { requiresAuth: true } // ako želiš da je dostupno samo logiranim korisnicima
    },
  ],
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Requires auth and user not logged in
  if (to.meta.requiresAuth && !auth.user) {
    return next('/login');
  }

  // Requires admin role
  if (to.meta.requiresAdmin && !auth.isAdmin()) {
    alert('Samo admini mogu pristupiti!');
    return next(from.path || '/');
  }

  next();
});


export default router
