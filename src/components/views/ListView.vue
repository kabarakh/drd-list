<script lang="ts" setup>
import ListTable from '@/components/molecules/ListTable.vue'
import ListFilter from '@/components/molecules/ListFilter.vue'
import { useStore } from '@/stores/completeStore'

const completeStore = useStore()
await completeStore.loadRooms()
</script>

<style>
.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
  align-items: center;
}

.gap-3 {
  gap: 12px;
}
</style>

<template>
  <h1>DRD Room List</h1>
  <p>Deleted rooms are not included in the list!</p>
  <p>Also the filters don't react to each other ;)</p>

  <div v-if="completeStore.rooms.length">
    <ListFilter />
    <ListTable />
  </div>
  <div v-else>
    Loading rooms
  </div>
</template>
