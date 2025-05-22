<template>
  <div class="mt-2">
    <h3 class="text-sm font-bold text-green-700">Reviews</h3>
    <ul>
      <li v-for="review in reviews" :key="review.id" class="text-gray-700 text-xs">
        <span class="font-semibold text-gray-500">★</span>
        <span class="font-bold">{{ review.rating }}</span> - {{ review.comment }}
      </li>
      <li v-if="reviews.length === 0" class="text-gray-400">No reviews yet.</li>
    </ul>
  </div>
</template>

<script>
import axios from '../axios';
export default {
  props: ['camperId'],
  data() {
    return { reviews: [] };
  },
  async mounted() {
    if (this.camperId) {
      const res = await axios.get(`/reviews/camper/${this.camperId}`);
      this.reviews = res.data;
    }
  }
};
</script>