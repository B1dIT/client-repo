<template>
  <div class="word-detail-page">
    <div class="container">
      <!-- Header with breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">
          ← Back to Words
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading word details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Oops! Something went wrong</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="loadWord" class="retry-btn">
          🔄 Try Again
        </button>
      </div>

      <!-- Word Content -->
      <div v-else-if="word" class="word-content">
        <!-- Main Word Card -->
        <div class="word-card">
          <div class="word-header">
            <h1 class="word-title">{{ word.english }}</h1>
            <div class="word-actions">
              <button 
                @click="toggleFavorite" 
                :class="['favorite-btn', { active: isFavorite }]"
                :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                {{ isFavorite ? '❤️' : '🤍' }}
              </button>
              <button 
                @click="englishPronunciation" 
                class="play-btn"
                title="English pronunciation"
              >
                🔊
              </button>
                <button 
                @click="germanPronunciation" 
                class="play-btn"
                title="German pronunciation"
              >
                🔊
              </button>
                <button 
                @click="vietnamesePronunciation" 
                class="play-btn"
                title="Vietnamese pronunciation"
              >
                🔊
              </button>
            </div>
          </div>

          <!-- Language Cards -->
          <div class="language-grid">
            <div class="language-card english">
              <div class="language-header">
                <div class="flag">🇬🇧</div>
                <h3>English</h3>
              </div>
              <p class="language-text">{{ word.english }}</p>
              <div class="language-actions">
                <button @click="copyToClipboard(word.english)" class="copy-btn">
                  📋
                </button>
              </div>
            </div>

            <div class="language-card german">
              <div class="language-header">
                <div class="flag">🇩🇪</div>
                <h3>Deutsch</h3>
              </div>
              <p class="language-text">{{ word.german }}</p>
              <div class="language-actions">
                <button @click="copyToClipboard(word.german)" class="copy-btn">
                  📋
                </button>
              </div>
            </div>

            <div class="language-card vietnamese">
              <div class="language-header">
                <div class="flag">🇻🇳</div>
                <h3>Tiếng Việt</h3>
              </div>
              <p class="language-text">{{ word.vietnamese }}</p>
              <div class="language-actions">
                <button @click="copyToClipboard(word.vietnamese)" class="copy-btn">
                  📋
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Info (if available) -->
          <div v-if="word.category || word.difficulty" class="word-meta">
            <div v-if="word.category" class="meta-item">
              🏷️ <span class="meta-label">Category:</span>
              <span class="meta-value">{{ word.category }}</span>
            </div>
            <div v-if="word.difficulty" class="meta-item">
              📈 <span class="meta-label">Difficulty:</span>
              <div class="difficulty-indicator">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  :class="['difficulty-dot', { active: i <= (word.difficulty || 1) }]"
                ></div>
              </div>
            </div>
          </div>

          <!-- Example sentences (if available) -->
          <div v-if="word.examples && word.examples.length > 0" class="examples-section">
            <h3 class="examples-title">
              📖 Example Sentences
            </h3>
            <div class="examples-list">
              <div 
                v-for="(example, index) in word.examples" 
                :key="index"
                class="example-item"
              >
                <p class="example-text">{{ example }}</p>
                <button @click="copyToClipboard(example)" class="copy-btn-small">
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>

      
    </div>
      
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" :class="['toast', toastType]">
      <div class="toast-content">
        <div class="toast-icon">
          {{ toastType === 'success' ? '✅' : '❌' }}
        </div>
        <span class="toast-message">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { viewByVocabById } from "../helpers/api";

const route = useRoute();
const router = useRouter();
const word = ref(null);
const loading = ref(true);
const error = ref(null);
const isFavorite = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

onMounted(() => {
  loadWord();
});

