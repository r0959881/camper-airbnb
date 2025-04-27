<!-- filepath: c:\Projects\camper-airbnb\frontend\src\pages\SignUP.vue -->
<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <input v-model="user.name" type="text" id="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="user.email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="user.password" type="password" id="password" required />
      </div>

      <div class="form-group">
        <label for="role">Role</label>
        <select v-model="user.role" id="role" required>
          <option value="CUSTOMER">Customer</option>
          <option value="OWNER">Owner</option>
        </select>
      </div>

      <button type="submit" class="btn">Sign Up</button>
    </form>

    <p class="login-link">
      Already have an account? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER', // Default role
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('http://localhost:5000/auth/signup', this.user);
        console.log(response.data); // Handle the response
        this.$router.push('/'); // Redirect to the home page
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Error during sign-up');
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
select {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}
</style>