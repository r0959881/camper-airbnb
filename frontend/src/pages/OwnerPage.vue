<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Owner Dashboard</h1>

    <!-- Add Camper Listing Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Add a Camper Listing</h2>
      <form @submit.prevent="addCamper" class="space-y-4">
        <div>
          <label for="title" class="block text-gray-700 font-medium mb-2">Title</label>
          <input
            v-model="newCamper.title"
            type="text"
            id="title"
            placeholder="Enter camper title"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            v-model="newCamper.description"
            id="description"
            placeholder="Enter camper description"
            class="border border-gray-300 p-2 w-full rounded"
            required
          ></textarea>
        </div>
        <div>
          <label for="location" class="block text-gray-700 font-medium mb-2">Location</label>
          <input
            v-model="newCamper.location"
            type="text"
            id="location"
            placeholder="Enter camper location"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label for="price" class="block text-gray-700 font-medium mb-2">Price (per night)</label>
          <input
            v-model="newCamper.price"
            type="number"
            id="price"
            placeholder="Enter price"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add Camper
        </button>
      </form>
    </div>

    <!-- Camper Listings -->
    <div v-if="campers.length === 0" class="text-gray-600">No campers found.</div>
    <div v-else>
      <h2 class="text-xl font-semibold mb-4">Your Camper Listings</h2>
      <ul class="space-y-4">
        <li v-for="camper in campers" :key="camper.id" class="border p-4 rounded">
          <h3 class="text-lg font-bold">{{ camper.title }}</h3>
          <p>{{ camper.description }}</p>
          <p class="text-gray-600">{{ camper.location }}</p>
          <p class="text-green-600 font-semibold">€{{ camper.price }} / night</p>
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
      campers: [], // List of campers
      newCamper: {
        title: '',
        description: '',
        location: '',
        price: '',
      }, // Data for the new camper
    };
  },
  async mounted() {
    await this.fetchCampers(); // Fetch campers when the component is mounted
  },
  methods: {
    // Fetch campers for the owner
    async fetchCampers() {
      try {
        const response = await axios.get('http://localhost:5000/campers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.campers = response.data.filter(
          (camper) => camper.ownerId === parseInt(localStorage.getItem('userId'))
        );
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to fetch campers. Please try again later.');
      }
    },

    // Add a new camper
    async addCamper() {
      try {
        const response = await axios.post(
          'http://localhost:5000/campers',
          this.newCamper,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Camper added successfully!');
        this.newCamper = { title: '', description: '', location: '', price: '' }; // Reset form
        await this.fetchCampers(); // Refresh campers after adding
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to add camper. Please try again.');
      }
    },
  },
};
</script>