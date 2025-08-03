import { createRouter, createWebHistory } from 'vue-router'

import Words from './views/Words.vue'
import Show from './views/Show.vue'
import New from './views/New.vue'
import Edit from './views/Edit.vue'
import Test from './views/Test.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Home from './views/Home.vue'

import User from './views/User.vue'



const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/words',
    name: 'Words',
    component: Words
  },
  {
    path: '/words/new',
    name: 'New',
    component: New
  },
  {
    path: '/words/show/:id',
    name: 'Show',
    component: Show
  },
  {
    path: '/words/edit/:id',
    name: 'Edit',
    component: Edit
  },
  {
  path: '/test',
  name: 'Test',
  component: Test
},
{
  path: '/login',
  name: 'Login',
  component: Login
},
{
  path: '/register',
  name: 'Signup',
  component: Register
},
{
  path: '/home',
  name: 'Home',
  component: Home
},


{
  path: '/user',
  name: 'User',
  component: User
},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
