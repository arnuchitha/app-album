<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAlbum } from "@/stores/album-store";
import LoginVue from './components/Login.vue';

const router = useRouter();
const isActiveMain = ref(false);
const myStore = useAlbum();

router.afterEach((r) => {
  isActiveMain.value = r.path == "/" ? true : false;
  myStore.setWaitTimeDelayOnChangeRouter();
});

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
@/stores/album-store