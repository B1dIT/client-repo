<template>
  <div class="container mt-4">
    <!-- Header with buttons for Admin -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- Delete All Button - Only for Admin (left) -->
      <button 
        v-if="isAdmin && words.length > 0" 
        @click="onDeleteAll"
        class="btn btn-danger"
      >
        <i class="fas fa-trash me-2"></i>Delete All
      </button>
      <div v-else></div> <!-- Empty div to maintain spacing -->
      
      <!-- Title (center) -->
      <h2 class="mb-0">Word List</h2>
      
      <!-- Add Word Button - Only for Admin (right) -->
      <router-link 
        v-if="isAdmin" 
        to="/words/new" 
        class="btn btn-primary"
      >
        <i class="fas fa-plus me-2"></i>Add New Word
      </router-link>
      <div v-else></div> <!-- Empty div to maintain spacing -->
    </div>

    <table class="table table-striped table-bordered table-hover">
      <thead class="table-dark text-center">
        <tr>
          <th>English</th>
          <th>German</th>
          <th>Vietnamese</th>
          <!-- Dynamic Actions column header -->
          <th v-if="isAdmin" colspan="3">Actions</th>
          <th v-else>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(word, index) in words" :key="index">
          <td>{{ word.english }}</td>
          <td>{{ word.german }}</td>
          <td>{{ word.vietnamese }}</td>
          
          <!-- Show button - Everyone can see -->
          <td class="text-center">
            <router-link
              class="btn btn-sm btn-success"
              :to="{ name: 'Show', params: { id: word._id } }"
            >
              Show
            </router-link>
          </td>
          
          <!-- Edit & Delete buttons - Only Admin can see -->
          <template v-if="isAdmin">
            <td class="text-center">
              <router-link
                class="btn btn-sm btn-warning"
                :to="{ name: 'Edit', params: { id: word._id } }"
              >
                Edit
              </router-link>
            </td>
            
            <td class="text-center">
              <button
                @click.prevent="onDelete(word._id)"
                class="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- Empty state -->
    <div v-if="words.length === 0" class="text-center mt-5">
      <p class="text-muted">No words found.</p>
      <router-link 
        v-if="isAdmin" 
        to="/words/new" 
        class="btn btn-primary"
      >
        Add First Word
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { viewAllWords, deleteWords } from "../helpers/api";
import { useAuth } from "@/components/useAuth";

// Auth state
const { isAdmin } = useAuth();

// Data
const words = ref([]);

// Load words on component mount
onMounted(async () => {
  try {
    words.value = (await viewAllWords()) || [];
  } catch (error) {
    console.error('Error loading words:', error);
    words.value = [];
  }
});

// Delete all words function - Only admin can call this
const onDeleteAll = async () => {
  if (!isAdmin.value) {
    alert('You do not have permission to delete words.');
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete ALL words? This action cannot be undone!");
  if (confirmed) {
    const doubleConfirmed = window.confirm("This will permanently delete all words. Are you absolutely sure?");
    if (doubleConfirmed) {
      try {
        // Delete each word individually (if no bulk delete API)
        const deletePromises = words.value.map(word => deleteWords(word._id));
        await Promise.all(deletePromises);
        
        words.value = [];
        alert('All words deleted successfully!');
      } catch (error) {
        console.error('Error deleting all words:', error);
        alert('Failed to delete some words. Please try again.');
        // Reload words to get current state
        words.value = (await viewAllWords()) || [];
      }
    }
  }
};

// Delete word function - Only admin can call this
const onDelete = async (id) => {
  if (!isAdmin.value) {
    alert('You do not have permission to delete words.');
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete this word?");
  if (confirmed) {
    try {
      await deleteWords(id);
      words.value = words.value.filter((word) => word._id !== id);
      alert('Word deleted successfully!');
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('Failed to delete word. Please try again.');
    }
  }
};
</script>

<style scoped>
.btn-group {
  gap: 0.25rem;
}

.table th {
  vertical-align: middle;
}

.table td {
  vertical-align: middle;
}

/* Add some spacing for the add button */
.btn-primary {
  display: inline-flex;
  align-items: center;
}
</style>
