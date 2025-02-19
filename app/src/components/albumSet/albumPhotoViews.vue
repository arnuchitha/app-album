<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumPhotoCreate from "@/components/albumSet/albumPhotoCreate.vue";
import type iAlbumFile from "@/interfaces/album-photo";

const _BASE_URL_IMG = import.meta.env.VITE_BASE_URL_IMG;

const router = useRouter();
const modalDialog = useDialog();
const isReady = ref("WARN");
const myStore = useAlbum();
const cModel = ref([] as iAlbumFile []);
const albumValue = ref("");
const albumSetValue = ref("");
const countryValue = ref("");
const cityValue = ref ("");
const pathFile = ref("");

const actions = () => {
  const ac = {
    onInit: async () => {
        await myStore.getAlbumPhoto(albumValue.value, countryValue.value, cityValue.value, albumSetValue.value);
        cModel.value = myStore.albumFile;
        pathFile.value = _BASE_URL_IMG + countryValue.value + "/" + cityValue.value + "/" + albumValue.value + "/" + albumSetValue.value + "/";
        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    onCreateAlbumSet: () =>{
      modalDialog.open( albumPhotoCreate, {
        props: {
          closeOnEscape: true,
          rtl: false,
          modal: true,
          style: {
            width: "1000px",
            margin: "100px",
            position: "fixed",            
          },
          breakpoints: {
            "960px": "75vw",
            "640px": "90vw",
          },
        },
        templates: {
          header: () => {
            return [
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มรูปภาพ")]),
            ];
          },
        },
        data: {
          albumName: albumValue.value,
          countryName: countryValue.value,
          cityName: cityValue.value,
          albumSetName: albumSetValue.value,
        },
        onClose: async (options) => {
          if (options?.data == true) {
              setTimeout(() => {
                actions().onInit();
              }, 300);
          }
        },
      });
    },
  };
  return ac;
};

const events =() => {
    const ev = {
      back: (albumName: string, countryName: string, cityName: string) => {
        router.push({
          path: "/albumCountry/albumCity/album/albumSet",
          query: {albumName: albumName, countryName: countryName, cityName: cityName }, 
        });
      }
    };
  return ev;
}

onMounted(async () => {
    albumValue.value = String(router.currentRoute.value.query.albumName);
    countryValue.value = String(router.currentRoute.value.query.countryName);
    cityValue.value = String(router.currentRoute.value.query.cityName);
    albumSetValue.value = String(router.currentRoute.value.query.albumSetName);
  await actions().onInit();
});
</script>
<template>
    <div>
      <div class="text-right">
        <button
          class="btn-cancel p-button p-component p-button-sm p-button-rounded p-button-outlined w-150 m-10"
          @click="events().back(albumValue, countryValue, cityValue)"
          type="button"
        >
          <span class="p-button-label"
            ><i class="fa-solid fa-arrow-left px-2"></i> กลับหน้าสร้างอัลบั้ม</span
          >
        </button>
      </div>
        <header>
            <h1>{{ albumSetValue }}</h1>
        </header>
        <div class="document-search">
            <div class="row">
                <div class="col w-btn-search">
                    <Button @click="actions().onCreateAlbumSet()">Uploadภาพ</Button>
                </div>
            </div>
        </div>
        <main>
        <div>
            <div>
            <div class="album-photos">
                <img v-for="album in cModel" :key="album.albumFileName" :src="pathFile + album.albumFileName" alt="Photo">
            </div>
            </div>
        </div>
        </main>
    </div>
  </template>
  
<style scoped lang="scss">
/* styles/main.scss */
.card-album {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  background-color: var(--table-bg);
  border-radius: 14px;
  border: 1px solid var(--theme-bg-color);
  transition: 0.3s ease;
  max-width: 200px;
  // max-height: 200px;
  height: 80px;  
  flex-wrap: wrap;
  overflow-y: auto;
  gap: 1rem;
}
.album-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.album-photos img {
  max-width: 200px;
  max-height: 200px;
}
.document-search {
  display: flex;
  justify-content: flex-start;
  padding-bottom: 1rem !important;
  padding-top: 0.75rem !important;
  .w-country-search {
    width: 250px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .w-input-search {
    width: 300px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .w-input-search-m {
    width: 615px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .w-radio-search {
    width: 265px;
    display: flex;
    align-items: center;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .w-dropdown-search {
    width: 180px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .w-btn-clear-search {
    width: 90px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    margin-top: 2px;
  }
  .w-btn-search {
    width: 160px;
    padding-top: 5px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
div > button.bg-search {
  background-color: deepskyblue;
  border: 1px solid deepskyblue;
}

div > button.bg-search:hover {
  background-color: #3bb1f6 !important;
  border: 1px solid #3bb1f6 !important;
}
:global(.p-dropdown-panel) {
  background-color: var(--bg-dialog) !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>