<!-- filepath: c:\Projects\camper-airbnb\frontend\src\pages\Home.vue -->
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Available Campers</h1>
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search campers..."
        class="border p-2 w-full rounded"
      />
    </div>
    <div v-if="filteredCampers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="camper in filteredCampers" :key="camper.id" class="border p-4 rounded">
        <img :src="camper.image || 'https://via.placeholder.com/400x300?text=No+Image+Available'" alt="Camper Image" class="w-full h-48 object-cover rounded-xl" />
        <h2 class="text-xl font-bold mt-2">{{ camper.title }}</h2>
        <p class="text-gray-600">{{ camper.location }}</p>
        <p class="text-green-600 font-semibold">€{{ camper.price }} / night</p>
        <p class="text-gray-700 mt-2">{{ camper.description }}</p>

        <!-- Show Edit Camper button for owners -->
        <div v-if="authState.role === 'OWNER'" class="mt-4">
          <button
            @click="$router.push({ name: 'EditCamper', params: { id: camper.id } })"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit Camper
          </button>
          <button
            @click="deleteCamper(camper.id)"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete Camper
          </button>
        </div>

        <!-- Book Now button for customers -->
        <button
          v-if="authState.role === 'CUSTOMER'"
          @click="handleBooking(camper.id)"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
        >
          Book Now
        </button>
      </div>
    </div>
    <div v-else class="text-gray-600">No campers found. Please try again later.</div>
  </div>
</template>

<script>
import axios from '../axios';
import { inject } from 'vue';

export default {
  setup() {
    const authState = inject('authState'); // Inject the shared state
    return { authState };
  },
  data() {
    return {
      campers: [], // List of campers
      searchQuery: '', // Search query for filtering campers
    };
  },
  computed: {
    // Filter campers based on the search query
    filteredCampers() {
      return this.campers.filter((camper) =>
        camper.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  async mounted() {
    await this.fetchCampers(); // Fetch campers when the component is mounted
  },
  methods: {
    // Fetch campers from the backend
    // ...existing code...
async fetchCampers() {
  try {
    // Replace 7 with the actual ownerId you want to fetch
    const response = await axios.get('/campers/owner?ownerId=7');
    console.log('Fetched Campers:', response.data);
    this.campers = response.data.filter((camper) => !camper.deletedAt);
  } catch (error) {
    console.error('Error loading campers:', error.response?.data || error.message);
    alert('Failed to load campers. Please try again later.');
  }
},
// ...existing code...

    // Navigate to the booking form
    handleBooking(camperId) {
      this.$router.push({
        name: 'Booking',
        query: { camperId }, // Pass camperId as a query parameter
      });
    },

    // Delete a camper
    async deleteCamper(camperId) {
      if (!confirm('Are you sure you want to delete this camper?')) return;

      try {
        await axios.delete(`/campers/${camperId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        alert('Camper deleted successfully!');
        await this.fetchCampers(); // Refresh campers after deletion
      } catch (error) {
        console.error('Error deleting camper:', error.response?.data || error.message);
        alert('Failed to delete camper. Please try again.');
      }
    },
  },
};
</script>