<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center"
       style="background-image: url('/camp.jpg');">
    <div class="w-full max-w-md bg-white/50 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-gray-900">
      <h1 class="text-3xl md:text-4xl font-extrabold mb-2 text-green-700 text-center">Welcome Back</h1>
      <p class="mb-8 text-center text-gray-600 text-base md:text-lg">
        Please enter your <span class="text-green-700 font-semibold">email</span> and <span class="text-green-700 font-semibold">password</span> to log in.
      </p>
      <form @submit.prevent="handleLogin" class="w-full">
        <div class="mb-5">
          <label for="email" class="block text-green-900 font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>
        <div class="mb-8">
          <label for="password" class="block text-green-900 font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="border border-green-300 bg-green-50 text-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg w-full font-bold text-lg shadow transition"
        >
          Login
        </button>
      </form>
      <!-- Google Sign-In Button -->
      <div class="mt-6 flex justify-center">
        <div ref="googleBtn"></div>
      </div>
      <p v-if="errorMessage" class="text-red-500 mt-6 text-center">{{ errorMessage }}</p>
      <div class="mt-8 text-center text-gray-500 text-sm">
        Don't have an account?
        <router-link to="/signup" class="text-green-700 font-semibold hover:underline">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  setup() {
    const authState = inject('authState');
    return { authState };
  },
  mounted() {
    window.handleGoogleSignIn = this.handleGoogleSignIn;
    // Render Google Sign-In button after script loads
    const renderGoogleBtn = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: '574377943823-89pgiu7q8sjpodcpsobolqg26qelu3di.apps.googleusercontent.com',
          callback: this.handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          this.$refs.googleBtn,
          { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' }
        );
      } else {
        setTimeout(renderGoogleBtn, 100);
      }
    };
    renderGoogleBtn();
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        this.authState.isLoggedIn = true;
        this.authState.role = response.data.role;

        alert('Login successful!');
        this.$router.push('/');
      } catch (error) {
        if (error.response?.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response?.status === 404) {
          this.errorMessage = 'User not found. Please check your credentials.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    },
  async handleGoogleSignIn(response) {
  try {
    // First, try to sign in with Google
    const res = await axios.post('http://localhost:5000/auth/google', {
      credential: response.credential,
    });

    // If backend says role is needed, prompt the user
    if (res.data.need_role) {
      // Prompt for role (simple window.prompt, or use a modal for better UX)
      let role = window.prompt('Sign up as CUSTOMER or OWNER? (type exactly)');
      role = role && role.toUpperCase();
      if (role !== 'CUSTOMER' && role !== 'OWNER') {
        this.errorMessage = 'Invalid role selected.';
        return;
      }
      // Send the credential and role to backend to finish signup
      const res2 = await axios.post('http://localhost:5000/auth/google', {
        credential: response.credential,
        role,
      });
      localStorage.setItem('token', res2.data.token);
      localStorage.setItem('role', res2.data.role);
      this.authState.isLoggedIn = true;
      this.authState.role = res2.data.role;
     
      return;
    }

    // Normal flow for existing users
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    this.authState.isLoggedIn = true;
    this.authState.role = res.data.role;
   
    this.$router.push('/');
  } catch (error) {
    this.errorMessage = 'Google sign-in failed. Please try again.';
  }
}
  },
};
</script>