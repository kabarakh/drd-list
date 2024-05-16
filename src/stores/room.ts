import { defineStore } from 'pinia'
import axios from 'axios'
import { countBy, filter, map, toInteger } from 'lodash'
import type { Room } from '@/interface/Room'

export const useRoomStore = defineStore({
  id: 'room-list',
  actions: {
    async loadRooms() {
      const response = await axios.get('https://ladxr.daid.eu/drd/db.php', {
        withCredentials: false,
      });
      this.rooms = response.data;
    }
  },
  getters: {
    filteredRooms: (state) => {
      return (filterValues: {
        user: string,
        state: ''|1|2|3,
        nameSearch: string
      }) => {
        return filter(state.rooms, (room) => {
          console.log(filterValues.state, room.state,typeof filterValues.state, typeof room.state)
          return (filterValues.user === '' || room.user === filterValues.user)
            && (filterValues.state === '' || room.state === filterValues.state)
            && (filterValues.nameSearch === '' || room.name.toLowerCase().includes(filterValues.nameSearch.toLowerCase()))
        })
      }
    },
    userFilterValues: (state) => {
      const userCounts = countBy(state.rooms, 'user');
      return map(userCounts, (count, user) => {
        return { user, count }
      }).sort((a, b) => {
        return a.user.localeCompare(b.user);
      });
    },
    stateFilterValues: (state): Array<{state: 1|2|3, count: number}> => {
      const stateCounts = countBy(state.rooms, 'state');
      return map(stateCounts, (count, roomState) => {
        return { state: toInteger(roomState) as 1|2|3, count }
      });
    },
  },
  state: (): {
    rooms: Room[]
  } => {
    return {
      rooms: [],
    }
  },
});
