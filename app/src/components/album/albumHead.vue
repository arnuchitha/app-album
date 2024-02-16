<script setup lang="ts">
import { onMounted, ref, inject, h, computed, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

interface iCateSelected {
  pcCode: string;
  pcName: string;
}

const dialogRef = inject("dialogRef") as any;
const confirm = useConfirm();
const command = ref("");
const toast = useToast();

const selectItemDialog = useDialog();

const isReady = ref("WARN");
const isSubmit = ref(false);

const actions = () => {
  const ac = {
    onInit: async () => {
        console.log("dialog")
      if (dialogRef.value.data) {
        command.value = "detail";
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
    checkData: async () => {
      console.log("check")
    },
    cancle: () => {
      dialogRef.value.close(true);
    },
    create: async () => {
        let resInsert = true;
      if(resInsert){
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
    },
  };
  return ev;
};


const disabled = ref(true);
setTimeout(() => {
  if (command.value == "edit" || command.value == "create") {
    disabled.value = false;
  }
  return disabled.value;
}, 5000);

const switchStatus = (command: string) => {
  switch (command) {
    case "create":
      return "pointer-events-all";
    case "detail":
      return "pointer-events-none";
    default:
      return "pointer-events-all";
  }
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
  <div v-if="isReady == 'WARN'" class="animate__animated animate__fadeIn wait-wave">
    <main class="animated zoomIn">
      <div class="border-eff mt-3"></div>
      <div class="container-fluid">
        <div class="row row-style">
          <div class="col-3">
            <label>ประเภทหมวด</label>
          </div>
          <div class="col">
            <Skeleton class="mb-2" height="3rem"></Skeleton>
          </div>
        </div>
        <div class="row row-style">
          <div class="col-3">
            <div class="field-radiobutton">
              <label>ชื่อหมวดอัลบั้ม</label>
            </div>
          </div>
          <div class="col">
            <Skeleton class="mb-2" height="3rem"></Skeleton>
          </div>
        </div>
      </div>
      <div class="border-eff"></div>
    </main>
  </div>
  <main v-if="isReady == 'READY'" class="animate__animated animate__fadeIn wait-wave">
    <div class="row" v-if="command == 'edit' || command == 'create'">
      <div class="col-4">
      </div>
      <div class="col-7">
        <div class="row" style="margin-top: -60px !important">
          <div class="col">
          </div>
          <div class="col pl-10">
            <div class="inputClean">
              <div class="input select-pi">
                <div class="labelInput">
                  <label> ประเภทหมวด </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-4">
      </div>
      <div class="col-7">
        <div class="row" style="margin-top: -60px !important">
          <div class="col pr-10">
          </div>
          <div class="col pl-10">
            <div class="box-data">
              <div class="label"><label class="label-bold">แผนก</label></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="border-eff mt-3"></div>
    <div class="container-fluid" v-if="command == 'create'">
      <div class="app-card-template">
        <div class="row row-style">
          <div class="col-3 table-document">
            <div class="box-title-sub">
              <div class="row">
                <div class="col">
                  <h4><i class="fa-solid fa-circle-check title-icon"></i>ข้อมูลหมวดอัลบั้ม</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col pr-10">
            <div class="inputClean">
              <div class="input">
                <input type="text" autocomplete="off" />
                <div class="labelInput">
                  <label> ชื่อหมวดอัลบั้ม </label>
                </div>
                <i class="asterisk fas fa-asterisk"></i>
              </div>
            </div>
          </div>
          <!-- <div class="col pl-10">
            <div class="inputClean">
              <div class="input">
                <input type="text" autocomplete="off" />
                <div class="labelInput">
                  <label> คำอธิบาย </label>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="border-eff"></div>
    <div class="buttonStyle">
      <div class="row pr-10">
        <div class="col">
        </div>
        <div class="col-auto pr-10 pl-10">
          <Button label="เพิ่มหมวดอัลบั้ม" v-if="command == 'create'" class="w-180 p-button-sm p-button-rounded"
            @click="events().checkData()" icon="fa-sharp fa-solid fa-circle-check" :disabled="isSubmit" />
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

.ml-10 {
  margin-left: 10px;
}

.icon-size-2rem {
  font-size: 2rem !important;
}

.icon-size-1-5rem {
  font-size: 1.5rem !important;
}

.box-data {
  position: relative;

  .box-value {
    color: var(--input-style-color);
    padding: 30px 14px 6px 12px;
    outline: none;
    width: 100%;
    height: 60px;
    font-size: 16px;
    background: var(--bg-preveiw);
    border-radius: 0.5rem;
    border: 1px solid transparent;
    font-family: 'Kanit', sans-serif !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .label {
    position: absolute;
    top: 8px;
    left: 14px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    label {
      color: var(--inactive-color);
      white-space: nowrap;
      font-size: 14px;
      margin-top: 2px;
      margin-right: 5px;
    }
  }
}

.input-invalid {
  border: 1px solid #f1502f !important;
  color: #f1502f !important;
}

.row .min-height-36 {
  min-height: 36px;
}

.class-menu-left {
  padding: 15px;
  margin: 0;
  color: var(--theme-color);
  cursor: pointer;
  border-left: 3px solid transparent;
}

.set-top-0 {
  margin-top: 0 !important;
}

.class-menu-left label {
  color: var(--inactive-color);
  cursor: pointer;
}

.class-menu-left.isActive label {
  color: var(--theme-color) !important;
  cursor: pointer;
}

.class-menu-left:hover {
  background-color: var(--content-bg) !important;
}

.class-menu-left.isActive {
  border-left: 3px solid var(--ico-color-tab-active);
}

.tabSet {
  padding: 20px 10px 20px 20px;
}

.tabSelected {
  padding: 20px 10px 20px 20px;
  border-radius: 5px !important;
  background-color: var(--content-bg) !important;
}

.rowActive {
  color: #00ff14;
  font-size: larger;
  margin-top: 5px;
  margin-left: 160px;
  position: absolute;
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

.w-150 {
  width: 150px !important;
}

.field-radiobutton {
  height: 32px;
}

.p-button {
  border: none !important;
}

.styleEmail {
  color: #f1502f;
}

.uppercase {
  text-transform: uppercase;
}

.background-color-edit:hover {
  background: #3f9cff;
  color: #ffffff;
  border-color: #3f9cff;
}

.background-color-edit {
  background-color: #3f9cff;
}

.background-color-delete:hover {
  background: #ff3f4f;
  color: #ffffff;
  border-color: #ff3f4f;
}

.background-color-delete {
  background-color: #ff3f4f;
}

.pointer-events-all {
  pointer-events: all !important;
}

.pointer-events-none {
  pointer-events: none !important;
}

.pr-20 {
  padding-right: 20px;
}

.pr-10 {
  padding-right: 10px;
}

.pr-6 {
  padding-right: 6px;
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

.margin-auto {
  margin: auto !important;
}

.text-align-center {
  text-align: center;
}

.text-align-end {
  text-align: end;
}

.buttonStyle {
  text-align: end;
  margin: 15px;
}

.col-6 {
  padding: 10px;
}

.center {
  text-align: center;
}

.template-detail {
  .box-sm-infomsg {
    text-align: left;
    min-width: 10rem;

    hr {
      border-top: 1px solid #dadbe6 !important;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      border: 0;
    }

    .content-msg {
      font-weight: 500;
    }
  }

  .alertDiscountMessage {
    position: absolute;
    top: 50px;
    background: #fff1ee;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 4px;
    padding: 10px;
    min-width: 100%;
    z-index: 99;
    -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
    color: #f1502f;
    font-size: 14px;
    font-family: "Kanit", sans-serif !important;
  }

  .input-invalid {
    border: 1px solid #f1502f !important;
    color: #f1502f !important;
    /* background: #fff1ee; */
  }

  .text-invalid {
    color: #f1502f !important;
  }

  .percent {
    position: absolute;
    right: 5px;
    top: 50%;
    margin-top: -12px;
    z-index: 100;
  }

  .label-bold {
    font-weight: bold;

    .iconLock {
      font-size: 12px;
      padding-right: 3px;
      color: var(--inactive-color);
    }
  }

  .iconLock {
    font-size: 12px;
    padding-right: 3px;
    color: #6c757db8;
  }

  .inputDiscount {
    //display: none;
    position: relative;

    .discountOption {
      font-size: 14px;
      position: absolute;
      padding: 5px;
      background: var(--input-bg-hover);
      color: var(--theme-color) !important;
      border: 1px solid var(--input-bd-hover);
      -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
      z-index: 2;
      border-radius: 4px;
      width: 100%;

      p {
        font-weight: bold;
        margin: 5px 0;
      }

      .field-radiobutton {
        padding-top: 5px;
        padding-bottom: 5px;
      }

      label {
        margin-left: 5px;
      }
    }
  }

  .block-description {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: center;
    justify-content: end;
    -webkit-box-align: end;
    -ms-flex-align: center;
    align-items: center;

    .btn-insert-spec {
      width: 30px;
      cursor: pointer;
    }
  }

  .mute-td {
    background: var(--input-bg-hover);
    color: var(--theme-color) !important;
    border: 1px solid var(--input-bd-hover);
  }

  .input-spec {
    color: #3297ff;
  }

  .pr-20 {
    padding-right: 20px !important;
  }

  // ส่วน header
  .headerTable {
    border-collapse: collapse;

    /* background-color: #ffffffc2; */
    thead {
      tr {
        height: 50px;

        th {
          .header-div {
            color: var(--inactive-color);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;

            .iconTooltip {
              /*color: #dadbe6; */
              color: #878787;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              padding-left: 5px;
              -webkit-transition: color 0.5s ease-out;
              -moz-transition: color 0.5s ease-out;
              -o-transition: color 0.5s ease-out;
              transition: color 0.5s ease-out;
            }

            .iconTooltip:hover {
              color: #3297ff;
            }

            .tooltip {
              position: relative;
            }

            .info-position-r {
              right: 120%;
            }

            i {
              cursor: pointer;
              font-size: 14px;
            }

            p {
              font-size: 14px;
              margin-right: 5px;
              -webkit-transition: 0.5s;
              transition: 0.5s;
              margin: 0;
            }
          }

          .header-position {
            justify-content: end;
          }

          .header-position-center {
            justify-content: center;
          }
        }
      }
    }

    tbody {
      tr {

        td {
          vertical-align: middle;
          width: 30px;
          //border: 1px solid #dadbe6;
          padding: 0;
          -ms-flex-align: center;
          align-items: center;
        }


        td:first-child {
          padding: unset;
          border: 0 solid #dadbe6 !important;
        }


        td:last-child {
          padding: unset;
          vertical-align: middle;
          text-align: center;
          width: 30px;
          border: 0 solid;
          //border: 0 solid #dadbe6 !important;
        }

        td:first-child>div {
          background-color: var(--table-bg);
          border: none;
          color: var(--theme-color) !important;
          height: 100%;
          //border: 0.5px solid #dadbe6;
          border-right: 0;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          position: relative;
        }

        td:last-child>div {
          background-color: var(--table-bg);
          border: none;
          color: var(--theme-color) !important;
          height: 100%;
          //border: 0.5px solid #dadbe6;
          border-left: 0;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
      }
    }
  }

  .box-btn-add {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 20px;
  }

  // ส่วน body
  tbody {
    tr {
      td {
        .block-seq {
          margin: 0;
          padding: 0;
          padding-top: 11px;
          padding-bottom: 12px;
        }

        .block-hashtag {
          margin: 0;
          padding: 0;
          padding-top: 15px;
          padding-bottom: 15px;
        }

        .block-delete {
          margin: 0;
          padding: 0;
          padding-top: 11px;
          padding-bottom: 12px;
        }

        .block-td {
          height: 48px;

          .p-focus {
            box-shadow: 0 0 0 0.02rem #3297ff !important;
          }

          input:focus {
            border: 1px solid #3297ff;
          }

          textarea:focus {
            border: 1px solid #3297ff;
          }

          .inp-qty {
            text-align: center;
          }

          input .input-number {
            text-align: right !important;
          }

          input {
            font-size: 16px;
            font-family: "Kanit", sans-serif !important;
            border-radius: 0;
            padding: 5px 10px;
            outline: none;
            width: 100%;
            transition: all 0.5s ease !important;
            height: 48px;
            color: var(--theme-color);
            border: none;
          }

          textarea {
            display: block;
            resize: none;
            font-size: 16px;
            padding: 5px 10px;
            width: 100%;
            height: 48px;
            -webkit-transition: .5s;
            transition: all 0.5s ease !important;
            color: var(--theme-color) !important;
            border: none;
            font-family: "Kanit", sans-serif !important;
            overflow: auto;
          }

          .p-description {
            height: 100%;
            color: var(--theme-color) !important;
            border: none;
            //border: 1px solid var(--input-bd-hover);
          }

          .block-befor-vat {
            font-size: 16px;
            font-family: "Kanit", sans-serif !important;
            height: 100%;
            border-radius: 0;
            border: none;
            color: var(--theme-color) !important;
            padding: 5px 10px;
            outline: none;
            width: 100%;
            transition: all 0.5s ease !important;
            margin: 0;
            text-align: right;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: end;
            -ms-flex-pack: center;
            justify-content: end;
            -webkit-box-align: end;
            -ms-flex-align: center;
            align-items: center;
          }

          .select-td {
            border: none !important;
            width: 100% !important;
            border-radius: 1px;
            height: 48px;

            div:focus {
              border: 1px solid #3297ff;
            }

          }

          .dialog-delete {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.row-style {
  margin: 10px;
  margin-top: 20px;
  margin-bottom: 20px;

  h4 {
    margin: 0;
  }
}</style>
