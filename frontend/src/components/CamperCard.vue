<template>
    <div class="max-w-sm rounded-2xl overflow-hidden shadow-lg p-4 bg-white">
      <img :src="image" alt="Camper Image" class="w-full h-48 object-cover rounded-xl" />
      <div class="mt-4">
        <h2 class="text-xl font-bold mb-1">{{ title }}</h2>
        <p class="text-gray-600">{{ location }}</p>
        <p class="text-lg text-green-600 font-semibold mt-2">€{{ price }} / night</p>
        <p class="text-gray-700 mt-2">{{ description }}</p>
        <button @click="$emit('book', id)" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl">
          Book Now
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  name: 'CamperCard',
  props: {
    id: Number,
    title: String,
    description: String,
    location: String,
    price: Number,
    image: {
      type: String,
      default: '/placeholder.jpg', // Use the local placeholder image
    },
  },
};
  </script>
  
  <style scoped>
  /* Optional: extra custom styles */
  </style>
  