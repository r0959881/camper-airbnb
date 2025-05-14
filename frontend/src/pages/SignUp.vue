<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('/camping-bj.jpg');"
  >
    <div class="w-full max-w-md bg-white/50 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-gray-900">
      <h2 class="text-3xl md:text-4xl font-extrabold mb-2 text-green-700 text-center">Sign Up</h2>
      <form @submit.prevent="handleSubmit" class="w-full">
        <div class="mb-5">
          <label for="name" class="block text-green-900 font-medium mb-2">Name</label>
          <input v-model="user.name" type="text" id="name" placeholder="Enter your name"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required />
        </div>
        <div class="mb-5">
          <label for="email" class="block text-green-900 font-medium mb-2">Email</label>
          <input v-model="user.email" type="email" id="email" placeholder="Enter your email"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required />
        </div>
        <div class="mb-5">
          <label for="password" class="block text-green-900 font-medium mb-2">Password</label>
          <input v-model="user.password" type="password" id="password" placeholder="Enter your password"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required />
        </div>
        <div class="mb-8">
          <label for="role" class="block text-green-900 font-medium mb-2">Role</label>
          <select v-model="user.role" id="role"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required>
            <option value="CUSTOMER">Customer</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
        <button type="submit"
          class="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg w-full font-bold text-lg shadow transition">
          Sign Up
        </button>
      </form>
      <p class="mt-8 text-center text-gray-500 text-sm">
        Already have an account?
        <router-link to="/login" class="text-green-700 font-semibold hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('http://localhost:5000/auth/signup', this.user);
        this.$router.push('/login');
      } catch (error) {
        alert('Error during sign-up');
      }
    },
  },
};
</script>

<style scoped>
/* All styling is handled by Tailwind */
</style>