import { defineStore } from "pinia";
import apis from "@/core/album-apis";
import moment from "moment";
import "moment/dist/locale/th";
import axios from "axios";
import type iAlbumProject from "@/interfaces/album-project";
import type iCountryList from "@/interfaces/country-list";
import type iCityList from "@/interfaces/cityList";
import type iAlbumSet from "@/interfaces/album-set";
import type iAlbumFile from "@/interfaces/album-photo";

const _BASE_URL = import.meta.env.VITE_BASE_URL_APIS;

moment.locale("th");

interface iState {
  albumProject: iAlbumProject[];
  countryList: iCountryList[];
  cityList: iCityList[];
  isDelayPage: boolean;
  isTimeOnDelay: number;
  albumSet: iAlbumSet[];
  albumFile: iAlbumFile[];
}
export const useAlbum = defineStore("useAlbum", {
  state: (): iState => ({
    albumProject : [],
    countryList: [],
    cityList: [],
    albumSet: [],
    albumFile: [],
    isDelayPage: false,
    isTimeOnDelay: 300,
  }),
  getters: {
    getDelayPage(state) {
      return state.isDelayPage;
    },
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
    async getCityList () {
      this.cityList = await apis.get("/albumview/getCityList")
        .finish()
        .then((res) => {
          console.log(res.data)
          return res.data;
        });
    },
    setWaitTimeDelayOnChangeRouter() {
      this.isDelayPage = true;
      setTimeout(() => {
        this.isDelayPage = false;
      }, this.isTimeOnDelay);
    },
    async createAlbumSet (albumName: String, countryName: String, cityName: String, albumSetName: String ) {
      const data = {
        albumName: albumName,
        countryName: countryName,
        cityName: cityName,
        albumSetName: albumSetName,
      };
      await apis.post("/albumview/createAlbumSet").data(data).finish();
      return true;
    },
    async getFolderAlbumSet (albumName: String, countryName: String, cityName: String ) {
      this.albumSet = await apis.get("/albumview/getFolderAlbumSet")
        .params({ 
          albumName: albumName,
          countryNameValue: countryName, 
          cityNameValue: cityName 
        })
        .finish()
        .then((res) => {
          return res.data;
        });
    },
    async uploadAlbumSet (albumName: String, countryName: String, cityName: String, albumSetName: String, obj: iAlbumFile[]) {
      this.albumFile = obj;
      if (this.albumFile.length) {
        const formData = new FormData();
        for (let i = 0; i < this.albumFile.length; i++) {
          if (this.albumFile[i].albumFileUpload) {
            formData.append('fileuploads', this.albumFile[i].albumFileUpload);
          }
        }
        axios.post(_BASE_URL + 'albumview/uploadAlbumSet', formData, {
          headers: { 'Content-Type': 'application/json' },
        }).then((o) => {
          console.log(o);
        }).catch((e) => {
          console.log(e);
        });

        const data = {
          albumName: albumName,
          countryName: countryName,
          cityName: cityName,
          albumSetName: albumSetName,
          fileAlbum : this.albumFile,
          fileUpload : formData,
        };
        await apis.post("/albumview/albumSetForUpload")
        .data(data)
        .finish();
        return true;
      }
    },
    async createFolderCountry (countryName: String) {
      const data = {
        countryName: countryName,
      };
      await apis.post("/albumview/createFolderCountry").data(data).finish();
      return true;
    },
    async createFolderCity (countryName: String, cityName:String) {
      const data = {
        countryName: countryName,
        cityName: cityName,
      };
      await apis.post("/albumview/createFolderCity").data(data).finish();
      return true;
    },

  },
});
