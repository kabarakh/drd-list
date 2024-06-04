<script setup lang="ts">

import { useStore } from '@/stores/completeStore'
import { watch } from 'vue'

const completeStore = useStore()

watch(() => completeStore.filter, () => {
  completeStore.pager.currentPage = 0
}, {deep: true})
</script>

<style scoped>
.mb-2 {
  margin-bottom: 8px;
}
</style>

<template>
  <div class="flex flex-row gap-3 mb-2">
    <div>
      <label for="name-search">Name</label><br />
      <input id="name-search" placeholder="Search for name" v-model="completeStore.filter.nameSearch" />
    </div>

    <div>
      <label for="user-filter">User</label><br />
      <select id="user-filter" v-model="completeStore.filter.user">
        <option value="">Select...</option>
        <option v-for="userData in completeStore.userFilterValues" :key="userData.user" :value="userData.user">
          {{ userData.user }} ({{ userData.count }})
        </option>
      </select>
    </div>

    <div>
      <label for="state-filter">State</label><br />
      <select id="state-filter" v-model="completeStore.filter.state">
        <option value="">Select...</option>
        <option v-for="stateData in completeStore.stateFilterValues" :key="stateData.state" :value="stateData.state">
          {{ completeStore.stateToText[stateData.state] }} ({{ stateData.count }})
        </option>
      </select>
    </div>

  </div>

  <button @click.prevent="completeStore.resetFilter()">Reset filter</button>
</template>
