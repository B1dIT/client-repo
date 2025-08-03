import { ref, computed } from 'vue'

// Global state
const user = ref(null)
const token = ref(null)

export function useAuth() {
  // Computed properties
  const isLoggedIn = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.role === 'admin') 

  // Initialize from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  // Login function
  const login = (userData, userToken) => {
    user.value = userData
    token.value = userToken
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Logout function
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user: currentUser,
    token,
    isLoggedIn,
    isAdmin, // ← THÊM DÒNG NÀY
    login,
    logout,
    initAuth
  }
}