<script setup lang="ts">
import { usePagerStore } from '@/stores/pager'

const pagerStore = usePagerStore();
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
    <button :disabled="pagerStore.currentPage === 0" @click.prevent="pagerStore.updateCurrentPage(pagerStore.currentPage - 1)">&laquo;</button>
    <template v-for="(page, index) in pagerStore.pagesToRender" :key="page">
      <button :class="{underline: pagerStore.currentPage === page}" @click.prevent="pagerStore.updateCurrentPage(page)" >{{ page + 1 }}</button>
      <span v-if="pagerStore.pagesToRender[index + 1] !== undefined && page + 1 !== pagerStore.pagesToRender[index + 1]">...</span>
    </template>
    <button :disabled="pagerStore.currentPage === pagerStore.numberOfPages - 1" @click.prevent="pagerStore.updateCurrentPage(pagerStore.currentPage + 1)">&raquo;</button>
  </div>
</template>
