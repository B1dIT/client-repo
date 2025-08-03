<template>
  <div class="sign-in-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>

      <button type="button" @click="handleRegister" :disabled="loading">
        {{ loading ? 'Đang xử lý...' : 'Register' }}
      </button>
    </form>

    <!-- Messages -->
    <div v-if="loading" style="color: blue; margin-top: 10px;">
      Đang xử lý...
    </div>

    <div v-if="error" style="color: red; margin-top: 10px;">
      {{ error }}
    </div>

    <div v-if="success" style="color: green; margin-top: 10px;">
      {{ success }}
    </div>
  </div>
</template>

<script>
import { registerUser } from '@/helpers/api.js'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    validateForm() {
      console.log('validateForm được gọi');
      
      // Reset error
      this.error = '';
      
      // Ceck username length
      if (this.username.length < 2 || this.username.length > 20) {
        this.error = 'Username phải từ 2-20 ký tự';
        return false;
      }
      
      // Check email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.error = 'Email không hợp lệ';
        return false;
      }
      
      // Check password length
      if (this.password.length < 6) {
        this.error = 'Password phải ít nhất 6 ký tự';
        return false;
      }
      
      return true;
    },

    async handleRegister() {
      console.log('handleRegister được gọi!');
      console.log('Data:', this.username, this.email, this.password);
      
      // 1. Validation
      if (!this.validateForm()) {
        console.log('Validation failed');
        return;
      }
      
      console.log('Validation passed');
      
      // 2. Set loading
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        // 3. Call API
        const response = await registerUser({
          username: this.username,
          email: this.email,
          password: this.password
        });
        
        console.log('API Response:', response);
        
        // 4. Success message
        this.success = 'Đăng ký thành công!';
        
        // 5. Push to login page after 2 seconds
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
        
      } catch (error) {
        console.error('API Error:', error);
        // 6. handle error
        this.error = error.response?.data?.message || 'Có lỗi xảy ra';
      } finally {
        // 7. turn off loading
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.sign-in-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 2px 2px 12px #aaa;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>