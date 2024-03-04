<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAlbum } from "@/stores/album-store";
import { useToast } from "primevue/usetoast";
import BreadCrumbs from "./components/settings/BreadCrumbs.vue";
import type iBreadCrumb from "@/interfaces/bread-crumb";

const router = useRouter();
const isActiveMain = ref(false);
const myStore = useAlbum();
const toast = useToast();

router.afterEach((r) => {
  isActiveMain.value = r.path == "/" ? true : false;
  events().routerToBreadCrumb(r.path);
  myStore.setWaitTimeDelayOnChangeRouter();
});

const events = () => {
  const ev = {
    routerToBreadCrumb: async (p: string) => {

      const dataOptions = [...router.options.routes];
      const optionsToBreadCrumb: iBreadCrumb[] = dataOptions.map((o) => {
        const keyAndName = o.name
          ?.toString()
          .split(",")
          .filter((o) => {
            return o !== "";
          });
        const isKey = keyAndName?.find((v, i) => {
          return i == 0;
        });
        const isName = keyAndName?.find((v, i) => {
          return i == 1;
        });

        const dataRouterToBreadCrumbs: iBreadCrumb = {
          key: isKey,
          name: isName ? isName : isKey,
          url: o.path,
        };
        return dataRouterToBreadCrumbs;
      });
      const originBreadCrumbs = p;
      const arrBreadCrumbs: string[] = originBreadCrumbs
        .split("/")
        .filter((o) => {
          return o !== "";
        });

      // const myObject = router.currentRoute.value.query;
      // const myArray = Object.values(myObject);
      // myArray.filter((o)=> {
      //   return o !== "";
      // });

      await myStore.fetchBreadCrumbIni(arrBreadCrumbs, optionsToBreadCrumb);
    },
  }
  return ev;
};

</script>

<template>
  <div id="app">
    <div class="layout">
      <div class="row">
      <Toast />
        <div class="col-auto bread-padding">
          <BreadCrumbs />
        </div>
      </div>
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
.bread-padding {
  padding-left: 0px
}
</style>
@/stores/album-store