import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import BookingForm from '../pages/BookingForm.vue';
import SignUp from '../pages/SignUp.vue';
import Login from '../pages/Login.vue';
import EditAccount from '../pages/EditAccount.vue';
import OwnerPage from '../pages/Add Listing.vue';
import CustomerDashboard from '../pages/CustomerDashboard.vue';
import MyBookings from '../pages/Mybookings.vue';
import EditCamper from '../pages/EditCamper.vue';

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: Home },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'Login', component: Login },

  // Authenticated routes
  {
    path: '/edit-account',
    name: 'EditAccount',
    component: EditAccount,
    meta: { requiresAuth: true },
  },

  // Customer-specific routes
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard,
    meta: { requiresAuth: true, role: 'CUSTOMER' },
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: { requiresAuth: true, role: 'CUSTOMER' },
  },
  {
    path: '/booking',
    name: 'BookingForm',
    component: BookingForm,
    meta: { requiresAuth: true, role: 'CUSTOMER' },
  },

  // Owner-specific routes
  {
    path: '/owner',
    name: 'OwnerPage',
    component: OwnerPage,
    meta: { requiresAuth: true, role: 'OWNER' },
  },
  {
    path: '/edit-camper/:id',
    name: 'EditCamper',
    component: EditCamper,
    meta: { requiresAuth: true, role: 'OWNER' },
  },

  {
  path: '/reviews',
  name: 'ReviewPage',
  component: () => import('../pages/ReviewPage.vue'),
  meta: { requiresAuth: true }, // Both CUSTOMER and OWNER can access
},
{
  path: '/owner-dashboard',
  name: 'OwnerDashboard',
  component: () => import('../pages/OwnerDashboard.vue'),
  meta: { requiresAuth: true, role: 'OWNER' },
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to handle authentication and role-based access
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in
  const role = localStorage.getItem('role'); // Get the user's role

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redirect to login if the route requires authentication and the user is not logged in
    next('/login');
  } else if (to.meta.role && to.meta.role !== role) {
    // Redirect to home if the user's role does not match the required role for the route
    next('/');
  } else {
    // Allow access to the route
    next();
  }
});

export default router;