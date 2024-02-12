<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";

const username = ref("");
const password = ref("");

const actions = () => {
  const ac = {
    onInit: async () => {
        // actions().loginViewShow();
    },
    loginView: async () => {
        console.log('Logging in...');
        console.log('Username:', username.value);
        console.log('Password:', password.value);
    },
    loginViewShow: (u:string, p: string) => {
        console.log('Username:', u);
        console.log('Password:', p);
    },
  };
  return ac;
};

onMounted(async () => {
//   await actions().onInit();
});
  </script>
<template>
    <div class="login-container">
      <div class="login-form">
        <h1>Login</h1>
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" placeholder="Enter your username">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" placeholder="Enter your password">
          </div>
          <button @click="actions().loginViewShow(username,password)" type="submit">Login</button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-form {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  