<template>
    <form @submit.prevent="submitBooking" class="p-4 space-y-4">
      <input v-model="booking.userId" placeholder="User ID" class="border p-2" />
      <input v-model="booking.camperId" placeholder="Camper ID" class="border p-2" />
      <input type="date" v-model="booking.startDate" class="border p-2" />
      <input type="date" v-model="booking.endDate" class="border p-2" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2">Book Now</button>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        booking: {
          userId: '',
          camperId: '',
          startDate: '',
          endDate: ''
        }
      };
    },
    methods: {
      async submitBooking() {
        try {
          const res = await axios.post('/bookings', this.booking);
          alert('Booking successful!');
          console.log(res.data);
        } catch (err) {
          alert('Booking failed.');
          console.error(err);
        }
      }
    }
  };
  </script>
  