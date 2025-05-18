<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" style="background-image: url('/rain.jpg');">
    <div class="w-full max-w-3xl bg-white/80 rounded-2xl shadow-2xl p-8 md:p-10 mx-4">
      <h1 class="text-3xl font-extrabold mb-8 text-green-700 text-center">My Bookings</h1>
      <div v-if="bookings.length === 0" class="text-gray-600 text-center">No bookings found.</div>
      <div v-else>
        <ul class="space-y-6">
          <li
            v-for="booking in bookings"
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
              <p class="text-gray-700 mb-1">
                <span class="font-semibold">Location:</span>
                {{ booking.camper ? booking.camper.location : 'N/A' }}
              </p>
              <p class="text-green-600 font-semibold mb-1">
                <span class="font-semibold">Price:</span>
                €{{ booking.camper ? booking.camper.price : 'N/A' }} / night
              </p>
              <p class="mb-1">
                <span class=" text-gray-700 font-semibold">Start Date:</span>
                <span class=" text-gray-700 font-medium">{{ new Date(booking.startDate).toLocaleDateString() }}</span>
              </p>
              <p>
                <span class="text-gray-700 font-semibold">End Date:</span>
                <span class="text-gray-700 font-medium">{{ new Date(booking.endDate).toLocaleDateString() }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
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
/* All styling is handled by Tailwind */
</style>