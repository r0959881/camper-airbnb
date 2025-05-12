<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">My Bookings</h1>
      <div v-if="bookings.length === 0" class="text-gray-600">No bookings found.</div>
      <div v-else>
        <ul class="space-y-4">
          <li v-for="booking in bookings" :key="booking.id" class="border p-4 rounded">
            <h3 class="text-lg font-bold">Camper: {{ booking.camper.title }}</h3>
            <p>Location: {{ booking.camper.location }}</p>
            <p>Price: €{{ booking.camper.price }} / night</p>
            <p>Start Date: {{ new Date(booking.startDate).toLocaleDateString() }}</p>
            <p>End Date: {{ new Date(booking.endDate).toLocaleDateString() }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        bookings: [],
      };
    },
    async mounted() {
      try {
        const response = await axios.get('http://localhost:5000/bookings/customer', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.bookings = response.data;
      } catch (error) {
        console.error('Error loading bookings:', error.response?.data || error.message);
        alert('Failed to load bookings. Please try again later.');
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>