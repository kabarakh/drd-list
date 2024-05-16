<script lang="ts" setup>
import { useRoomStore } from '@/stores/room'
import { computed, ref } from 'vue'

const roomStore = useRoomStore()
await roomStore.loadRooms()

const filterValues = ref({
  user: '',
  state: '',
  nameSearch: ''
});

const rooms = computed(() => {
  return roomStore.filteredRooms(filterValues.value);
});

const stateToText = {
  0: 'new',
  1: 'accepted',
  2: 'rejected',
  3: 'cursed'
}

const resetFilters = () => {

}
</script>

<template>
  <h1>DRD Room List</h1>
  <p>Deleted rooms are not included in the list!</p>
  <p>Also the filters don't react to each other ;)</p>

  <input placeholder="Search for name" v-model="filterValues.nameSearch" />

  <select v-model="filterValues.user">
    <option value="">Select...</option>
    <option v-for="userData in roomStore.userFilterValues" :key="userData.user" :value="userData.user">
      {{userData.user}} ({{userData.count}})
    </option>
  </select>

  <select v-model="filterValues.state">
    <option value="">Select...</option>
    <option v-for="stateData in roomStore.stateFilterValues" :key="stateData.state" :value="stateData.state">
      {{ stateToText[stateData.state] }} ({{stateData.count}})
    </option>
  </select>

  <button @click.prevent="resetFilters()">Reset filter</button>
  <table>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>State</th>
      <th>User</th>
    </tr>
    <tr v-for="(room, index) in rooms" :key="index">
      <td><a target="_blank" :href="`https://ladxr.daid.eu/drd/#${room.ID}`">{{ room.ID }}</a></td>
      <td>{{ room.name }}</td>
      <td>{{ stateToText[room.state] }}</td>
      <td>{{ room.user }}</td>
    </tr>
  </table>
</template>
