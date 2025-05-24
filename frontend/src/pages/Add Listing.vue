<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('/river.jpg');"
  >
    <div class="max-w-5xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 md:p-10 text-gray-900">
      <h1 class="text-3xl font-extrabold mb-6 text-green-700 text-center">Add a Listing</h1>

      <!-- Add Camper Listing Form -->
      <div class="mb-10">
        <h2 class="text-xl font-bold mb-4">Add a Camper Listing</h2>
        <form @submit.prevent="addCamper" class="space-y-4">
          <div>
            <label for="title" class="block font-bold mb-2 text-gray-900">Title</label>
            <input
              v-model="newCamper.title"
              type="text"
              id="title"
              placeholder="Enter camper title"
              class="border border-gray-300 p-2 w-full rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label for="description" class="block font-bold mb-2 text-gray-900">Description</label>
            <textarea
              v-model="newCamper.description"
              id="description"
              placeholder="Enter camper description"
              class="border border-gray-300 p-2 w-full rounded text-gray-900"
              required
            ></textarea>
          </div>
          <div>
            <label for="location" class="block font-bold mb-2 text-gray-900">Location</label>
            <input
              v-model="newCamper.location"
              type="text"
              id="location"
              placeholder="Enter camper location"
              class="border border-gray-300 p-2 w-full rounded text-gray-900"
              required
            />
          </div>
          <div>
            <label for="price" class="block font-bold mb-2 text-gray-900">Price (per night)</label>
            <input
              v-model="newCamper.price"
              type="number"
              id="price"
              placeholder="Enter price"
              class="border border-gray-300 p-2 w-full rounded text-gray-900"
              required
            />
          </div>
          <div>
    <label for="latitude" class="block font-bold mb-2 text-gray-900">Latitude</label>
    <input
      v-model="newCamper.latitude"
      type="number"
      step="any"
      id="latitude"
      placeholder="Latitude"
      class="border border-gray-300 p-2 w-full rounded text-gray-900"
      required
    />
  </div>
  <div>
    <label for="longitude" class="block font-bold mb-2 text-gray-900">Longitude</label>
    <input
      v-model="newCamper.longitude"
      type="number"
      step="any"
      id="longitude"
      placeholder="Longitude"
      class="border border-gray-300 p-2 w-full rounded text-gray-900"
      required
    />
  </div>
          <div>
            <label for="image" class="block font-bold mb-2 text-gray-900">Image</label>
            <input
              ref="image"
              type="file"
              id="image"
              class="border border-gray-300 p-2 w-full rounded text-gray-900"
              accept="image/*"
            />
          </div>  
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-bold"
          >
            Add Camper
          </button>
        </form>
      </div>

      <!-- Camper Listings -->
      <div v-if="campers.length === 0" class="text-gray-900">No campers found.</div>
      <div v-else>
        <h2 class="text-xl font-bold mb-4">Your Camper Listings</h2>
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
        const formData = new FormData();
        formData.append('title', this.newCamper.title);
        formData.append('description', this.newCamper.description);
        formData.append('location', this.newCamper.location);
        formData.append('price', this.newCamper.price);
        formData.append('image', this.$refs.image.files[0]); // Append the image file

        const response = await axios.post('http://localhost:5000/campers', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Camper added successfully!');
        this.newCamper = { title: '', description: '', location: '', price: '' }; // Reset form
        this.$refs.image.value = ''; // Reset file input
        await this.fetchCampers(); // Refresh campers after adding
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to add camper. Please try again.');
      }
    },

    // Delete a camper
    async deleteCamper(camperId) {
      if (!confirm('Are you sure you want to delete this camper?')) return;

      try {
        await axios.delete(`http://localhost:5000/campers/${camperId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        alert('Camper deleted successfully!');
        await this.fetchCampers(); // Refresh campers after deletion
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to delete camper. Please try again.');
      }
    },
  },
};
</script>