import { defineStore } from "pinia";
import apis from "@/core/album-apis";
import moment from "moment";
import "moment/dist/locale/th";

moment.locale("th");

interface iState {
  userID: Number;
  privilegeId: Number;
  departmentID: Number;
}
export const useOffice = defineStore("useOffice", {
  state: (): iState => ({
    privilegeId: 0,
    userID: 0,
    departmentID: 0,
  }),
  getters: {
  },
  actions: {
    
  },
});
