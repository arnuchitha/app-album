<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useAlbum } from "@/stores/album-store";
import { useRouter } from "vue-router";
const router = useRouter();
const goRoute = async (p: any) => {
  if (p) {
    await router.push(p);
  }
};
</script>
// eslint-disable-next-line vue/multi-word-component-names
<template>
  <nav
    v-if="useAlbum().getBreadCrums.length > 1"
    class="acc-breadcrumbs"
  >
    <ol>
      <li
        v-for="(item, key) in useAlbum().getBreadCrums"
        :key="key"
      >
        <span
          v-if="key !== useAlbum().getBreadCrums.length - 1"
          class="breadcrumbs-link cursor-pointer"
          @click="goRoute(item.url)"
          :title="item.name"
          >{{ item.name }}</span
        >
        <span v-else class="breadcrumbs-name">{{ item.name }}</span>
        <span
          v-if="useAlbum().getBreadCrums[key + 1]"
          class="breadcrumbs-separator"
          ><span
            style="vertical-align: middle"
            class="material-symbols-outlined"
          >
            navigate_next
          </span></span
        >
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
.acc-breadcrumbs {
  border-radius: 4px;
  ol,
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 7px 15px;
    li {
      color: var(--inactive-color);
      .breadcrumbs-link {
        text-decoration: none;
        color: var(--theme-color);
        border-radius: 2rem;
        padding: 2px 10px;
        -webkit-transition: 0.5s !important;
        transition: 0.5s !important;
        &:hover {
          background: var(--input-bg-color);
        }
      }
      .breadcrumbs-separator {
        color: var(--ico-color-tab-active);
        margin: 0.3rem;
      }
    }
  }
}
</style>
