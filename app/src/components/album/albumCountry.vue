<script setup lang="ts">
import { onMounted, ref, inject, h, computed, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import { useAlbum } from "@/stores/album-store";

const dialogRef = inject("dialogRef") as any;
const confirm = useConfirm();
const toast = useToast();
const isReady = ref("WARN");
const countryName = ref("");
const myStore = useAlbum();

const actions = () => {
  const ac = {
    onInit: async () => {
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
      const resInsert = await myStore.createFolderCountry(countryName.value)
        .then(async (res) => {
          setTimeout(() => {

          }, 300);
          return res;
        });
      
      if(resInsert == true){
        toast.add({
            severity: `success`,
            summary: `Data Success`,
            detail: `เพิ่มเทมเพลท เรียบร้อยแล้ว`,
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
  };
  return ev;
};

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
                  <h4><i class="fa-solid fa-circle-check title-icon"></i>ข้อมูลประเทศ</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col pr-10">
            <div class="inputClean">
              <div class="input">
                <input type="text" autocomplete="off" v-model="countryName" />
                <div class="labelInput">
                  <label> ชื่อประเทศ </label>
                </div>
                <i class="asterisk fas fa-asterisk"></i>
              </div>
            </div>
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
          <Button label="เพิ่มประเทศ" class="w-180 p-button-sm p-button-rounded"
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
</style>
@/stores/album-store