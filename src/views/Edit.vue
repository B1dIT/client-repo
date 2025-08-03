<template>
  <div class="container mt-4">
    <h2 class="mb-4">Edit Word</h2>

    <!-- Nếu word có dữ liệu -->
    <form v-if="word" @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label">English</label>
        <input v-model="word.english" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">German</label>
        <input v-model="word.german" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Vietnamese</label>
        <input v-model="word.vietnamese" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
      <router-link to="/words" class="btn btn-secondary ms-2">Cancel</router-link>
    </form>

    
    <div v-else class="alert alert-danger">
      Access denied. You do not have permission to edit this word.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { viewByVocabById, updateVocab } from "../helpers/api";

const route = useRoute();
const router = useRouter();
const word = ref({ english: "", german: "", vietnamese: "" });

onMounted(async () => {
  const id = route.params.id;
  word.value = await viewByVocabById(id);
});

const onSubmit = async () => {
  await updateVocab(route.params.id, word.value);
  router.push("/words");
};
</script>
