<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumCreateCity from "@/components/album/albumCity.vue"
import type iCityList from "@/interfaces/cityList"


interface setSearch {
  countryName: string;
  cityName: string;
}


const router = useRouter();
const modalDialog = useDialog();
const isReady = ref("WARN");
const myStore = useAlbum();
const cModel = ref([] as iCityList []);
const countryValue = ref("");
const cityList = ref(myStore.cityList);

const modelSearch: setSearch = reactive({
  countryName: "",
  cityName: "",
});

const actions = () => {
  const ac = {
    onInit: async () => {
        await myStore.getCityList(countryValue.value);
        cityList.value = myStore.cityList;
        cModel.value = cityList.value;
        await events().showData();

        setTimeout(() => {
          isReady.value = "READY";
        }, 1000);
    },
    onCreateCity: () =>{
      modalDialog.open( albumCreateCity, {
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
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มเมือง")]),
            ];
          },
        },
        data: {
          countryNameValue: countryValue.value,
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
        onViewAlbum: (countryName: string, cityName: string) => {
            router.push({
            path: "/albumCountry/albumCity/album",
            query: { countryName: countryName, cityName: cityName },
            });
        },
        back: () => {
          router.push({
            path: "/albumCountry", 
          });
        },
        setFilter: async () => {
            cModel.value = cityList.value
            .filter((item) => {
            const cTry = modelSearch.cityName.toLowerCase(),
                cn = item.cityName.toLowerCase();
            const searhcCityName = cn.indexOf(cTry) !== -1;
            return searhcCityName;
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
    await actions().onInit();
});
</script>
<template>
    <div >
      <div class="text-right">
        <button
          class="btn-cancel p-button p-component p-button-sm p-button-rounded p-button-outlined w-150 m-10"
          @click="events().back()"
          type="button"
        >
          <span class="p-button-label"
            ><i class="fa-solid fa-arrow-left px-2"></i> กลับหน้าหลัก</span
          >
        </button>
      </div>
      <header>
            <h1>ประเทศ {{ countryValue }}</h1>
      </header>
    </div>
    <div class="document-search">
      <div class="row">
        <div class="col-2 w-country-search">
          <div class="box-input-search-dropdown">
            <div class="inputClean">
              <div class="input">
                <input
                  v-model="modelSearch.cityName"
                  type="text"
                  placeholder="ชื่อเมือง"
                  autocomplete="off"
                />
                <div class="labelInput">
                  <label><i class="fa-solid fa-magnifying-glass"></i> ค้นหา </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col w-btn-search">
            <Button @click="actions().onCreateCity()">สร้างเมือง</Button>
          </div>
      </div>
    </div>
      <main>

      <div v-for="item in cModel" :key="item.cityName">
        <div class="card-album cursor-pointer mt-2" @click="events().onViewAlbum(countryValue, item.cityName)">
          <p class="text-center mt-4">{{ item.cityName }}</p>
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