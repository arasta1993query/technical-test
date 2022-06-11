import { defineStore } from "pinia";
import {request} from "../composable/requests";

export const useStore = defineStore({
  id: "config",
  state: () => ({
    config: null,
    genres: null
  }),
  getters:{
    image_url() {
      return this.config.data?.data.images.base_url
    },
    getGenres() {
      return this.genres.data?.data.genres
    }
  },
  actions: {
    initial() {
      this.config = request('config')
      this.genres = request('genres')
    }
  },
});
