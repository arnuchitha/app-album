<script setup lang="ts">
import { onMounted, ref, inject, h, computed, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";
import type iAlbumFile from "@/interfaces/album-photo";

const dialogRef = inject("dialogRef") as any;
const toast = useToast();
const isReady = ref("WARN");
const albumName = ref("");
const albumSetName = ref("");
const countryName = ref("");
const cityName = ref("");
const myStore = useAlbum();
const cModel = ref([] as iAlbumFile [])
const countFilesSelected = ref(0);
const files = ref();

const actions = () => {
  const ac = {
    onInit: async () => {
      if (dialogRef.value.data) {
        albumName.value = dialogRef.value.data.albumName;
        countryName.value = dialogRef.value.data.countryName;
        cityName.value = dialogRef.value.data.cityName;
        albumSetName.value = dialogRef.value.data.albumSetName;
        
      }
      setTimeout(() => {
        isReady.value = "READY";
      }, 300);
    },
  };
  return ac;
};

const events = () => {
  const ev = {
    cancle: () => {
      dialogRef.value.close(true);
    },
    create: async () => {
      const resInsert = await myStore.uploadAlbumSet(albumName.value, countryName.value, cityName.value, albumSetName.value, cModel.value)
        .then(async (res) => {
          setTimeout(() => {

          }, 300);
          return res;
        });
      
      if(resInsert == true){
        toast.add({
            severity: `success`,
            summary: `Data Success`,
            detail: `เพิ่มรูปภาพ เรียบร้อยแล้ว`,
            life: 2000,
        });
        dialogRef.value.close(resInsert);
      }else{
        toast.add({
            severity: `error`,
            summary: `Data Error`,
            detail: `พบปัญหาการบันทึกข้อมูล`,
            life: 2000,
        });
      }
      setTimeout(() => {
        dialogRef.value.close(resInsert);
      }, 300);
    },
    onSelectedFiles: (event: any) => {
    if (countFilesSelected.value < event.files.length) {
        const countAddFiles = event.files.length - countFilesSelected.value;
        for (var i = 1; i <= countAddFiles; i++) {
            let lastFile = event.files[event.files.length - i];
            if (lastFile.size > 5000000) {
                toast.add({
                    severity: "warn",
                    summary: "File size limit",
                    detail: "ไฟล์มีขนาดใหญ่เกิน 5Mb.",
                    life: 3000,
                });
                event.files.pop();
                return;
            } else {
                let finalLastFile = new File([lastFile], lastFile.name, { type: lastFile.type });
                if (finalLastFile) {
                    event.files[event.files.length - i] = finalLastFile;
                    files.value = event.files;
                    let fileSET = {
                        albumFileName: lastFile.name,
                        albumFileType: lastFile.type,
                        albumFileSize: lastFile.size,
                        albumFileUpload: event.files[event.files.length - i],
                        albumFilePath : "",  
                    }
                    cModel.value.push(fileSET);
                }
            }
        }
        if (countAddFiles) {
            countFilesSelected.value = event.files.length;
        }
    }

    }
  };
  return ev;
};

const formatSize = (bytes: any) => {
    if (bytes === 0) {
        return '0 B';
    }
    let k = 1000, dm = 3, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const objUrl = (o: any) => {
    return URL.createObjectURL(o);
}

const checkTypeFile = (str: string) => {
    if (str == 'image/jpeg' || str == 'image/jpg' || str == 'image/png' || str == 'image/gif') {
        return true;
    } else {
        return false;
    }
}

const onRemoveTemplatingFile = (file: any, removeFileCallback: Function, index: number) => {
    cModel.value = cModel.value.filter(fm => fm.albumFileName != file.name);
    countFilesSelected.value = countFilesSelected.value - 1;
    removeFileCallback(index);
}

onMounted(async () => {
  await actions()
    .onInit()
    .catch(() => {
      isReady.value = "ERROR";
    });
});

</script>
<template>
  <main v-if="isReady == 'READY'" class="animate__animated animate__fadeIn wait-wave">
    <div class="row">
      <div class="col-4">
      </div>
      <div class="col-7">
        <div class="row" style="margin-top: -60px !important">
          <div class="col">
          </div>
          <div class="col pl-10">
            <div class="inputClean">
              <div class="input select-pi">
                <div class="inputClean">
                  <div class="input data-disable">
                    <input type="text" autocomplete="off" v-model="albumName" />
                    <div class="labelInput">
                      <label> ชื่อหมวดอัลบั้ม </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="border-eff mt-3"></div>
    <div class="container-fluid">
      <div class="app-card-template">
        <div class="row row-style">
          <div class="col-3 table-document">
            <div class="box-title-sub">
              <div class="row">
                <div class="col">
                  <h4><i class="fa-solid fa-circle-check title-icon"></i>ข้อมูลอัลบั้ม</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col pr-10">
            <div class="inputClean">
              <div class="input data-disable">
                <input type="text" autocomplete="off" v-model="albumSetName" />
                <div class="labelInput">
                  <label> ชื่ออัลบั้ม </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col pl-10">
            <div class="inputClean">
              <div class="input data-disable">
                <input type="text" autocomplete="off" v-model="countryName" />
                <div class="labelInput">
                  <label> ประเทศ </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col pl-10">
            <div class="inputClean">
              <div class="input data-disable">
                <input type="text" autocomplete="off" v-model="cityName" />
                <div class="labelInput">
                  <label> เมือง </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-eff mt-3 mb-0"></div>
        <div class="row">
          <div class="col-12">
            <div class="box-title-sub"><h4><i class="fa-solid fa-circle-check title-icon"></i> ไฟล์แนบ</h4></div>
          </div>
          <div class="col-12 height-bottom">

            <FileUpload name="demo[]" url="/api/upload" :multiple="true" @select="events().onSelectedFiles">
              <template #header="{ chooseCallback, clearCallback, files }">
                  <div class="row mt-0 mb-4">
                      <div class="col"></div>
                      <div class="col-auto">
                          <button @click="chooseCallback()" class="btn-save p-button p-component p-button-sm p-button-rounded w-150 mt-4" type="button">
                              <span class="p-button-label"><i class="pi pi-upload px-2"></i>เลือกไฟล์</span>
                          </button>
                      </div>
                      <div class="col-auto">
                          <button @click="clearCallback()" :disabled="files.length ==0" class="btn-cancel p-button p-component p-button-sm p-button-rounded p-button-danger w-150 mt-4" type="button">
                              <span class="p-button-label"><i class="pi pi-undo px-2"></i>ลบไฟล์ทั้งหมด</span>
                          </button>
                      </div>
                  </div>
              </template>
              <template #content="{ files, removeFileCallback }" >
                  <div v-if="files.length > 0">
                      <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6">
                          <div class="row row-border-bottom">
                              <div class="col-1">
                                  <img role="presentation" :alt="file.name" :src="objUrl(file)" height="50" class="m-2 shadow-2"
                                      v-if="checkTypeFile(file.type)" />
                                  <img src="../../assets/images/icon-file.png" class="m-2" v-if="!checkTypeFile(file.type)"
                                      height="50">
                              </div>
                              <div class="col-2 pt-3">
                                  <div class="fc-green"><b>ขนาดไฟล์ :</b> {{ formatSize(file.size) }}</div>
                              </div>
                              <div class="col pt-3">
                                  <div class="fc-green"><b>ชื่อไฟล์ :</b> {{ file.name }}</div>
                              </div>
                              <div class="col-2 align-items-right">
                                  <Button icon="pi pi-times" v-tooltip.top="'ลบไฟล์'"
                                      @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                      class="p-button-outlined p-button-danger p-button-rounded" />
                              </div>
                          </div>
                      </div>
                  </div> 
                  <div class="align-items-center">
                      <div class="row my-4">
                          <div class="col">
                              <i class="pi pi-cloud-upload p-2 fs-60 fc-green" />
                              <p class="mt-2 mb-0 fc-green font-kanit">ลากไฟล์ลง ที่นี่ เพื่ออัพโหลด</p>
                          </div>
                      </div>
                  </div>    
              </template>
          </FileUpload>
          </div>
        </div>
      </div>
    </div>
    <div class="border-eff"></div>
    <div class="buttonStyle">
      <div class="row pr-10">
        <div class="col">
        </div>
        <div class="col-auto pr-10 pl-10">
          <Button label="เพิ่มรูปภาพ" class="w-180 p-button-sm p-button-rounded"
            @click="events().create()" icon="fa-sharp fa-solid fa-circle-check" />
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped lang="scss">
.row.set-group {
  background-color: var(--table-bg);
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.table-document .table-class tbody tr td input.input-number {
  text-align: right;
}

.table-document .table-class tbody tr td:first-child {
  border-top-left-radius: unset !important;
  border-bottom-left-radius: unset !important;
}

.table-document .table-class tbody tr td:last-child {
  border-top-right-radius: unset !important;
  border-bottom-right-radius: unset !important;
}

.input.select-pi.div-disabled .p-multiselect {
  background: var(--bg-preveiw) !important;
}

.row .min-height-36 {
  min-height: 36px;
}

.app-card-template {
  max-height: 74vh;
  flex-direction: column;
  overflow: auto;
  position: relative;
  width: 100%;
  transition: 0.5s ease-in-out;
}

:global(.p-dialog) {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  margin-bottom: 200px !important;
  max-height: 100% !important;
  transform: scale(1);
}

:global(.p-dropdown-panel .p-dropdown-header) {
  color: var(--theme-color) !important;
  background: transparent;
  font-family: "Kanit", sans-serif !important;
  border-bottom: unset;
}

:global(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled).p-focus) {
  background: rgba(233, 236, 239, 0.368627451) !important;
}

:global(.p-component) {
  font-family: "Kanit", sans-serif !important;
}

:global(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  color: #495057;
  background: #979797;
}

:global(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  margin: 0;
  padding: 0.75rem 1.25rem;
  border: 0 none;
  color: var(--theme-color) !important;
  background: transparent;
  transition: box-shadow 0.2s;
  border-radius: 0;
}

:global(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
  color: var(--theme-color) !important;
  background: #e9ecef5e !important;
}

:global(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  color: var(--theme-color) !important;
  background: #e9ecef5e;
}

:global(.p-dropdown-panel) {
  background: unset !important;
  color: unset;
  border: 0 none;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background-color: var(--bg-dialog);
  color: var(--theme-color) !important;
  backdrop-filter: blur(40px) saturate(180%) !important;
  border: 0 none !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%) !important;
}

:global(.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled).p-focus) {
  background: rgba(233, 236, 239, 0.368627451) !important;
}

