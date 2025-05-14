<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center"
       style="background-image: url('/camp.jpg');">
    <div class="w-full max-w-md bg-white/50 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-gray-900">
      <!-- All your content here will now have dark text -->
      <h1 class="text-3xl md:text-4xl font-extrabold mb-2 text-green-700 text-center">Welcome Back</h1>
      <p class="mb-8 text-center text-gray-600 text-base md:text-lg">
        Please enter your <span class="text-green-700 font-semibold">email</span> and <span class="text-green-700 font-semibold">password</span> to log in.
      </p>
      <form @submit.prevent="handleLogin" class="w-full">
        <div class="mb-5">
          <label for="email" class="block text-green-900 font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>
     
              
        <div class="mb-8">
          <label for="password" class="block text-green-900 font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg w-full font-bold text-lg shadow transition"
        >
          Login
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 mt-6 text-center">{{ errorMessage }}</p>
      <div class="mt-8 text-center text-gray-500 text-sm">
        Don't have an account?
        <router-link to="/signup" class="text-green-700 font-semibold hover:underline">Sign Up</router-link>
      </div>
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
      errorMessage: '',
    };
  },
  setup() {
    const authState = inject('authState');
    return { authState };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        this.authState.isLoggedIn = true;
        this.authState.role = response.data.role;

        alert('Login successful!');
        this.$router.push('/');
      } catch (error) {
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
/* All styling is handled by Tailwind */
</style>