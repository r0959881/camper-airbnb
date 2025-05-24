<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" style="background-image: url('/river.jpg');">
    <div class="max-w-5xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 md:p-10 text-gray-900">
      <h1 class="text-3xl font-extrabold mb-6 text-green-700 text-center">Your Camper Listings</h1>
      <div v-if="campers.length === 0" class="text-gray-900">No campers found.</div>
      <div v-else>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li v-for="camper in campers" :key="camper.id" class="border p-4 rounded bg-white/90 shadow text-gray-900">
            <img :src="camper.image" alt="Camper Image" class="w-full h-48 object-cover rounded-xl mb-2" />
            <h3 class="text-lg font-bold">{{ camper.title }}</h3>
            <p>{{ camper.description }}</p>
            <p>{{ camper.location }}</p>
            <p class="text-green-600 font-semibold">€{{ camper.price }} / night</p>
            <button
              @click="deleteCamper(camper.id)"
              class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Camper
            </button>
            <button
              @click="$router.push({ name: 'EditCamper', params: { id: camper.id } })"
              class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit Camper
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OwnerDashboard',
  data() {
    return {
      campers: [],
    };
  },
  async mounted() {
    await this.fetchCampers();
  },
  methods: {
    async fetchCampers() {
      try {
        const response = await axios.get('/campers/owner', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.campers = response.data;
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to fetch your campers. Please try again later.');
      }
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