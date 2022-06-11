<script setup>
import { request } from "../../composable/requests";
import { useRouter } from "vue-router";
import { useStore } from "../../stores";
import { computed } from "vue";
const router = useRouter();
const store = useStore();

const back = () => {
  router.back();
};

let { data, error } = request("movie", true);
let { data: creditData, error: creditError } = request("credit", true);
const item = computed(() => {
  return data?.value?.data;
});
const casts = computed(() => {
  const length = creditData?.value?.data.cast?.length;
  const temp = creditData?.value?.data.cast;
  temp.sort((a, b) => {
    return b.popularity - a.popularity;
  });
  return {
    cast: temp.slice(0, 10),
    more: length - 10,
  };
});

const fixNumber = (number) => {
  return (+number || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
};

const budget = computed(() => {
  return fixNumber(item.value.budget);
});
const revenue = computed(() => {
  return fixNumber(item.value.revenue);
});

const runtime = computed(() => {
  return `${Math.floor(item.value.runtime / 60)}h ${item.value.runtime % 60}m`;
});
</script>

<template>
  <div class="container mx-auto pb-[90px]" v-if="item">
    <div class="bg-[#E2E2E2] py-6 px-20 rounded-[6px] flex items-center mb-20">
      <button
        @click="back"
        class="text-white flex mr-16 items-center rounded-full bg-[#549DF2] py-2 px-3 hover:bg-[#549DF2AA] focus:outline-none focus:ring focus:ring-[#549DF2]"
      >
        <svg
          class="mr-2"
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 5.33331L2.60929 5.33331L6.18529 1.75731C6.44562 1.49698 6.44562 1.07481 6.18546 0.814648C5.92512 0.554315 5.50279 0.554315 5.24246 0.814648L0.528624 5.52865C0.497623 5.55965 0.469958 5.59381 0.445625 5.63015C0.434459 5.64698 0.426624 5.66515 0.416958 5.68265C0.405957 5.70331 0.393291 5.72298 0.384458 5.74481C0.374958 5.76731 0.369625 5.79065 0.362958 5.81398C0.357458 5.83248 0.350291 5.85015 0.346458 5.86915C0.337791 5.91248 0.333291 5.95615 0.333291 5.99998C0.333291 6.00048 0.333458 6.00098 0.333458 6.00148C0.333624 6.04465 0.337958 6.08798 0.346458 6.13048C0.350458 6.15048 0.357958 6.16898 0.363791 6.18865C0.370291 6.21081 0.375291 6.23331 0.384291 6.25481C0.393958 6.27798 0.406958 6.29898 0.418958 6.32081C0.427958 6.33715 0.435123 6.35381 0.445457 6.36948C0.46979 6.40631 0.497791 6.44065 0.528958 6.47181L5.24263 11.1853C5.50296 11.4456 5.92512 11.4456 6.18546 11.1855C6.44579 10.9251 6.44579 10.503 6.18546 10.2425L2.60946 6.66665L13 6.66665C13.3681 6.66665 13.6666 6.36815 13.6666 5.99998C13.6666 5.63181 13.3681 5.33331 13 5.33331Z"
            fill="white"
          />
        </svg>

        Back
      </button>
      <div>
        <p class="text-base font-bold whitespace-normal">
          {{ item.title }}
        </p>
        <p>{{ item.tagline }}</p>
      </div>
    </div>
    <div class="flex mb-14">
      <div class="w-[32%] relative pb-[48%] mr-9">
        <img
          :src="store.image_url + 'original' + item.poster_path"
          alt=""
          class="absolute rounded-xl"
        />
      </div>
      <div class="ml-9 grow">
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Budget</p>
          <span class="text-[#151515]">${{ budget }}</span>
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Revenue</p>
          <span class="text-[#151515]">${{ revenue }}</span>
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Release Date</p>
          <span class="text-[#151515]">{{ item.release_date }}</span>
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Runtime</p>
          <span class="text-[#151515]">{{ runtime }}</span>
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Score</p>
          <div>
            <span class="text-[#151515]">{{ item.vote_average }}</span>
            <span class="text-[#151515] text-sm ml-1"
              >({{ item.vote_count }} votes)</span
            >
          </div>
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">IMDB Link</p>
          <a
            :href="`https://www.imdb.com/title/${item.imdb_id}/`"
            class="text-[#318FE7] underline"
            target="_blank"
            >Link</a
          >
        </div>
        <div class="flex justify-between items-center mb-5">
          <p class="font-bold">Homepage Link</p>
          <a
            :href="item.homepage"
            class="text-[#318FE7] underline"
            target="_blank"
            >Link</a
          >
        </div>
      </div>
    </div>
    <p class="mb-20">{{ item.overview }}</p>
    <h4 class="text-lg font-bold mb-3">Credit:</h4>
    <span
      v-for="cast in casts.cast"
      :key="cast.id"
      class="after:content-[','] after:mx-1.5 last-of-type:after:hidden"
      >{{ cast.name }}</span
    >
    <p class="inline-block ml-1.5">and {{casts.more}} more.</p>
  </div>
</template>
