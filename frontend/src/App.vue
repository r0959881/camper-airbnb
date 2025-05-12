<template>
  <div>
    <nav class="bg-gray-800 p-4">
      <ul class="flex space-x-4">
        <li><router-link to="/">Home</router-link></li>
        <li v-if="authState.isLoggedIn && authState.role === 'CUSTOMER'">
          <router-link to="/booking">Booking</router-link>
        </li>
        <li v-if="authState.isLoggedIn && authState.role === 'OWNER'">
          <router-link to="/owner" class="text-white">Owner Dashboard</router-link>
        </li>
        <li v-if="!authState.isLoggedIn">
          <router-link to="/signup">Sign Up</router-link>
        </li>
        <li v-if="!authState.isLoggedIn">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-if="authState.isLoggedIn">
          <router-link to="/edit-account" class="text-white">Edit Account</router-link>
        </li>
        <li v-if="authState.isLoggedIn && authState.role === 'CUSTOMER'">
        <router-link to="/my-bookings" class="text-white">My Bookings</router-link>
        </li>
        <li v-if="authState.isLoggedIn">
          <button @click="logout" class="text-white">Logout</button>
        </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import { reactive, provide, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    // Reactive state to track login status and role
    const authState = reactive({
      isLoggedIn: !!localStorage.getItem('token'), // Check if token exists
      role: localStorage.getItem('role') || '', // Get role from localStorage
    });

    // Provide the state to child components
    provide('authState', authState);

    // Logout function
    const logout = () => {
      localStorage.removeItem('token'); // Remove token
      localStorage.removeItem('role'); // Remove role
      authState.isLoggedIn = false; // Update login state
      authState.role = ''; // Clear role
    };

    // Sync authState with localStorage on app load
    onMounted(() => {
      authState.isLoggedIn = !!localStorage.getItem('token');
      authState.role = localStorage.getItem('role') || '';
    });

    return {
      authState,
      logout,
    };
  },
};
</script>

<style>
nav ul {
  list-style-type: none;
  display: flex;
}

nav li {
  margin-right: 1rem;
}

nav a {
  text-decoration: none;
  color: rgb(181, 53, 53);
}

nav a:hover {
  text-decoration: underline;
}
</style>