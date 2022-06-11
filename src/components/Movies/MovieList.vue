<script setup>
import { request } from "../../composable/requests";
import { useStore } from "../../stores";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

const start = ref(route.query["release_date.gte"]);
const end = ref(route.query["release_date.lte"]);

let { data, error } = request("get", true);

const search = () => {
  router.push({
    name: "home",
    query: { "release_date.gte": start.value, "release_date.lte": end.value },
  });
};

const page = computed(() => {
  return route.query && route.query.page ? route.query.page : 1;
});

const totalPage = computed(() => {
  return data.value && data.value.data ? data.value.data.total_pages : page.value;
});

watch(route, () => {
  console.log("quer");
  start.value = route.query["release_date.gte"];
  end.value = route.query["release_date.lte"];
});

const store = useStore();
</script>

<template>
  <div class="container mx-auto pb-[90px]">
    <div
      class="bg-[#E2E2E2] py-6 px-20 rounded-[6px] flex justify-between items-center mb-28"
    >
      <div class="flex items-center">
        Search by release date:
        <label for="start" class="ml-7">start:</label>
        <input
          type="date"
          id="start"
          v-model="start"
          class="ml-2"
          placeholder="start at"
        />
        <label for="end" class="ml-7">end:</label>
        <input
          type="date"
          id="end"
          class="ml-2"
          v-model="end"
          placeholder="start at"
        />
      </div>

      <button
        @click="search"
        class="text-white rounded-full bg-[#549DF2] py-2 px-3 hover:bg-[#549DF2AA] focus:outline-none focus:ring focus:ring-[#549DF2]"
      >
        Search
      </button>
    </div>
    <div class="grid grid-cols-3 gap-x-[70px] gap-y-[35px] mb-40">
      <RouterLink
        :to="{ name: 'movie', params: { id: item.id } }"
        class="bg-[#F1F1F1] rounded-md py-[3px] px-1 flex"
        v-for="item in data?.data.results"
        :key="item.id"
      >
        <div class="w-[43%] shrink-0 relative pb-[64.5%]">
          <img
            :src="store.image_url + 'original' + item.poster_path"
            alt=""
            class="rounded-l-md absolute"
          />
        </div>
        <div
          class="py-3.5 px-2.5 grow shrink-0 flex flex-col justify-between w-[58%]"
        >
          <h3 class="text-base font-bold whitespace-normal">
            {{ item.title }}
          </h3>
          <div>
            <div class="flex items-center mb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="22" height="22" fill="url(#pattern0)" />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_8_18"
                      transform="translate(0 -0.015625) scale(0.03125)"
                    />
                  </pattern>
                  <image
                    id="image0_8_18"
                    width="32"
                    height="33"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAQAAAASL2HaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiAwoOOCiX8bOWAAAA8ElEQVRIx+2VTw7BUBCHv9afBVsShxHHEAcQcQaLLiyqV+AGIjiDOAzClkVbxkbrTUkpEpv+ZtHk9958b+a9ZAr/lvXgtGkBa6YJv0MTWDFLBzrILYbKH8a+kw7YIHi4CAfl7xFcPIRtOiBEKABnxGjPQjgDBYRQJxRv3yp96oBtrI2eHmHjAVsmnEx7Efd4r0BHVEEUC809ZgYcdQslA1YnfPK8FrV4t5ERbfQV4h0FlElc2kcyixpweTPLxk1aPqJgr44V/Ij1pXJADsgBPwIU4/lSopthHkCgreXDEH0Vcz0TK/RoZKh8x1j/F/6nK0D2d+Xdbd9cAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAzLTEwVDE0OjU2OjQwKzAwOjAwQn9tOgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMy0xMFQxNDo1Njo0MCswMDowMDMi1YYAAAAASUVORK5CYII="
                  />
                </defs>
              </svg>
              <div class="ml-2 text-xs font-normal">
                {{ item.release_date }}
              </div>
            </div>
            <div class="h-[30px] flex items-start flex-wrap">
              <p
                v-for="genres in item.genre_ids"
                :key="genres"
                class="text-xs flex items-center font-normal last-of-type:after:hidden after:w-1 after:h-1 after:rounded-full after:bg-[#505050] after:mx-1"
              >
                {{ store.getGenres?.find((genre) => genre.id === genres).name }}
              </p>
              <span class=""></span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
    <div class="flex items-center justify-center mb-3.5 font-bold">
      <RouterLink
        class="text-[#318FE7]"
        :to="{
          name: 'home',
          query: { ...route.query, page: page - 1 },
        }"
        v-if="page > 1"
      >
        Previous Page
      </RouterLink>
      <p class="text-[#0000007A]" v-else>Previous Page</p>
      <div class="w-px h-10 bg-[#6A6A6A] mx-[30px]"></div>
      <RouterLink
        class="text-[#318FE7]"
        :to="{
          name: 'home',
          query: { ...route.query, page: page + 1 },
        }"
        v-if="page < totalPage"
      >
        Next Page
      </RouterLink>
      <p class="text-[#0000007A]" v-else>Next Page</p>
    </div>
    <p class="text-center text-[#989898]">
      Showing results {{ page + " - " + totalPage }}
    </p>
  </div>
</template>
