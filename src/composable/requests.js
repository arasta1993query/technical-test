import axios from "axios";
import { ref, unref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "../router";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 1000,
  params: {
    api_key: "f62f750b70a8ef11dad44670cfb6aa57",
  },
});

const requests = {
  get: {
    url: "/discover/movie",
    method: "get",
  },
  config: {
    url: "/configuration",
    method: "get",
  },
  genres: {
    url: "/genre/movie/list",
    method: "get",
  },
  movie: {
    url: "/movie/{movie_id}",
    method: "get",
  },
  credit: {
    url: "/movie/{movie_id}/credits",
    method: "get",
  },
};

export function request(name, watchRoute) {
  const data = ref(null);
  const error = ref(null);
  const route = useRoute();
  let params = route.query;
  const variable = route.params;

  const call = () => {
    const config = { ...requests[name], params };
    if (variable && variable.id && variable.id.length > 0) {
      config.url = config.url.replace("{movie_id}", variable.id);
      console.log(config.url);
    }
    instance
      .request(config)
      .then((res) => {
        data.value = res;
      })
      .catch((err) => {
        error.value = err;
        if (watchRoute) {
          router.back();
        }
      });
  };
  call();
  if (watchRoute) {
    watch(route, () => {
      params = route.query;
      call();
    });
  }

  return { data, error };
}
