<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
    <div class="max-w-xl w-full bg-white/90 rounded-2xl shadow-2xl p-8 md:p-10">
      <h1 class="text-3xl font-extrabold mb-6 text-green-700 text-center">Camper Reviews</h1>
      <form
        v-if="isCustomer"
        @submit.prevent="submitReview"
        class="space-y-4 mb-8 bg-green-50 p-4 rounded-xl shadow"
      >
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Rating</label>
         <select v-model="review.rating" required class="border p-2 rounded w-full focus:ring-2 focus:ring-green-400 font-bold text-gray-700">
  <option disabled value="" style="color: #374151; font-weight: bold; background: #e5e7eb;">
    Select rating
  </option>
  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
</select>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Comment</label>
          <textarea
            v-model="review.comment"
            required
            class="border p-2 rounded w-full focus:ring-2 focus:ring-green-400 font-bold text-gray-700"
            rows="3"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold shadow transition"
        >
          Submit Review
        </button>
      </form>
      <div>
        <h2 class="text-xl font-bold mb-2 text-green-700">All Reviews</h2>
        <ul>
          <li
            v-for="r in reviews"
            :key="r.id"
            class="border-b py-3 flex justify-between items-center"
          >
            <div>
              <strong class="text-green-700">{{ r.user?.name || 'Customer' }}</strong>
              <span class="ml-2 text-yellow-500 font-bold">{{ '★'.repeat(r.rating) }}</span>
              <div class="text-gray-700 mt-1">{{ r.comment }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ new Date(r.createdAt).toLocaleDateString() }}</div>
            </div>
            <button
              v-if="isOwner"
              @click="deleteReview(r.id)"
              class="text-red-600 hover:underline font-semibold"
            >
              Delete
            </button>
          </li>
          <li v-if="reviews.length === 0" class="text-gray-500 py-4 text-center">No reviews yet.</li>
        </ul>
      </div>
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-xl shadow transition"
        >
          ← Back to Home
        </router-link>
      </div>
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