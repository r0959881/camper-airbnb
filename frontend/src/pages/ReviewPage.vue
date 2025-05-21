<template>
  <div class="max-w-xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Camper Reviews</h1>
    <form v-if="isCustomer" @submit.prevent="submitReview" class="space-y-4 mb-8">
      <div>
        <label class="block mb-1">Rating</label>
        <select v-model="review.rating" required class="border p-2 rounded w-full">
          <option disabled value="">Select rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div>
        <label class="block mb-1">Comment</label>
        <textarea v-model="review.comment" required class="border p-2 rounded w-full"></textarea>
      </div>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Submit Review</button>
    </form>
    <div>
      <h2 class="text-xl font-bold mb-2">All Reviews</h2>
      <ul>
        <li v-for="r in reviews" :key="r.id" class="border-b py-2 flex justify-between items-center">
          <div>
            <strong>{{ r.user?.name || 'Customer' }}</strong> - {{ r.rating }}★<br>
            {{ r.comment }}
          </div>
          <button
            v-if="isOwner"
            @click="deleteReview(r.id)"
            class="text-red-600 hover:underline"
          >Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      review: {
        rating: '',
        comment: '',
        camperId: this.$route.query.camperId, // expects ?camperId= in URL
      },
      reviews: [],
      isCustomer: localStorage.getItem('role') === 'CUSTOMER',
      isOwner: localStorage.getItem('role') === 'OWNER',
    };
  },
  async mounted() {
    await this.fetchReviews();
  },
  methods: {
    async fetchReviews() {
      const camperId = this.review.camperId;
      if (!camperId) return;
      const res = await axios.get(`/reviews/camper/${camperId}`);
      this.reviews = res.data;
    },
    async submitReview() {
      try {
        await axios.post('/reviews', this.review, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.review.rating = '';
        this.review.comment = '';
        await this.fetchReviews();
        alert('Review submitted!');
      } catch (e) {
        alert('Failed to submit review.');
      }
    },
    async deleteReview(id) {
      if (!confirm('Delete this review?')) return;
      try {
        await axios.delete(`/reviews/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        await this.fetchReviews();
      } catch (e) {
        alert('Failed to delete review.');
      }
    },
  },
};
</script>