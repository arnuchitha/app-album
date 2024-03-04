<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumCreate from "@/components/album/albumCreate.vue";
import albumCreateCountry from "@/components/album/albumCountry.vue"
import albumCreateCity from "@/components/album/albumCity.vue"
import type iAlbumProject from "@/interfaces/album-project";
import type iCountryList from "@/interfaces/country-list";
import type iCityList from "@/interfaces/cityList"

interface setSearch {
  countryName: string;
  cityName: string;
  keysearch: string;
}

const router = useRouter();
const modalDialog = useDialog();
const isReady = ref("WARN");
const myStore = useAlbum();
const cModel = ref([] as iAlbumProject []);
const cModelShow = ref([] as iAlbumProject []);
const countryValue = ref("");
const cityValue = ref ("");

const modelSearch: setSearch = reactive({
  countryName: "",
  cityName: "",
  keysearch: "",
});

const actions = () => {
  const ac = {
    onInit: async () => {
        await myStore.getFolderAlbum(countryValue.value, cityValue.value)
        cModel.value = myStore.albumProject;
        cModelShow.value = cModel.value;
        await events().showData();
        
        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    onCreateAlbum: () =>{
      modalDialog.open( albumCreate, {
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
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มหมวดอัลบั้ม")]),
            ];
          },
        },
        data: {
          countryName: countryValue.value,
          cityName: cityValue.value
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
      onViewSetAlbum: (albumName: string, countryName: string, cityName: string) => {
        router.push({
          path: "/albumCountry/albumCity/album/albumSet",
          query: { countryName: countryName, cityName: cityName, albumName: albumName  },
        });
      },
      back: (countryName: string) => {
        router.push({
          path: "/albumCountry/albumCity",
          query: { countryName: countryName }, 
        });
      },
      setFilter: async () => {
        cModelShow.value = cModel.value
            .filter((item) => {
            const cTry = modelSearch.keysearch.toLowerCase(),
                cn = item.albumName.toLowerCase();
            const searhcAlbumName = cn.indexOf(cTry) !== -1;
            return searhcAlbumName;
            })
        },
        showData: async () => {
            ev.setFilter();
      },
    };
  return ev;
}

watch(modelSearch, () => {
  events().showData();
});

onMounted(async () => {
  countryValue.value = String(router.currentRoute.value.query.countryName);
  cityValue.value = String(router.currentRoute.value.query.cityName);
  await actions().onInit();
});
</script>
<template>
    <div >
      <div class="text-right">
        <button
          class="btn-cancel p-button p-component p-button-sm p-button-rounded p-button-outlined w-150 m-10"
          @click="events().back(countryValue)"
          type="button"
        >
          <span class="p-button-label"
            ><i class="fa-solid fa-arrow-left px-2"></i> กลับหน้าเมือง</span
          >
        </button>
      </div>
      <header>
            <h1>หมวดอัลบั้ม</h1>
      </header>
    </div>
    <div class="document-search">
      <div class="row">
        <div class="col-2 w-country-search">
          <div class="inputClean">
            <div class="input data-disable">
              <input
                v-model="countryValue"
                type="text"
                placeholder="ชื่อเมือง"
                autocomplete="off"
              />
              <div class="labelInput">
                <label><i class="pi pi-globe"></i> ประเทศ </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4 w-input-search">
          <div class="inputClean">
            <div class="input data-disable">
              <input
                v-model="cityValue"
                type="text"
                placeholder="ชื่อเมือง"
                autocomplete="off"
              />
              <div class="labelInput">
                <label><i class="pi pi-globe"></i> เมือง </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4 w-input-search">
          <div class="inputClean">
              <div class="input">
                <input
                  v-model="modelSearch.keysearch"
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
            <Button @click="actions().onCreateAlbum()">สร้างหมวด</Button>
          </div>
      </div>
    </div>
      <main>
      <div v-for="item in cModelShow" :key="item.albumName">
        <div class="card-album cursor-pointer mt-2" @click="events().onViewSetAlbum(item.albumName, countryValue, cityValue)">
          <p class="text-center mt-4">{{ item.albumName }}</p>
        </div>
      </div>
      </main>
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
    width: 260px;
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
.data-disable {
    pointer-events: none;
    opacity: 0.5;
}
</style>