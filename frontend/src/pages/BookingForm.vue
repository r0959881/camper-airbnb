<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
    <div class="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 md:p-10">
      <h1 class="text-3xl font-extrabold mb-6 text-green-700 text-center">Book a Camper</h1>

      <!-- Camper Image and Details -->
      <div v-if="camper" class="mb-6 text-center">
        <img
          :src="camper.image || 'https://via.placeholder.com/400x300?text=No+Image+Available'"
          alt="Camper Image"
          class="w-full h-48 object-cover rounded-xl mb-2"
        />
        <h2 class="text-xl font-bold text-white-700">{{ camper.title }}</h2>
        <p class="text-gray-600">{{ camper.location }}</p>
        <p class="text-green-600 font-semibold">€{{ camper.price }} / night</p>
        <p class="text-white-700 mt-2">{{ camper.description }}</p>
      </div>

      <form @submit.prevent="submitBooking" class="space-y-6">
        <div>
          <label for="startDate" class="block text-white-700 font-semibold mb-2">Start Date</label>
          <input
            v-model="booking.startDate"
            type="date"
            id="startDate"
            class="border border-gray-700 p-3 w-full rounded focus:ring-2 focus:ring-green-400 text-gray-700"
            required
          />
        </div>
        <div>
          <label for="endDate" class="block text-white-700 font-semibold mb-2">End Date</label>
          <input
            v-model="booking.endDate"
            type="date"
            id="endDate"
            class="border border-gray-700 p-3 w-full rounded focus:ring-2 focus:ring-green-400 text-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow transition"
        >
          Confirm Booking
        </button>
      </form>
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-xl shadow transition"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      booking: {
        camperId: null,
        startDate: '',
        endDate: '',
      },
      camper: null, // Add this
    };
  },
  async mounted() {
    // Retrieve camperId from the query parameters
    let camperId = this.$route.query.camperId;
    if (!camperId) {
      alert('Camper ID is missing. Please try again.');
      this.$router.push('/');
    } else {
      this.booking.camperId = parseInt(camperId, 10);
      // Fetch camper details
      try {
        const response = await axios.get(`/campers/${camperId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.camper = response.data;
      } catch (error) {
        alert('Failed to load camper details.');
      }
    }
  },
  methods: {
    async submitBooking() {
      if (!this.booking.camperId || isNaN(this.booking.camperId)) {
        alert('Invalid camper ID.');
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      if (this.booking.startDate < today) {
        alert('Start date cannot be in the past');
        return;
      }
      if (this.booking.endDate <= this.booking.startDate) {
        alert('End date must be after the start date');
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:5000/bookings/customer',
          this.booking,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Booking created successfully!');
        this.$router.push('/my-bookings');
      } catch (error) {
        alert('Failed to create booking. Please try again.');
      }
    },
  },
};
</script>