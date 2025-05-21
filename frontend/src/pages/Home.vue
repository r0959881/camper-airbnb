<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('/rain.jpg');"
  >
    <div class="max-w-6xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 md:p-10">
      <h1 class="text-3xl font-extrabold mb-6 text-green-700 text-center">Available Campers</h1>
      
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search campers..."
          class="border p-3 w-full rounded  text-gray-700"
        />
      </div>

      <div v-if="filteredCampers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="camper in filteredCampers"
          :key="camper.id"
          class="border p-4 rounded shadow bg-white"
        >
          <img
            :src="camper.image || 'https://via.placeholder.com/400x300?text=No+Image+Available'"
            alt="Camper Image"
            class="w-full h-48 object-cover rounded-xl"
          />
          <h2 class="text-gray-700 font-bold mt-2">{{ camper.title }}</h2>
          <p class="text-gray-600">{{ camper.location }}</p>
          <p class="text-green-600 font-semibold">€{{ camper.price }} / night</p>
          <p class="text-gray-700 mt-2">{{ camper.description }}</p>

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

          <button
            v-if="authState.role === 'CUSTOMER'"
            @click="handleBooking(camper.id)"
            class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
          >
            Book Now
          </button>

          <!-- Add Reviews button for both roles -->
          <router-link
            :to="{ name: 'ReviewPage', query: { camperId: camper.id } }"
            class="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
            style="margin-top: 12px;"
          >
            Reviews
          </router-link>
        </div>
      </div>

      <div v-else class="text-gray-600 text-center mt-8">
        No campers found. Please try again later.
      </div>

      <!-- Map Component Section -->
      <div class="mt-10">
        <h2 class="text-2xl text-gray-700 font-bold text-center mb-4">Explore Campers on Map</h2>
        <MapComponent :campers="filteredCampers" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import { inject } from 'vue';
import MapComponent from '@/components/MapComponent.vue'; // ✅ Import the MapComponent
// import CamperReviews from '@/components/CamperReviews.vue';


export default {
  components: {
    MapComponent,
  },
  setup() {
    const authState = inject('authState');
    return { authState };
  },
  data() {
    return {
      campers: [],
      searchQuery: '',
    };
  },
   computed: {
  filteredCampers() {
    const q = this.searchQuery.toLowerCase();
    return this.campers.filter((camper) =>
      camper.title.toLowerCase().includes(q) ||
      camper.location.toLowerCase().includes(q) ||
      camper.description.toLowerCase().includes(q)
    );
  },
},
  async mounted() {
    await this.fetchCampers();
  },
  methods: {
    async fetchCampers() {
      try {
        const response = await axios.get('/campers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.campers = response.data.filter((camper) => !camper.deletedAt);
      } catch (error) {
        alert('Failed to load campers. Please try again later.');
      }
    },
    handleBooking(camperId) {
      this.$router.push({
        name: 'BookingForm',
        query: { camperId },
      });
    },
    async deleteCamper(camperId) {
      if (!confirm('Are you sure you want to delete this camper?')) return;
      try {
        await axios.delete(`/campers/${camperId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Camper deleted successfully!');
        await this.fetchCampers();
      } catch (error) {
        alert('Failed to delete camper. Please try again.');
      }
    },
  },
};
</script>
