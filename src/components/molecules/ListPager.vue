<script setup lang="ts">
import { useStore } from '@/stores/completeStore'

const completeStore = useStore();
</script>

<style scoped>
button {
  cursor: pointer;
}

.underline {
  text-decoration: underline;
}
</style>

<template>
  <div class="flex flex-row gap-3">
    <button :disabled="completeStore.pager.currentPage === 0" @click.prevent="completeStore.pager.currentPage = completeStore.pager.currentPage - 1">&laquo;</button>
    <template v-for="(page, index) in completeStore.pagesToRender" :key="page">
      <button :class="{underline: completeStore.pager.currentPage === page}" @click.prevent="completeStore.pager.currentPage = page" >{{ page + 1 }}</button>
      <span v-if="completeStore.pagesToRender[index + 1] !== undefined && page + 1 !== completeStore.pagesToRender[index + 1]">...</span>
    </template>
    <button :disabled="completeStore.pager.currentPage === completeStore.pager.numberOfPages - 1" @click.prevent="completeStore.pager.currentPage = completeStore.pager.currentPage + 1">&raquo;</button>
  </div>
</template>
