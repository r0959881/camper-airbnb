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
      <CamperCard
        v-for="camper in filteredCampers"
        :key="camper.id"
        :id="camper.id"
        :title="camper.title"
        :description="camper.description"
        :location="camper.location"
        :price="camper.price"
        :image="camper.image || 'https://via.placeholder.com/400x300?text=Camper'"
        @book="handleBooking"
      />
    </div>
    <div v-else>Loading campers...</div>
  </div>
</template>

<script>
import axios from '../axios';
import CamperCard from '../components/CamperCard.vue';

export default {
  components: {
    CamperCard,
  },
  data() {
    return {
      campers: [],
      searchQuery: '',
    };
  },
  computed: {
    filteredCampers() {
      return this.campers.filter((camper) =>
        camper.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  async mounted() {
    try {
      const response = await axios.get('/campers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
        },
      });
      this.campers = response.data;
    } catch (error) {
      console.error('Error loading campers:', error);
      alert('Failed to load campers. Please log in again.');
    }
  },
  methods: {
    handleBooking(camperId) {
      this.$router.push(`/booking?camperId=${camperId}`);
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
</style>