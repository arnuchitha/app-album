<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import LoginVue from './components/Login.vue';

const router = useRouter();

</script>

<template>
  <div id="app">
    <div class="layout">
      <RouterView />
      <DynamicDialog />
    </div>
  </div>
</template>


<style scoped lang="scss">
/* Add your global styles here */
body {
  margin: 0;
  font-family: "Kanit", sans-serif !important;
}
.layout {
  width: 1200px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 20px;
}
</style>