:global(.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled):hover) {
  color: #495057;
  background: #979797;
}

:global(.p-multiselect-panel .p-multiselect-items .p-multiselect-item) {
  margin: 0;
  padding: 0.75rem 1.25rem;
  border: 0 none;
  color: var(--theme-color) !important;
  background: transparent;
  transition: box-shadow 0.2s;
  border-radius: 0;
}

:global(.p-multiselect-panel .p-multiselect-items .p-multiselect-item.p-highlight) {
  color: var(--theme-color) !important;
  background: #e9ecef5e !important;
}

:global(.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled):hover) {
  color: var(--theme-color) !important;
  background: #e9ecef5e;
}

:global(.p-multiselect-panel) {
  background: unset !important;
  color: unset;
  border: 0 none;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background-color: var(--bg-dialog);
  color: var(--theme-color) !important;
  backdrop-filter: blur(40px) saturate(180%) !important;
  border: 0 none !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%) !important;
}

:global(.p-multiselect-header) {
  background: unset !important;
  color: unset;
  border: 0 none;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background-color: var(--bg-dialog);
  color: var(--theme-color) !important;
  backdrop-filter: blur(40px) saturate(180%) !important;
  border: 0 none !important;
  border-radius: 6px !important;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%) !important;
}

:global(.p-multiselect-header::before) {
  position: absolute;
  padding-left: 30px;
  content: "เลือกทั้งหมด";
}

