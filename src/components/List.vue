<script lang="ts" setup>
import { useRoomStore } from '@/stores/room'
import { computed, ref, watch } from 'vue'
import type { Room } from '@/interface/Room'
import { filter } from 'lodash'

const roomStore = useRoomStore()
await roomStore.loadRooms()

const filterValues = ref({
  user: '',
  state: '',
  nameSearch: ''
})

const currentSorting = ref({ field: 'ID', direction: 'asc' })

const currentPage = ref(0)
const itemsPerPage = 10

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
}

watch([currentSorting, () => filterValues], () => {
  currentPage.value = 0
}, {deep: true})

const numberOfPages = computed(() => {
  return Math.ceil(rooms.value.length / itemsPerPage)
})

const rooms = computed(() => {
  const filteredRooms = roomStore.filteredRooms(filterValues.value)
  return filteredRooms.sort((roomA: Room, roomB: Room) => {
    const directionFactor = currentSorting.value.direction === 'asc' ? 1 : -1

    let sortingFactor = 0
    if (currentSorting.value.field === 'ID' || currentSorting.value.field === 'state') {
      sortingFactor = roomA[currentSorting.value.field] - roomB[currentSorting.value.field]
    } else if (currentSorting.value.field === 'name' || currentSorting.value.field === 'user') {
      sortingFactor = roomA[currentSorting.value.field].localeCompare(roomB[currentSorting.value.field])
    }

    return directionFactor * sortingFactor
  })
})

const pagedRooms = computed(() => {
  return rooms.value.slice(currentPage.value * itemsPerPage, (currentPage.value + 1) * itemsPerPage)
})

const stateToText = {
  0: 'new',
  1: 'accepted',
  2: 'rejected',
  3: 'cursed'
}

const resetFilters = () => {
  filterValues.value = {
    user: '',
    state: '',
    nameSearch: ''
  }
}

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

const updateCurrentPage = (newPage: number): void => {
  if (newPage >= 0 && newPage < numberOfPages.value) {
    currentPage.value = newPage
  }
}
</script>

<style scoped>
a {
  cursor: pointer;
}

a.disabled {
  cursor: default;
  color: gray;
}

table {
  width: 700px;
}
th {
  text-align: left;
  width: 25%;
}

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

.mb-2 {
  margin-bottom: 8px;
}

.underline {
  text-decoration: underline;
}
</style>

<template>
  <h1>DRD Room List</h1>
  <p>Deleted rooms are not included in the list!</p>
  <p>Also the filters don't react to each other ;)</p>

  <div class="flex flex-row gap-3 mb-2">

    <div>
      <label for="name-search">Name</label><br />
      <input id="name-search" placeholder="Search for name" v-model="filterValues.nameSearch" />
    </div>

    <div>
      <label for="user-filter">User</label><br />
      <select id="user-filter" v-model="filterValues.user">
        <option value="">Select...</option>
        <option v-for="userData in roomStore.userFilterValues" :key="userData.user" :value="userData.user">
          {{ userData.user }} ({{ userData.count }})
        </option>
      </select>
    </div>

    <div>
      <label for="state-filter">State</label><br />
      <select id="state-filter" v-model="filterValues.state">
        <option value="">Select...</option>
        <option v-for="stateData in roomStore.stateFilterValues" :key="stateData.state" :value="stateData.state">
          {{ stateToText[stateData.state] }} ({{ stateData.count }})
        </option>
      </select>
    </div>

  </div>

  <button @click.prevent="resetFilters()">Reset filter</button>

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
        <td>{{ stateToText[room.state] }}</td>
        <td>{{ room.user }}</td>
      </tr>
    </table>
    <div class="flex flex-row gap-3">
      <a :class="{disabled: currentPage === 0}" @click.prevent="updateCurrentPage(currentPage - 1)">&laquo;</a>
      <a :class="{underline: currentPage === page}" @click.prevent="updateCurrentPage(page)" v-for="page in [...Array(numberOfPages).keys()]" :key="page">{{ page + 1 }}</a>
      <a :class="{disabled: currentPage === numberOfPages - 1}" @click.prevent="updateCurrentPage(currentPage + 1)">&raquo;</a>
    </div>
  </div>

  <div v-else>
    Either there is no data or you filtered in a way which doesn't result to any rooms.
  </div>
</template>
