<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, inject, h, watch, toRaw } from "vue";
import { useDialog } from "primevue/usedialog";
import albumHead from "./albumHead.vue";

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

const modalDialog = useDialog();

const actions = () => {
  const ac = {
    onInit: async () => {
        // actions().loginViewShow();
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
      console.log("IN BUTTON");

      modalDialog.open( albumHead, {
        props: {
          closeOnEscape: false,
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
              h("div", { class: "header-dialog" }, [h("span", "เพิ่มเอกสาร")]),
            ];
          },
        },
        onClose: async (options) => {
          if (options?.data == true) {
              console.log("TEST CLOSE");
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
    }
  };
  return ac;
};

onMounted(async () => {

  // await actions().onInit();
});
  </script>
<template>
    <div>
        <header>
            <h1>My Photo Album</h1>
            <div>
              <Button @click="actions().onCreateAlbum()">สร้างอัลบั้ม</Button>
            </div>
        </header>
        
        <main>
        <div v-if="albums.length === 0">
            <p>No albums found. Please add some.</p>
        </div>
        <div v-else>
            <div v-for="album in albums" :key="album.id">
            <h2>{{ album.name }}</h2>
            <div class="album-photos">
                <img v-for="photo in album.photos" :key="photo.id" :src="photo.url" alt="Photo">
            </div>
            </div>
        </div>
        </main>
    </div>
  </template>
  
<style scoped lang="scss">
/* styles/main.scss */
.album-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.album-photos img {
  max-width: 200px;
  max-height: 200px;
}
  </style>
  