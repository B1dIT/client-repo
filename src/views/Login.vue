<template>
  <div class="sign-in-container">
    <h2>Sign In</h2>
    <form @submit.prevent="handleLogin">
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
      <button type="submit">Sign In</button>
  <div v-if="error" class="alert alert-danger mt-2">
    {{ error }}
  </div>
    </form>
  </div>
  
</template>

<script>
import { loginUser } from '@/helpers/api';
import { useAuth } from '@/components/useAuth';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: '',
      success: ''
    };
  },
  methods: {
    validateForm(){
        console.log()

        this.error = '';

        //check email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(this.email)) {
            this.error = 'Invalid email format';
            return false;
        }

        //check password
        if(this.password.length < 6) {
            this.error = 'Password must be at least 6 characters long';
            return false;
        }
        return true;
    },
     // Handle login
async handleLogin() {
  
  if (!this.validateForm()) {
    return;
  }
  
  this.loading = true;
  this.error = '';
  
  try {
    const response = await loginUser({
      email: this.email,
      password: this.password
    });
    
    // store user data and token in local storage
    const { login } = useAuth();
    login(response.data.user, response.data.token);
    
    this.success = 'Login success!';
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    

     if (response.data.user.role === 'admin') {
    this.$router.push('/user');

  } else {
    this.$router.push('/home');  // hoặc /home
  }

    
  } catch (error) {
    this.error = error.response?.data?.message || 'Error occurred during login';
  } finally {
    this.loading = false;
  }
}
  }
};

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
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
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
</style>
