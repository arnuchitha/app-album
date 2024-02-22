<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumSetCreate from "@/components/albumSet/albumSetCreate.vue";
import type iAlbumProject from "@/interfaces/album-project";

interface Photo {
  id: number;
  url: string;
}

interface setSearch {
  countryName: string;
  cityName: string;
}

interface setSearchShow {
  CO: string;
  CI: string;
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
      { id: 1, url: './src/assets/Images/Pictour/1.jpg' },
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
const cModel = ref([] as iAlbumProject []);
const albumValue = ref("");
const countryValue = ref("");
const cityValue = ref ("");
const keySearch = ref("");
const countryList = ref(myStore.countryList);

const actions = () => {
  const ac = {
    onInit: async () => {
        await myStore.getCountryList();
        countryList.value = myStore.countryList;
        // await ac.getDataView();
        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    getDataView: async () => {
    },
    // เพิ่มอัลบั้มภาพใหม่
    addAlbum: (name: string, photos: Photo[]) => {
      const newAlbum: Album = {
        id: albums.value.length + 1,
        name,
        photos
      };
      albums.value.push(newAlbum);
    },
    // ลบอัลบั้มภาพ
    deleteAlbum: (id: number) => {
      const index = albums.value.findIndex(album => album.id === id);
      if (index !== -1) {
        albums.value.splice(index, 1);
      }
    },
    onCreateAlbum: () =>{
      modalDialog.open( albumSetCreate, {
        props: {
          closeOnEscape: true,
          rtl: false,
          modal: true,
          style: {
            width: "1000px",
            margin: "0px",
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
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มอัลบั้ม")]),
            ];
          },
        },
        onClose: async (options) => {
          if (options?.data == true) {
              console.log("Complete");
          }
          // if (options?.data) {
          //   if(isManager.value){
          //     await myStore.fetchTemplatesListByAll();
          //     collectionSet.value = myStore.listTemplates;
          //   }else{
          //     await myStore.fetchTemplatesListByDepartmentID(userLogin.departmentId);
          //     collectionSet.value = myStore.listTemplates;
          //   }
          // }
        },
      });
    },
  };
  return ac;
};

const events =() => {
    const ev = {
      setSearch: () => {
        var getURL = {};
        if (countryValue.value) {
          getURL = Object.assign({}, getURL, { CO: countryValue.value });
        }
        if (cityValue.value) {
          getURL = Object.assign({}, getURL, { CI: cityValue.value });
        }
        router.push({
          path: "/album",
          query: getURL,
        });
      },
      clearSearch: () => {
        console.log("IN CLEAR");
        router.push({
          path: "/album/albumSet",
        });
      },
    };
  return ev;
}

onMounted(async () => {
    albumValue.value = String(router.currentRoute.value.query.albumName);
    countryValue.value = String(router.currentRoute.value.query.countryName);
    cityValue.value = String(router.currentRoute.value.query.cityName);
    console.log(albumValue.value, countryValue.value, cityValue.value);

//   const getValue = (router.currentRoute.value.query as unknown) as setSearchShow;
//     console.log(getValue)
//   if (Object.keys(getValue).length) {
//     modelSearch.countryName = String(getValue.CO);
//     modelSearch.cityName = String(getValue.CI);
//     await myStore.getFolderAlbum(getValue.CO, getValue.CI);
//     cModel.value = myStore.albumProject;
//   }
  await actions().onInit();
});
</script>
<template>
    <div>
      <header>
            <h1>{{ albumValue }}</h1>
        </header>
      <div class="document-search">
        <div class="row">

          <div class="col-4 w-input-search">
            <div class="inputClean">
              <div class="input">
                <input
                  v-model="countryValue"
                  type="text"
                  placeholder="ชื่อประเทศ"
                  autocomplete="off"
                />
                <div class="labelInput">
                  <label><i class="fa-solid fa-magnifying-glass"></i> ชื่อประเทศ </label>
                </div>
              </div>
            </div>
          </div>



          <div class="col-4 w-input-search">
            <div class="inputClean">
              <div class="input">
                <input
                  v-model="cityValue"
                  type="text"
                  placeholder="ชื่อเมือง"
                  autocomplete="off"
                />
                <div class="labelInput">
                  <label><i class="fa-solid fa-magnifying-glass"></i> ชื่อเมือง </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-4 w-input-search">
            <div class="inputClean">
              <div class="input">
                <input
                  v-model="keySearch"
                  type="text"
                  placeholder="ชื่อหมวด"
                  autocomplete="off"
                />
                <div class="labelInput">
                  <label><i class="fa-solid fa-magnifying-glass"></i> ค้นหา </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col w-btn-search">
            <Button @click="actions().onCreateAlbum()">สร้างอัลบั้ม</Button>
          </div>
        </div>
      </div>
        <main>
        <!-- <div v-if="cModel.length === 0">
            <p>No albums found. Please add some.</p>
        </div>
        <div v-else>
            <div v-for="album in albums" :key="album.id">
            <h2>{{ album.name }}</h2>
            <div class="album-photos">
                <img v-for="photo in album.photos" :key="photo.id" :src="photo.url" alt="Photo">
            </div>
            </div>
        </div> -->
        <div v-for="item in cModel" :key="item.albumName">
          <div class="card-album cursor-pointer mt-2" @click="123">
            <p class="text-center mt-4">{{ item.albumName }}</p>
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