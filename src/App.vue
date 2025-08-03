<template>
  <div class="vocab-builder-app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <!-- Logo Section -->
        <router-link to="/home" class="logo-link">
          <div class="logo-circle">VB</div>
          <h1 class="logo-text">Vocab Builder</h1>
        </router-link>

        <!-- Main Navigation -->
        <nav class="main-nav">
          <ul class="nav-list">
            <template v-if="!isAdmin">
              <!-- User Navigation -->
              <li class="nav-item">
                <router-link to="/test" class="nav-link">Vocab Test</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/words" class="nav-link">Vocab List</router-link>
              </li>
            </template>
            
            <template v-else>
              <!-- Admin Navigation -->
              <li class="nav-item">
                <router-link to="/User" class="nav-link">User Management</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/words" class="nav-link">Words Management</router-link>
              </li>
            </template>
          </ul>
        </nav>

        <!-- User Controls -->
        <div class="user-controls">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="login-btn">Login</router-link>
            <router-link to="/register" class="signup-btn">Sign Up</router-link>
          </template>
          <template v-else>
            <span class="user-greeting">Hello, {{ user?.name || user?.email }}</span>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </template>
        </div>

       
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3 class="footer-title">Vocab Builder</h3>
          <p class="footer-description">Enhance your vocabulary with our interactive learning platform.</p>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">Quick Links</h4>
          <ul class="footer-links">
            <li><span class="disabled-link">About Us</span></li>
            <li><span class="disabled-link">Privacy Policy</span></li>
            <li><span class="disabled-link">Terms of Service</span></li>
            <li><span class="disabled-link">Contact</span></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">Connect With Us</h4>
          <div class="social-media">
            <a href="#">
              <img src="https://placehold.co/32x32" alt="Facebook social media icon" />
            </a>
            <a href="#">
              <img src="https://placehold.co/32x32" alt="Twitter social media icon" />
            </a>
            <a href="#">
              <img src="https://placehold.co/32x32" alt="Instagram social media icon" />
            </a>
          </div>
        </div>
      </div>
      
      <div class="copyright">
        <p>&copy; 2023 Vocab Builder. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuth } from '@/components/useAuth'

export default {
  name: 'App',
  setup() {
    const { user, isLoggedIn, isAdmin, logout } = useAuth()
    
    const handleLogout = () => {
      logout()
      window.location.href = '/login'
    }
    
    return {
      user,
      isLoggedIn,
      isAdmin,
      handleLogout
    }
  }
}
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}


.app-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: baseline; 
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0; 
}

.logo-circle {
  width: 40px;
  height: 40px;
  background-color: #4a6bff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.logo-text {
  margin-left: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap; 
}

.main-nav {
  flex-grow: 1;
  margin: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: baseline; 
}

.nav-list {
  display: flex;
  list-style: none;
  align-items: baseline;
  gap: 1.5rem;
}

.nav-item {
  
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 1rem; 
  position: relative;
  transition: color 0.2s ease;
  border-radius: 4px;
  white-space: nowrap;
  display: inline-block; 
  line-height: 1.2; 
}

.nav-link:hover {
  color: #4a6bff;
  background-color: #f8f9ff;
}

.user-controls {
  display: flex;
  align-items: baseline; 
  gap: 1rem;
  flex-shrink: 0;
}

.login-btn, .signup-btn, .logout-btn {
  padding: 0.5rem 1.25rem; 
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  border: 1px solid;
  white-space: nowrap;
  display: inline-block; 
  line-height: 1.2; 
}

.login-btn {
  color: #333;
  border-color: #ddd;
  background-color: transparent;
}

.login-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.signup-btn {
  background-color: #4a6bff;
  color: white;
  border-color: #4a6bff;
}

.signup-btn:hover {
  background-color: #3a5be0;
  border-color: #3a5be0;
}

.logout-btn {
  background-color: transparent;
  border-color: #ff4a4a;
  color: #ff4a4a;
}

.logout-btn:hover {
  background-color: #ff4a4a;
  color: white;
}

.user-greeting {
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0 0.5rem;
  white-space: nowrap;
  color: #333;
  line-height: 1.2; 
}

/* Main Content */
.app-content {
  min-height: calc(100vh - 300px);
  padding: 2rem 0;
}

/* Footer Styles */
.app-footer {
  background-color: #f8f9fa;
  padding: 3rem 0 1rem;
  color: #333;
}

.footer-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 2rem;
  align-items: start;
}

.footer-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4a6bff;
}

.footer-description {
  margin-bottom: 1rem;
  color: #666;
}

.footer-subtitle {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding-left: 0; 
}

.footer-links li {
  margin-bottom: 0.5rem;
  padding-left: 0; 
}

.footer-links a {
  text-decoration: none;
  color: #666;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #4a6bff;
}


.disabled-link {
  text-decoration: none;
  color: #999; 
  cursor: not-allowed; 
  opacity: 0.6; 
  display: inline-block; 
}

.disabled-link:hover {
  color: #999; 
}

.social-media {
  display: flex;
  gap: 1rem;
}

.copyright {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  color: #666;
}


@media (max-width: 992px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .main-nav {
    margin: 0 1rem;
  }
  
  .nav-list {
    gap: 1rem; 
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem;
  }
  
  .logo-link {
    flex: 1;
  }
  
  .user-controls {
    margin-left: auto;
    order: 2;
  }
  
  .main-nav {
    display: none;
    width: 100%;
    order: 3;
    margin: 1rem 0 0;
    justify-content: flex-start;
  }
  
  .nav-list {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
  
  .nav-item {
    width: 100%;
  }
  
  .nav-link {
    width: 100%;
    justify-content: flex-start;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .user-controls {
    gap: 0.5rem;
  }
  
  .login-btn, .signup-btn, .logout-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}</style>