.w-180 {
  width: 180px !important;
}

.pr-10 {
  padding-right: 10px;
}

.pl-10 {
  padding-left: 10px;
  padding-right: 10px;
}

.asterisk {
  font-size: 12px;
  color: #f1502f;
  position: absolute;
  right: 100px;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
}

.row {
  --bs-gutter-x: 0 !important;
}

.buttonStyle {
  text-align: end;
  margin: 15px;
}
.row-style {
  margin: 10px;
  margin-top: 20px;
  margin-bottom: 20px;

  h4 {
    margin: 0;
  }
}
.height-bottom {
  height: 25rem;;
}
.box-title-sub{
  h4 {
    color: var(--inactive-color);
    .title-icon {
      padding-right: 5px;
      color: var(--ico-color-tab-active);        
    }

  }
}
.data-disable {
    pointer-events: none;
    opacity: 0.5;
}

.mt-70 {
    margin-top: -70px !important;
    margin-bottom: 20px !important;
}

.w-150 {
    width: 150px;
}

.row-border-top {
    border-top: 1px solid var(--dlg-bd-color) !important;
    padding-top: 10px;
}

.row-border-bottom {
    border-bottom: 1px solid var(--dlg-bd-color) !important;
    padding-top: 10px;
}

:global(.custom-progress-bar) {
    .p-progressbar-value {
        background-color: #f44336;
    }
}

:global(.p-fileupload .p-fileupload-buttonbar) {
    background: unset !important;
    padding: unset !important;
    border: unset !important;
}

:global(.p-fileupload .p-fileupload-content) {
    background: unset !important;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    padding: 15px 15px 10px 15px !important;
    border: 1px solid var(--dlg-bd-color) !important;
    color: var(--inactive-color);
}

:global(.p-fileupload .p-progressbar) {
    height: 0.5rem !important;
}

:global(.p-fileupload-content) {
    padding: 0rem !important;
}

.align-items-center {
    text-align: center !important;
}

.align-items-right {
    text-align: right !important;
}

.fs-60 {
    font-size: 60px;
}

.fc-green {
    color: var(--inactive-color);
}

.font-kanit {
    font-family: "Kanit", sans-serif !important;
}
</style>