<script setup lang="ts">
import { useRoomStore } from '@/stores/room'
import { useFilterStore } from '@/stores/filter'

const filterStore = useFilterStore()
const roomStore = useRoomStore()

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
      <input id="name-search" placeholder="Search for name" v-model="filterStore.nameSearch" />
    </div>

    <div>
      <label for="user-filter">User</label><br />
      <select id="user-filter" v-model="filterStore.user">
        <option value="">Select...</option>
        <option v-for="userData in roomStore.userFilterValues" :key="userData.user" :value="userData.user">
          {{ userData.user }} ({{ userData.count }})
        </option>
      </select>
    </div>

    <div>
      <label for="state-filter">State</label><br />
      <select id="state-filter" v-model="filterStore.state">
        <option value="">Select...</option>
        <option v-for="stateData in roomStore.stateFilterValues" :key="stateData.state" :value="stateData.state">
          {{ filterStore.stateToText[stateData.state] }} ({{ stateData.count }})
        </option>
      </select>
    </div>

  </div>

  <button @click.prevent="filterStore.resetFilters()">Reset filter</button>
</template>
