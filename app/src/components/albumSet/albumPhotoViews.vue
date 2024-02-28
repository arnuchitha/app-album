<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumPhotoCreate from "@/components/albumSet/albumPhotoCreate.vue";
import type iAlbumSet from "@/interfaces/album-set";

interface Photo {
  id: number;
  url: string;
}

interface Album {
  id: number;
  name: string;
  photos: Photo[];
}

const albums = ref<Album[]>([
  {
    id: 1,
    name: 'Travel',
    photos: [
      { id: 1, url: "./src/assets/Images/Pictour/1.jpg" },
      { id: 2, url: './src/assets/Images/Pictour/2.jpg' },
      { id: 3, url: './src/assets/Images/Pictour/3.jpg' }
    ]
  },
  {
    id: 2,
    name: 'Natural',
    photos: [
      { id: 4, url: './src/assets/Images/Pictour/4.jpg' },
      { id: 5, url: './src/assets/Images/Pictour/5.jpg' },
      { id: 6, url: './src/assets/Images/Pictour/1.jpg' }
    ]
  }
]);

const router = useRouter();
const modalDialog = useDialog();
const isReady = ref("WARN");
const myStore = useAlbum();
const cModel = ref([] as iAlbumSet []);
const albumValue = ref("");
const albumSetValue = ref("");
const countryValue = ref("");
const cityValue = ref ("");

const actions = () => {
  const ac = {
    onInit: async () => {
        // await myStore.getFolderAlbumSet(albumValue.value, countryValue.value, cityValue.value);
        // cModel.value = myStore.albumSet;
        // await ac.getDataView();
        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    getDataView: async () => {
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
      setSearch: () => {
        
      },
      clearSearch: () => {
        
      },
      back: (albumName: string, countryName: string, cityName: string) => {
        router.push({
          path: "/albumSet",
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
            <div v-for="album in albums" :key="album.id">
            <h2>{{ album.name }}</h2>
            <div class="album-photos">
                <img v-for="photo in album.photos" :key="photo.id" :src="photo.url" alt="Photo">
            </div>
            </div>
        </div>

        <!-- <div v-for="item in cModel" :key="item.albumSetName">
          <div class="card-album cursor-pointer mt-2" @click="123">
            <p class="text-center mt-4">{{ item.albumSetName }}</p>
          </div>
        </div> -->
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