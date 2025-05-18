<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Book a Camper</h1>
    <form @submit.prevent="submitBooking" class="space-y-4">
      <div>
        <label for="startDate" class="block text-gray-700 font-medium mb-2">Start Date</label>
        <input
          v-model="booking.startDate"
          type="date"
          id="startDate"
          class="border border-gray-300 p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label for="endDate" class="block text-gray-700 font-medium mb-2">End Date</label>
        <input
          v-model="booking.endDate"
          type="date"
          id="endDate"
          class="border border-gray-300 p-2 w-full rounded"
          required
        />
      </div>
      <button
        type="submit"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Confirm Booking
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      booking: {
        camperId: null, // Automatically set from query parameters
        startDate: '',
        endDate: '',
      },
    };
  },
  mounted() {
    // Retrieve camperId from the query parameters
    let camperId = this.$route.query.camperId;
    if (!camperId) {
      alert('Camper ID is missing. Please try again.');
      this.$router.push('/'); // Redirect to home if camperId is missing
    } else {
      this.booking.camperId = parseInt(camperId, 10); // Ensure camperId is a number
    }
  },
  methods: {
    async submitBooking() {
      if (!this.booking.camperId || isNaN(this.booking.camperId)) {
        alert('Invalid camper ID.');
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      if (this.booking.startDate < today) {
        alert('Start date cannot be in the past');
        return;
      }

      if (this.booking.endDate <= this.booking.startDate) {
        alert('End date must be after the start date');
        return;
      }

      try {
        console.log('Submitting booking:', this.booking); // Log the booking data
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
        console.log(response.data);
        this.$router.push('/my-bookings'); // Redirect to user's bookings page
      } catch (error) {
        console.error('Error creating booking:', error.response?.data || error.message);
        alert('Failed to create booking. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>