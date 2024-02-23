<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { ref, watch, computed } from "vue";
import { useAlbum } from "@/stores/album-store";
import type iAlbumFile from "@/interfaces/album-photo"

const fileURL = import.meta.env.VITE_FILE_URL + "po_files/";
const toast = useToast();
const files = ref();
const countFilesSelected = ref(0);
const totalSize = ref(0);
const totalSizePercent = ref(0);
const mainStore = useAlbum();

const props = defineProps<{
    model: iAlbumFile[];
}>();
const fileModel = ref(props.model);
const emit = defineEmits(["update:model"]);

watch(props, (currentValue) => {
    fileModel.value = currentValue.model;
});

const updateValue = (model: iAlbumFile[]) => {
    emit("update:model", model);
};

watch(fileModel, (currentValue) => {
    updateValue(currentValue);
});

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

const onSelectedFiles = (event: any) => {
    // if (countFilesSelected.value < event.files.length) {
    //     const countAddFiles = event.files.length - countFilesSelected.value;
    //     for (var i = 1; i <= countAddFiles; i++) {
    //         let lastFile = event.files[event.files.length - i];
    //         if (lastFile.size > 5000000) {
    //             toast.add({
    //                 severity: "warn",
    //                 summary: "File size limit",
    //                 detail: "ไฟล์มีขนาดใหญ่เกิน 5Mb.",
    //                 life: 3000,
    //             });
    //             event.files.pop();
    //             return;
    //         } else {
    //             let strArray = lastFile.name.split(".");
    //             let setFileType = strArray[strArray.length - 1];
    //             let setFileName = "u" + mainStore.userID + "-po-file-" + i + "-" + new Date().getTime() + "." + setFileType;
    //             let finalLastFile = new File([lastFile], setFileName, { type: lastFile.type });
    //             if (finalLastFile) {
    //                 event.files[event.files.length - i] = finalLastFile;
    //                 files.value = event.files;
    //                 let fileSET = {
    //                     appoFileID: 0,
    //                     appoFileName: setFileName,
    //                     appoFileType: lastFile.type,
    //                     appoFileSize: lastFile.size,
    //                     appoID: 0,
    //                     createBy: 0,
    //                     createDate: new Date,
    //                     updateBy: 0,
    //                     updateDate: new Date,
    //                     isDeleted: 0,
    //                     isVisible: 1,
    //                     appoFileUpload: event.files[event.files.length - i],
    //                 }
    //                 fileModel.value.push(fileSET);
    //             }
    //         }
    //     }
    //     if (countAddFiles) {
    //         countFilesSelected.value = event.files.length;
    //     }
    // }

}

const onRemoveTemplatingFile = (file: any, removeFileCallback: Function, index: number) => {
    fileModel.value = fileModel.value.filter(fm => fm.albumFileName != file.name);
    countFilesSelected.value = countFilesSelected.value - 1;
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
}

const onRemoveFile = (id: number) => {
    fileModel.value = fileModel.value.map(fm => {
        if (fm.albumFileID == id) {
            fm.isVisible = 0;
        }
        return fm;
    });
}

const onRemoveFileAll = () => {
    fileModel.value = fileModel.value.map(fm => {
        fm.isVisible = 0;
        return fm;
    });
}

const fileShow = computed(() => {
    return fileModel.value.filter(fm => fm.isVisible == 1 && fm.albumFileID > 0)
});

const checkTypeFile = (str: string) => {
    if (str == 'image/jpeg' || str == 'image/jpg' || str == 'image/png' || str == 'image/gif') {
        return true;
    } else {
        return false;
    }
}
</script>
<template>
    <Toast />
    <FileUpload name="demo[]" :multiple="true" @select="onSelectedFiles">
        <template #header="{ chooseCallback, clearCallback, files }">
            <div class="row mt-0 mb-4">
                <div class="col"></div>
                <div class="col-auto">
                    <button @click="chooseCallback()" class="btn-save p-button p-component p-button-sm p-button-rounded w-150 mt-4" type="button">
                        <span class="p-button-label"><i class="pi pi-upload px-2"></i>เลือกไฟล์</span>
                    </button>
                </div>
                <div class="col-auto">
                    <button @click="clearCallback(), onRemoveFileAll()" :disabled="fileShow.length == 0 && files.length ==0" class="btn-cancel p-button p-component p-button-sm p-button-rounded p-button-danger w-150 mt-4" type="button">
                        <span class="p-button-label"><i class="pi pi-undo px-2"></i>ลบไฟล์ทั้งหมด</span>
                    </button>
                </div>
            </div>
        </template>
        <template #content="{ files, removeFileCallback }" >
            <div v-if="fileShow.length > 0">
                <div v-for="(fileOld, index) of fileShow" :key="index" class="card m-0 px-6">
                    <div class="row row-border-bottom">
                        <div class="col-1">
                            <img :src="fileURL + '/icon-file.png'" class="m-2 cursor-pointer"
                                v-if="!checkTypeFile(fileOld.albumFileType)" height="50">
                            <img :src="fileURL + fileOld.albumFileName" class="m-2 cursor-pointer"
                                v-if="checkTypeFile(fileOld.albumFileType)" height="50">
                        </div>
                        <div class="col-2 pt-3">
                            <div class="fc-green"><b>ขนาดไฟล์ :</b> {{ formatSize(fileOld.albumFileSize) }}</div>
                        </div>
                        <div class="col pt-3">
                            <div class="fc-green"><b>ชื่อไฟล์ :</b> {{ fileOld.albumFileName }}</div>
                        </div>
                        <div class="col-2 align-items-right">
                            <Button icon="pi pi-times" v-tooltip.top="'ลบไฟล์'" @click="onRemoveFile(fileOld.albumFileID)"
                                class="p-button-outlined p-button-danger p-button-rounded" />
                        </div>
                    </div>
                </div>
            </div>
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
            <!-- <div class="align-items-center">
                <div class="row my-4">
                    <div class="col">
                        <i class="pi pi-cloud-upload p-2 fs-60 fc-green" />
                        <p class="mt-2 mb-0 fc-green font-kanit">ลากไฟล์ลง ที่นี่ เพื่ออัพโหลด</p>
                    </div>
                </div>
            </div>     -->
        </template>
    </FileUpload>
</template>
<style lang="scss" scoped>
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