<!-- filepath: c:\Projects\camper-airbnb\frontend\src\pages\EditCamper.vue -->
<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Edit Camper Listing</h1>
      <form @submit.prevent="updateCamper" class="space-y-4">
        <div>
          <label for="title" class="block text-gray-700 font-medium mb-2">Title</label>
          <input
            v-model="camper.title"
            type="text"
            id="title"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            v-model="camper.description"
            id="description"
            class="border border-gray-300 p-2 w-full rounded"
            required
          ></textarea>
        </div>
        <div>
          <label for="location" class="block text-gray-700 font-medium mb-2">Location</label>
          <input
            v-model="camper.location"
            type="text"
            id="location"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label for="price" class="block text-gray-700 font-medium mb-2">Price (per night)</label>
          <input
            v-model="camper.price"
            type="number"
            id="price"
            class="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="cancelEdit"
            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    data() {
      return {
        camper: {
          title: '',
          description: '',
          location: '',
          price: '',
        },
      };
    },
    async mounted() {
      const camperId = this.$route.params.id; // Get camper ID from route params
      console.log(`Camper ID from route params: ${camperId}`); // Log the camper ID
  
      try {
        const response = await axios.get(`/campers/${camperId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.camper = response.data; // Populate the camper details
      } catch (error) {
        console.error('Error fetching camper:', error.response?.data || error.message);
        alert('Failed to fetch camper details. Please try again.');
        this.$router.push('/owner'); // Redirect to owner dashboard on failure
      }
    },
    methods: {
      async updateCamper() {
        const camperId = this.$route.params.id; // Get camper ID from route params
        try {
          await axios.patch(`/campers/${camperId}`, this.camper, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          alert('Camper updated successfully!');
          this.$router.push('/owner'); // Redirect to owner dashboard after success
        } catch (error) {
          console.error('Error updating camper:', error.response?.data || error.message);
          alert('Failed to update camper. Please try again.');
        }
      },
      cancelEdit() {
        this.$router.push('/owner'); // Redirect to owner dashboard on cancel
      },
    },
  };
  </script>