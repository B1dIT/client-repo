<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">User Management</h2>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <input v-model="user.username" class="form-control" readonly/>
          </td>
          <td>
            <input v-model="user.email" class="form-control" readonly/>
          </td>
          <td>
            <select v-model="user.role" class="form-select">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </td>
          <td>
            <button @click="updateUser(user)" class="btn btn-sm btn-primary me-1">Update</button>
            <button @click="deleteUser(user._id)" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);

const getAllUsers = async () => {
  const res = await axios.get('https://vbcw.onrender.com/api/users', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  users.value = res.data;
};

const updateUser = async (user) => {
  await axios.put(`https://vbcw.onrender.com/api/users/${user._id}`, user, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  alert('User updated!');
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    await axios.delete(`https://vbcw.onrender.com/api/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    users.value = users.value.filter(u => u._id !== id);
  }
};

onMounted(() => {
  getAllUsers();
});
</script>
