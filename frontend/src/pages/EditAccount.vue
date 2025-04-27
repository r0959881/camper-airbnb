<!-- filepath: c:\Projects\camper-airbnb\frontend\src\pages\EditAccount.vue -->
<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit Account</h1>
        <form @submit.prevent="handleUpdate">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-medium mb-2">Name</label>
            <input
              v-model="user.name"
              type="text"
              id="name"
              placeholder="Enter your name"
              class="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              v-model="user.email"
              type="email"
              id="email"
              placeholder="Enter your email"
              class="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-medium mb-2">Password (optional)</label>
            <input
              v-model="user.password"
              type="password"
              id="password"
              placeholder="Enter a new password"
              class="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          >
            Update Account
          </button>
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
  /* Add any additional styles here */
  </style>