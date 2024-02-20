import { defineStore } from "pinia";
import apis from "@/core/album-apis";
import moment from "moment";
import "moment/dist/locale/th";
import type iAlbumProject from "@/interfaces/album-project";
import type iCountryList from "@/interfaces/countryList";
import type iCityList from "@/interfaces/cityList";

moment.locale("th");

interface iState {
  albumProject: iAlbumProject[];
  countryList: iCountryList[];
  cityList: iCityList[];
}
export const useAlbum = defineStore("useAlbum", {
  state: (): iState => ({
    albumProject : [],
    countryList: [],
    cityList: [],
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
    },
    async getFolderAlbum (countryName: String, cityName: String ) {
      this.albumProject = await apis.get("/albumview/getFolderAlbum")
        .params({ 
          countryNameValue: countryName, 
          cityNameValue: cityName 
        })
        .finish()
        .then((res) => {
          return res.data;
        });
    },
    async getCountryList () {
      this.countryList = await apis.get("/albumview/getCountryList")
        .finish()
        .then((res) => {
          return res.data;
        });
    },
    // async getCityList () {
    //   this.cityList = await apis.get("/albumview/getCityList")
    //     .finish()
    //     .then((res) => {
    //       return res.data;
    //     });
    // },

  },
});
