<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // To display error messages
    };
  },
  setup() {
    const authState = inject('authState'); // Inject the shared state
    return { authState };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', {
          email: this.email,
          password: this.password,
        });

        // Save the token and role in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        // Update the shared state
        this.authState.isLoggedIn = true;
        this.authState.role = response.data.role;

        alert('Login successful!');
        this.$router.push('/'); // Redirect to the home page
      } catch (error) {
        console.error(error.response?.data || error.message);

        // Handle specific error messages
        if (error.response?.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response?.status === 404) {
          this.errorMessage = 'User not found. Please check your credentials.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>