<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('/rain.jpg');"
  >
    <div class="w-full max-w-md bg-white/80 rounded-2xl shadow-2xl px-4 md:px-8 py-8 mx-4 text-gray-900">
      <h1 class="text-2xl font-bold mb-6 text-center text-green-700">Edit Account</h1>
      <form @submit.prevent="handleUpdate">
        <div class="mb-4">
          <label for="name" class="block text-gray-900 font-medium mb-2">
            Name:
            <span class="ml-2 text-gray-600">{{ user.name }}</span>
          </label>
          <input
            v-model="user.name"
            type="text"
            id="name"
            placeholder="Enter your name"
            class="border border-gray-300 p-2 w-full rounded text-gray-900"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-900 font-medium mb-2">
            Email:
            <span class="ml-2 text-gray-600">{{ user.email }}</span>
          </label>
          <input
            v-model="user.email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="border border-gray-300 p-2 w-full rounded text-gray-900"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-900 font-medium mb-2">
            Reset password:
            <span class="ml-2 text-gray-600">
              <!-- Optionally, you can hide the password or show a placeholder -->
              ••••••••
            </span>
          </label>
          <input
            v-model="user.password"
            type="password"
            id="password"
            placeholder="Enter a new password"
            class="border border-gray-300 p-2 w-full rounded text-gray-900"
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-bold"
          >
            Update Account
          </button>
        </div>
      </form>
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
      },
    };
  },
  async mounted() {
    try {
      // Fetch the current user details
      const response = await axios.get('http://localhost:5000/auth/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      this.user.name = response.data.name;
      this.user.email = response.data.email;
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Failed to fetch user details.');
    }
  },
  methods: {
    async handleUpdate() {
      try {
        // Create an object with only the fields that have been changed
        const updatedFields = {};
        if (this.user.name) updatedFields.name = this.user.name;
        if (this.user.email) updatedFields.email = this.user.email;
        if (this.user.password) updatedFields.password = this.user.password;

        const response = await axios.patch(
          'http://localhost:5000/auth/user',
          updatedFields,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        alert('Account updated successfully!');
        this.$router.push('/'); // Redirect to the home page
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to update account.');
      }
    },
  },
};
</script>

<style scoped>
/* All styling is handled by Tailwind */
</style>