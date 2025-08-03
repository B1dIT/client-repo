<template>
  <div class="quiz-container container mt-5">
    <div v-if="quizState === 'select-mode'" class="text-center">
      <h2 class="mb-4">Choose Your Quiz Mode</h2>
      <select v-model="selectedMode" class="form-select mb-3">
        <option disabled value="">Select mode</option>
        <option value="en-vi">English → Vietnamese</option>
        <option value="en-de">English → German</option>
        <option value="vi-en">Vietnamese → English</option>
        <option value="de-en">German → English</option>
        <option value="random">Random</option>
      </select>
      <button class="btn btn-primary" @click="startQuiz">Start Quiz</button>
    </div>

    <div v-else-if="quizState === 'question'">
      <div class="card shadow p-4">
        <h5>Question {{ currentQuestionIndex + 1 }} of {{ quiz.length }}</h5>
        <h3 class="mt-3">{{ quiz[currentQuestionIndex].question }}</h3>

        <div class="mt-4">
          <button
            v-for="(option, index) in quiz[currentQuestionIndex].options"
            :key="index"
            class="btn btn-outline-secondary w-100 mb-2"
            @click="selectAnswer(option)"
            :disabled="selected"
            :class="{
              'btn-success': selected && option === quiz[currentQuestionIndex].correctAnswer,
              'btn-danger': selected && option === selectedAnswer && option !== quiz[currentQuestionIndex].correctAnswer
            }"
          >
            {{ option }}
          </button>
        </div>

        <div class="mt-3 text-end">
          <button v-if="selected && currentQuestionIndex < quiz.length - 1" @click="nextQuestion" class="btn btn-primary">
            Next
          </button>
          <button v-if="selected && currentQuestionIndex === quiz.length - 1" @click="finishQuiz" class="btn btn-success">
            Finish
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="quizState === 'result'" class="text-center">
      <h2 class="mb-4">Quiz Complete!</h2>
      <p class="fs-4">You got {{ score }} / {{ quiz.length }} correct.</p>
      <button class="btn btn-secondary" @click="resetQuiz">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { viewAllWords } from '../helpers/api';

const quizState = ref('select-mode');
const selectedMode = ref('');
const quiz = ref([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const selected = ref(false);
const selectedAnswer = ref('');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function startQuiz() {
  const allWords = await viewAllWords();
  const selectedWords = allWords.sort(() => 0.5 - Math.random()).slice(0, 5);

  quiz.value = selectedWords.map((word) => {
    let question = '';
    let correctAnswer = '';
    let wrongAnswers = [];

    switch (selectedMode.value) {
      case 'en-vi':
        question = word.english;
        correctAnswer = word.vietnamese;
        wrongAnswers = allWords
          .filter(w => w._id !== word._id)
          .map(w => w.vietnamese)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        break;
      case 'en-de':
        question = word.english;
        correctAnswer = word.german;
        wrongAnswers = allWords.filter(w => w._id !== word._id).map(w => w.german).sort(() => 0.5 - Math.random()).slice(0, 3);
        break;
      case 'vi-en':
        question = word.vietnamese;
        correctAnswer = word.english;
        wrongAnswers = allWords.filter(w => w._id !== word._id).map(w => w.english).sort(() => 0.5 - Math.random()).slice(0, 3);
        break;
      case 'de-en':
        question = word.german;
        correctAnswer = word.english;
        wrongAnswers = allWords.filter(w => w._id !== word._id).map(w => w.english).sort(() => 0.5 - Math.random()).slice(0, 3);
        break;
      case 'random':
      default:
        // English -> Vietnamese default fallback
        question = word.english;
        correctAnswer = word.vietnamese;
        wrongAnswers = allWords.filter(w => w._id !== word._id).map(w => w.vietnamese).sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    return {
      question,
      correctAnswer,
      options: shuffleArray([correctAnswer, ...wrongAnswers])
    };
  });

  quizState.value = 'question';
}

function selectAnswer(option) {
  selected.value = true;
  selectedAnswer.value = option;
  if (option === quiz.value[currentQuestionIndex.value].correctAnswer) {
    score.value++;
  }
}

function nextQuestion() {
  selected.value = false;
  selectedAnswer.value = '';
  currentQuestionIndex.value++;
}

function finishQuiz() {
  quizState.value = 'result';
}

function resetQuiz() {
  quizState.value = 'select-mode';
  currentQuestionIndex.value = 0;
  score.value = 0;
  quiz.value = [];
  selected.value = false;
  selectedAnswer.value = '';
  selectedMode.value = '';
}
</script>

<style scoped>
.quiz-container {
  max-width: 700px;
  margin: auto;
}
</style>
