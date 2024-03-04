<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import albumCreateCountry from "@/components/album/albumCountry.vue"
import type iCountryList from "@/interfaces/country-list";

interface setSearch {
  countryName: string;
}


const router = useRouter();
const modalDialog = useDialog();
const isReady = ref("WARN");
const myStore = useAlbum();
const cModel = ref([] as iCountryList []);
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
        await events().showData();

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
        onViewCity: (countryName: string) => {
            router.push({
            path: "/albumCountry/albumCity",
            query: { countryName: countryName },
            });
        },
        setFilter: async () => {
            cModel.value = countryList.value
            .filter((item) => {
            const cTry = modelSearch.countryName.toLowerCase(),
                cn = item.countryName.toLowerCase();
            const searhcCountryName = cn.indexOf(cTry) !== -1;
            return searhcCountryName;
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
        <div class="col-2 w-country-search">
          <div class="box-input-search-dropdown">
            <div class="inputClean">
              <div class="input">
                <input
                  v-model="modelSearch.countryName"
                  type="text"
                  placeholder="ชื่อประเทศ"
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