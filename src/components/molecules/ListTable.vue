<script setup lang="ts">
import { ref, watch } from 'vue'
import ListPager from '@/components/molecules/ListPager.vue'
import { usePagerStore } from '@/stores/pager'
import { useRoomStore } from '@/stores/room'
import { useFilterStore } from '@/stores/filter'
import type { Room } from '@/interface/Room'

const pagerStore = usePagerStore()
const roomStore = useRoomStore()
const filterStore = useFilterStore()

const sortingCharacter = (identifier: string): string => {
  if (identifier === currentSorting.value.field) {
    if (currentSorting.value.direction === 'asc') {
      return '↓'
    } else {
      return '↑'
    }
  }
  return ''
}

const currentSorting = ref({ field: 'ID', direction: 'asc' })

const changeSorting = (field: string) => {
  if (field === currentSorting.value.field) {
    currentSorting.value = {
      field: currentSorting.value.field,
      direction: currentSorting.value.direction === 'asc' ? 'desc' : 'asc'
    }
  } else {
    currentSorting.value = {
      field: field,
      direction: 'asc'
    }
  }

  pagerStore.currentPage = 0
}
const pagedRooms = ref<Room[]>([]);

watch([() => roomStore.rooms, currentSorting, pagerStore, filterStore], () => {
  const filteredRooms = roomStore.filteredRooms
  const sortedRooms = filteredRooms.sort((roomA: Room, roomB: Room) => {
    const directionFactor = currentSorting.value.direction === 'asc' ? 1 : -1

    let sortingFactor = 0
    if (currentSorting.value.field === 'ID' || currentSorting.value.field === 'state') {
      sortingFactor = roomA[currentSorting.value.field] - roomB[currentSorting.value.field]
    } else if (currentSorting.value.field === 'name' || currentSorting.value.field === 'user') {
      sortingFactor = roomA[currentSorting.value.field].localeCompare(roomB[currentSorting.value.field])
    }

    return directionFactor * sortingFactor
  })

  pagedRooms.value = sortedRooms.slice(pagerStore.currentPage * pagerStore.itemsPerPage, (pagerStore.currentPage + 1) * pagerStore.itemsPerPage)
}, {deep: true})
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
  <div v-if="pagedRooms.length">
    <table>
      <tr>
        <th @click.prevent="() => changeSorting('ID')">ID {{ sortingCharacter('ID') }}</th>
        <th @click.prevent="() => changeSorting('name')">Name {{ sortingCharacter('name') }}</th>
        <th @click.prevent="() => changeSorting('state')">State {{ sortingCharacter('state') }}</th>
        <th @click.prevent="() => changeSorting('user')">User {{ sortingCharacter('user') }}</th>
      </tr>
      <tr v-for="(room, index) in pagedRooms" :key="index">
        <td><a target="_blank" :href="`https://ladxr.daid.eu/drd/#${room.ID}`">{{ room.ID }}</a></td>
        <td>{{ room.name }}</td>
        <td>{{ filterStore.stateToText[room.state] }}</td>
        <td>{{ room.user }}</td>
      </tr>
    </table>
    <ListPager />
  </div>

  <div v-else>
    Either there is no data or you filtered in a way which doesn't result to any rooms.
  </div>
</template>
