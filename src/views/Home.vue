<template>
  <div class="container my-5">

    
    <!-- Search Section -->
    <div class="input-group mb-5 shadow-sm">
      <input
        v-model="searchQuery"
        @keyup.enter="onSearch"
        type="search"
        class="form-control form-control-lg"
        placeholder="Search your vocabulary..."
        aria-label="Vocabulary search input"
      />
      <button class="btn btn-primary btn-lg" @click="onSearch" aria-label="Submit search">
        Search
      </button>
    </div>

    <!-- Search Results -->
    <div class="mt-5">
      <h4 v-if="results.length">Search Results</h4>
      <div v-if="loading" class="text-muted">Loading...</div>
      <div v-if="error" class="text-danger">{{ error }}</div>
      <div v-if="!loading && results.length === 0 && searchQuery">
        <em>No words found.</em>
    </div>

  
      <ul class="list-group">
        <li
          v-for="word in results"
          :key="word._id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            <strong>{{ word.english }}</strong> – {{ word.german }} – {{ word.vietnamese }}
          </span>
        </li>
      </ul>
      

    <div class="bg-primary text-white text-center p-5 rounded shadow">
      <h2 class="fw-bold mb-3">Welcome to Vocab Builder</h2>
      <p class="fs-5 mx-auto" style="max-width: 800px;">
        Vocab Builder is your go-to tool for expanding and testing your vocabulary skills.
        Quickly find words, build lists, and challenge yourself with tests—all in one clean,
        easy-to-use interface.
      </p>
    </div>
    <div class="social-media">
            <a href="#">
              <img src="@/assets/ggez.jpg/" alt="Twitter social media icon" />
            </a>
            <a href="#">
              <img src="@/assets/bm.webp/" alt="Twitter social media icon" />
            </a>
            <a href="#">
              <img src="https://placehold.co/425x400" alt="Twitter social media icon" />
            </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      searchQuery: "",
      results: [],
      loading: false,
      error: ""
    };
  },
  methods: {
    async onSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        alert("Please enter a keyword to search.");
        return;
      }

      this.loading = true;
      this.error = "";
      this.results = [];

      try {
        const response = await axios.get(`https://vbcw.onrender.com/vocabs/search?keyword=${query}`, {
       
        });
        this.results = response.data;
      } catch (err) {
        this.error = "Error fetching search results.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>


