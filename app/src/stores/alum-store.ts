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
export const useAlbum = defineStore("useAlbum", {
  state: (): iState => ({
    privilegeId: 0,
    userID: 0,
    departmentID: 0,
  }),
  getters: {
  },
  actions: {
    async createFolder (albumName: String, countryName: String, cityName: String ) {
      const data = {
        albumName: albumName,
        countryName: countryName,
        cityName: cityName,
      };
      await apis.post("/albumview/createFolder").data(data).finish();
      return true;
    }
  },
});
