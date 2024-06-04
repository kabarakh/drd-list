<script lang="ts" setup>
import { useRoomStore } from '@/stores/room'
import ListTable from '@/components/molecules/ListTable.vue'
import ListFilter from '@/components/molecules/ListFilter.vue'

const roomStore = useRoomStore()
await roomStore.loadRooms()
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

  <template v-if="roomStore.rooms.length > 0">
    <ListFilter />
    <ListTable />
  </template>
  <div v-else>
    Loading rooms
  </div>
</template>
