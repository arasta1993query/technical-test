<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import {useStore} from "./stores";
onMounted(() => {
  const store = useStore();
  store.initial();
});
</script>

<template>
  <div class="w-full h-12 bg-[#11B980] mb-16"></div>
  <RouterView />
</template>
