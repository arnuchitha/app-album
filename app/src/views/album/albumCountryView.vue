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

interface Photo {
  id: number;
  url: string;
}

interface setSearch {
  countryName: string;
}

interface setSearchShow {
  CO: string;
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
const cModel = ref([] as iCountryList []);
const cModelShow = ref([] as iCountryList []);
const countryValue = ref("");
const cityValue = ref ("");
const keySearch = ref("");
const countryList = ref(myStore.countryList);

const modelSearch: setSearch = reactive({
  countryName: ""
});

const actions = () => {
  const ac = {
    onInit: async () => {
        await myStore.getCountryList();
        countryList.value = myStore.countryList;
        cModel.value = countryList.value;

        // const getValue = (router.currentRoute.value.query as unknown) as setSearchShow;
        // if (Object.keys(getValue).length) {
        //     modelSearch.countryName = String(getValue.CO);
        //     cModel.value = countryList.value.filter((o)=> {
        //         o.countryName == modelSearch.countryName;
        //         return o;
        //     });
        // }
        // await ac.getDataView();
        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    onCreateCountry: () =>{
      modalDialog.open( albumCreateCountry, {
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
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มประเทศ")]),
            ];
          },
        },
        onClose: async (options) => {
          if (options?.data == true) {
              setTimeout(() => {
              }, 300);
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

watch(modelSearch, async () => {
  countryValue.value = modelSearch.countryName;
    // await actions().getDataView();
    // events().showData();
});

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
            path: "/",
            query: getURL,
            });
        },
        clearSearch: () => {
            console.log("IN CLEAR");
            router.push({
            path: "/",
            });
        },
        onViewCity: (countryName: string) => {
            router.push({
            path: "/albumCity",
            query: { countryName: countryName },
            });
        },
        // setFilter: async () => {
        //     cModelShow.value = cModel.value
        //     .filter((item) => {
        //     const cTry = modelSearch.countryName.toLowerCase(),
        //         cn = item.countryName.toLowerCase();
        //     const searhcCountryName = cn.indexOf(cTry) !== -1;
        //     return modelSearch.countryName == "All Country" ? true : searhcCountryName;
        //     })
        // },
        // showData: async () => {
        //     ev.setFilter();
        // },
    };
  return ev;
}

// watch(modelSearch, () => {
//   events().showData();
// });


onMounted(async () => {
  await actions().onInit();
});
</script>
<template>
    <div >
      <header>
            <h1>My Photo Album</h1>
      </header>
    </div>
    <div class="document-search">
      <div class="row">
        <!-- <div class="col-2 w-country-search">
          <div class="box-input-search-dropdown">
            <div class="inputClean">
              <div class="input input-pi">
                <Dropdown
                  v-model="modelSearch.countryName"
                  optionLabel="countryName"
                  optionValue="countryName"
                  :options="countryList"
                  placeholder="เลือกประเทศ"
                  :filter="true"
                  class="p-dropdown-country"
                >
                  <template #value="countryList">
                    <div v-if="countryList.value">
                      <div>{{ countryList.value }}</div>
                    </div>
                    <span v-else>
                      {{ countryList.placeholder }}
                    </span>
                  </template>
                  <template #option="countryList">
                    <div class="template-country">
                      <div class="template-country-content">
                        {{ countryList.option.countryName }}
                      </div>
                    </div>
                  </template>
                </Dropdown>
                <div class="labelInput">
                  <label><i class="pi pi-globe"></i> ประเทศ </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-auto pt-2">
          <div class="document-search-accept">
            <Button
              label="Search"
              icon="pi pi-search"
              class="bg-search p-button-sm p-button-rounded w-100"
              @click="events().setSearch"
            />
          </div>
        </div>
        <div class="w-btn-clear-search" @click="events().clearSearch">
          <p class="text-blue clear-all cursor-pointer">
            Clear all
          </p>
        </div> -->
        <div class="col w-btn-search">
            <Button @click="actions().onCreateCountry()">สร้างประเทศ</Button>
          </div>
      </div>
    </div>
      <main>
      <!-- <div>
          <div v-for="album in albums" :key="album.id">
          <h2>{{ album.name }}</h2>
          <div class="album-photos">
              <img v-for="photo in album.photos" :key="photo.id" :src="photo.url" alt="Photo">
          </div>
          </div>
      </div> -->

      <div v-for="item in cModel" :key="item.countryName">
        <div class="card-album cursor-pointer mt-2" @click="events().onViewCity(item.countryName)">
          <p class="text-center mt-4">{{ item.countryName }}</p>
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
</style>