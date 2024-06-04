import { defineStore } from 'pinia'
import axios from 'axios'
import { countBy, filter, map, toInteger } from 'lodash'
import type { Room } from '@/interface/Room'
import { usePagerStore } from '@/stores/pager'
import { useFilterStore } from '@/stores/filter'

export const useRoomStore = defineStore({
  id: 'room-list',
  actions: {
    async loadRooms() {
      const response = await axios.get('https://ladxr.daid.eu/drd/db.php', {
        withCredentials: false
      })
      this.rooms = response.data
    }
  },
  getters: {
    filteredRooms: (state) => {
      const pagerStore = usePagerStore()
      const filterStore = useFilterStore()

      const filteredRooms = filter(state.rooms, (room) => {
        return (filterStore.user === '' || room.user === filterStore.user)
          && (filterStore.state === '' || room.state === filterStore.state)
          && (filterStore.nameSearch === '' || room.name.toLowerCase().includes(filterStore.nameSearch.toLowerCase()))
      })

      pagerStore.numberOfPages = Math.ceil(filteredRooms.length / pagerStore.itemsPerPage)
      pagerStore.currentPage = 0

      return filteredRooms
    },
    userFilterValues: (state) => {
      const userCounts = countBy(state.rooms, 'user')
      return map(userCounts, (count, user) => {
        return { user, count }
      }).sort((a, b) => {
        return a.user.localeCompare(b.user)
      })
    },
    stateFilterValues: (state): Array<{ state: 1 | 2 | 3, count: number }> => {
      const stateCounts = countBy(state.rooms, 'state')
      return map(stateCounts, (count, roomState) => {
        return { state: toInteger(roomState) as 1 | 2 | 3, count }
      })
    }
  },
  state: (): {
    rooms: Room[],
  } => {
    return {
      rooms: [],
    }
  }
})
