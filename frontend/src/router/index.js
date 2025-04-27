import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import BookingForm from '../pages/BookingForm.vue';
import SignUp from '../pages/SignUp.vue';
import Login from '../pages/Login.vue';
import EditAccount from '../pages/EditAccount.vue';
import OwnerPage from '../pages/OwnerPage.vue';
import CustomerDashboard from '../pages/CustomerDashboard.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/booking', name: 'Booking', component: BookingForm },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'Login', component: Login },
  { path: '/edit-account', name: 'EditAccount', component: EditAccount },
  {
    path: '/owner',
    name: 'OwnerPage',
    component: OwnerPage,
    meta: { requiresAuth: true, role: 'OWNER' },
  },
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard,
    meta: { requiresAuth: true, role: 'CUSTOMER' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login'); // Redirect to login if not authenticated
  } else if (to.meta.role && to.meta.role !== role) {
    next('/'); // Redirect to home if the role doesn't match
  } else {
    next(); // Allow access
  }
});

export default router;