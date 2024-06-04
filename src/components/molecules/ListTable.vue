<script setup lang="ts">
import ListPager from '@/components/molecules/ListPager.vue'
import { useStore } from '@/stores/completeStore'

const completeStore = useStore()
</script>

<style scoped>
table {
  width: 700px;
}

th {
  text-align: left;
  width: 25%;
}
</style>

<template>
  <div v-if="completeStore.pagedRooms.length">
    <table>
      <tr>
        <th @click.prevent="() => completeStore.changeSorting('ID')">ID {{ completeStore.sortingCharacter('ID') }}</th>
        <th @click.prevent="() => completeStore.changeSorting('name')">Name {{ completeStore.sortingCharacter('name') }}</th>
        <th @click.prevent="() => completeStore.changeSorting('state')">State {{ completeStore.sortingCharacter('state') }}</th>
        <th @click.prevent="() => completeStore.changeSorting('user')">User {{ completeStore.sortingCharacter('user') }}</th>
      </tr>
      <tr v-for="(room, index) in completeStore.pagedRooms" :key="index">
        <td><a target="_blank" :href="`https://ladxr.daid.eu/drd/#${room.ID}`">{{ room.ID }}</a></td>
        <td>{{ room.name }}</td>
        <td>{{ completeStore.stateToText[room.state] }}</td>
        <td>{{ room.user }}</td>
      </tr>
    </table>
    <ListPager />
  </div>

  <div v-else>
    Either there is no data or you filtered in a way which doesn't result to any rooms.
  </div>
</template>
