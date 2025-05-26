<template>
  <div class="max-w-3xl mx-auto py-10">
    <h2 class="text-2xl font-bold mb-4 text-green-700">Active Bookings</h2>
    <div v-if="activeBookings.length">
      <ul class="space-y-6">
        <li
          v-for="booking in activeBookings"
          :key="booking.id"
          class="border border-gray-200 rounded-xl bg-white/90 shadow p-4 flex items-center gap-4"
        >
          <img
            v-if="booking.camper && booking.camper.image"
            :src="booking.camper.image"
            alt="Camper Image"
            class="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
          />
          <div class="flex-1">
            <h3 class="text-lg font-bold mb-1 text-gray-700">
              {{ booking.camper ? booking.camper.title : 'Unknown Camper' }}
            </h3>
            <p>
              <span class="text-gray-700 font-semibold">Start Date:</span>
              <span class="text-gray-700 font-medium">{{ new Date(booking.startDate).toLocaleDateString() }}</span>
            </p>
            <p>
              <span class="text-gray-700 font-semibold">End Date:</span>
              <span class="text-gray-700 font-medium">{{ new Date(booking.endDate).toLocaleDateString() }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-600 text-center">No active bookings.</div>

    <h2 class="text-2xl font-bold mt-8 mb-4 text-red-700">Expired Bookings</h2>
    <div v-if="expiredBookings.length">
      <ul class="space-y-6">
        <li
          v-for="booking in expiredBookings"
          :key="booking.id"
          class="border border-gray-200 rounded-xl bg-gray-200 shadow p-4 flex items-center gap-4 opacity-70"
        >
          <img
            v-if="booking.camper && booking.camper.image"
            :src="booking.camper.image"
            alt="Camper Image"
            class="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
          />
          <div class="flex-1">
            <h3 class="text-lg font-bold mb-1 text-gray-700">
              {{ booking.camper ? booking.camper.title : 'Unknown Camper' }}
            </h3>
            <p>
              <span class="text-gray-700 font-semibold">Start Date:</span>
              <span class="text-gray-700 font-medium">{{ new Date(booking.startDate).toLocaleDateString() }}</span>
            </p>
            <p>
              <span class="text-gray-700 font-semibold">End Date:</span>
              <span class="text-gray-700 font-medium">{{ new Date(booking.endDate).toLocaleDateString() }}</span>
            </p>
            <span class="text-red-600 font-semibold">Expired</span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-600 text-center">No expired bookings.</div>
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
  computed: {
    activeBookings() {
      const today = new Date();
      return this.bookings.filter(
        booking => new Date(booking.endDate) >= today
      );
    },
    expiredBookings() {
      const today = new Date();
      return this.bookings.filter(
        booking => new Date(booking.endDate) < today
      );
    },
  },
};
</script>

<style scoped>
/* All styling is handled by Tailwind */
</style>