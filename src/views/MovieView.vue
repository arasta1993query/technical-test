<script setup>
import { useRoute } from "vue-router";
import MovieDetail from "../components/Movie/MovieDetail.vue";

const route = useRoute();
</script>

<template>
  <MovieDetail />
</template>