const loadWord = async () => {
  try {
    loading.value = true;
    error.value = null;
    const id = route.params.id;
    word.value = await viewByVocabById(id);
    
    // Check if word is in favorites (from localStorage)
    const favorites = JSON.parse(localStorage.getItem('favoriteWords') || '[]');
    isFavorite.value = favorites.includes(id);
  } catch (err) {
    error.value = err.message || 'Failed to load word details';
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem('favoriteWords') || '[]');
  const wordId = route.params.id;
  
  if (isFavorite.value) {
    const index = favorites.indexOf(wordId);
    if (index > -1) favorites.splice(index, 1);
    showToastMessage('Removed from favorites', 'success');
  } else {
    favorites.push(wordId);
    showToastMessage('Added to favorites', 'success');
  }
  
  localStorage.setItem('favoriteWords', JSON.stringify(favorites));
  isFavorite.value = !isFavorite.value;
};

const englishPronunciation = () => {
  if ('speechSynthesis' in window && word.value) {
    const utterance = new SpeechSynthesisUtterance(word.value.english);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    showToastMessage('Playing pronunciation', 'success');
  } else {
    showToastMessage('Speech synthesis not supported', 'error');
  }
};
const germanPronunciation = () => {
  if ('speechSynthesis' in window && word.value) {
    const utterance = new SpeechSynthesisUtterance(word.value.german);
    utterance.lang = 'en-DE';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    showToastMessage('Playing pronunciation', 'success');
  } else {
    showToastMessage('Speech synthesis not supported', 'error');
  }
};
const vietnamesePronunciation= () => {
  if ('speechSynthesis' in window && word.value) {
    const utterance = new SpeechSynthesisUtterance(word.value.vietnamese);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    showToastMessage('Playing pronunciation', 'success');
  } else {
    showToastMessage('Speech synthesis not supported', 'error');
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToastMessage('Copied to clipboard', 'success');
  } catch (err) {
    showToastMessage('Failed to copy', 'error');
  }
};

const startQuiz = () => {
  // Navigate to quiz with this specific word
  router.push({
    name: 'quiz',
    query: { wordId: word.value.id }
  });
};

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
</script>

<style scoped>
.word-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Breadcrumb */
.breadcrumb {
  margin-bottom: 2rem;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 1;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  font-size: 1.125rem;
  opacity: 0.9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-message {
  opacity: 0.9;
  margin-bottom: 2rem;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Word Content */
.word-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.word-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.word-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.word-actions {
  display: flex;
  gap: 0.5rem;
}

.favorite-btn, .play-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn {
  background: #fee2e2;
  color: #dc2626;
}

.favorite-btn.active {
  background: #dc2626;
  color: white;
}

.play-btn {
  background: #dbeafe;
  color: #2563eb;
}

.play-btn:hover {
  background: #2563eb;
  color: white;
}

/* Language Grid */
.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.language-card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.language-card.english {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.language-card.german {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.language-card.vietnamese {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.language-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.flag {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.language-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.language-text {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.language-actions {
  display: flex;
  justify-content: flex-end;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: inherit;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Word Meta */
.word-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #64748b;
}

.meta-label {
  margin-right: 0.5rem;
  font-weight: 500;
}

.meta-value {
  color: #1e293b;
  font-weight: 600;
}

.difficulty-indicator {
  display: flex;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.difficulty-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #e2e8f0;
  transition: background 0.2s;
}

.difficulty-dot.active {
  background: #f59e0b;
}

/* Examples Section */
.examples-section {
  margin-bottom: 2rem;
}

.examples-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.examples-list {
  y: 0.75rem;
}

.example-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.example-text {
  font-style: italic;
  color: #475569;
  margin: 0;
  flex-grow: 1;
}

.copy-btn-small {
  background: #e2e8f0;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;
}

.copy-btn-small:hover {
  background: #cbd5e1;
  color: #475569;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-accent {
  background: #10b981;
  color: white;
}

.btn-accent:hover {
  background: #059669;
}

/* Not Found State */
.not-found-container {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.not-found-message {
  opacity: 0.9;
  margin-bottom: 2rem;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.toast-icon {
  margin-right: 0.75rem;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast-message {
  font-weight: 500;
  color: #1f2937;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .word-title {
    font-size: 2rem;
  }
  
  .language-grid {
    grid-template-columns: 1fr;
  }
  
  .word-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .toast {
    left: 1rem;
    right: 1rem;
    top: 1rem;
  }
}
</style>