import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Form from '../pages/Form.vue';
import Account from '../pages/Account.vue';
import Edit from '../pages/Edit.vue';


// import Dog from '../pages/Dog.vue';
// import Reminders from '../pages/Reminders.vue';

const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/account', component: Account, name: 'account' },
  { path: '/form', component: Form, name: 'form' },
  { path: '/edit/:id', component: Edit, name: 'edit' },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;
