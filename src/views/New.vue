<template>
  <div class="create-word-container">
    <h2>Add New Word</h2>
    
    <!-- Error/Success Messages -->
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="success" class="success-message">{{ success }}</div>
    
    <form @submit.prevent="handleCreateWord">
      <div class="form-group">
        <label for="english">English Word:</label>
        <input
          type="text"
          id="english"
          v-model="wordData.english"
          required
          placeholder="Enter English word"
        />
      </div>
      
      <div class="form-group">
        <label for="german">German Translation:</label>
        <input
          type="text"
          id="german"
          v-model="wordData.german"
          required
          placeholder="Enter German translation"
        />
      </div>
      
      <div class="form-group">
        <label for="vietnamese">Vietnamese Translation:</label>
        <input
          type="text"
          id="vietnamese"
          v-model="wordData.vietnamese"
          required
          placeholder="Enter Vietnamese translation"
        />
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Adding...' : 'Add Word' }}
        </button>
        <button type="button" @click="resetForm" class="reset-btn">
          Reset
        </button>
        <button type="button" @click="$router.go(-1)" class="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { createVocab, createWord } from '@/helpers/api'

export default {
  name: 'CreateWord',
  data() {
    return {
      wordData: {
        english: '',
        german: '',
        vietnamese: ''
      },
      loading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    validateForm() {
      this.error = '';
      
      if (!this.wordData.english.trim()) {
        this.error = 'English word is required';
        return false;
      }
      
      if (!this.wordData.german.trim()) {
        this.error = 'German translation is required';
        return false;
      }
      
      if (!this.wordData.vietnamese.trim()) {
        this.error = 'Vietnamese translation is required';
        return false;
      }
      
      return true;
    },
    
    async handleCreateWord() {
      if (!this.validateForm()) {
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        const response = await createVocab(this.wordData);
        
        this.success = 'Word added successfully!';
        this.resetForm();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          this.$router.push('/words');
        }, 2000);
        
      } catch (error) {
        console.error('Create word error:', error);
        this.error = error.response?.data?.message || 'Failed to add word';
      } finally {
        this.loading = false;
      }
    },
    
    resetForm() {
      this.wordData = {
        english: '',
        german: '',
        vietnamese: ''
      };
      this.error = '';
      this.success = '';
    }
  }
}
</script>

<style scoped>
.create-word-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 30px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #ff9800;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.reset-btn:hover {
  background-color: #e68900;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn:hover {
  background-color: #da190b;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #c62828;
}

.success-message {
  background-color: #e8f5e8;
  color: #2e7d32;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #2e7d32;
}
</style>

