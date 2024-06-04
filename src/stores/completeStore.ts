import { defineStore } from 'pinia'
import axios from 'axios'
import { countBy, filter, inRange, map, toInteger } from 'lodash'
import type { Room } from '@/interface/Room'

interface State {
  rooms: Room[];
  pager: {
    currentPage: number;
    numberOfPages: number;
    itemsPerPage: number;
    startEndPages: number;
    pagesAroundCurrent: number;
  };
  filter: {
    user: string;
    state: '' | 0 | 1 | 2 | 3;
    nameSearch: string;
  };
  sorting: { field: string, direction: 'asc' | 'desc' }
}

export const useStore = defineStore({
  id: 'store',
  actions: {
    async loadRooms() {
      const response = await axios.get('https://ladxr.daid.eu/drd/db.php', {
        withCredentials: false
      })
      this.rooms = response.data
    },
    resetFilter() {
      this.filter =  {
        user: '',
        state: '',
        nameSearch: ''
      };

      this.pager.currentPage = 0
    },
    changeSorting(field: string) {
      if (field === this.sorting.field) {
        this.sorting = {
          field: this.sorting.field,
          direction: this.sorting.direction === 'asc' ? 'desc' : 'asc'
        }
      } else {
        this.sorting = {
          field: field,
          direction: 'asc'
        }
      }

      this.pager.currentPage = 0
    }
  },
  getters: {
    filteredRooms(state): Room[] {
      const filteredRooms = filter(state.rooms, (room) => {
        return (state.filter.user === '' || room.user === state.filter.user)
          && (state.filter.state === '' || room.state === state.filter.state)
          && (state.filter.nameSearch === '' || room.name.toLowerCase().includes(state.filter.nameSearch.toLowerCase()))
      })

      state.pager.numberOfPages = Math.ceil(filteredRooms.length / state.pager.itemsPerPage)
      return filteredRooms
    },
    pagedRooms() {
      const sortedRooms = this.filteredRooms.sort((roomA: Room, roomB: Room) => {
        const directionFactor = this.sorting.direction === 'asc' ? 1 : -1

        let sortingFactor = 0
        if (this.sorting.field === 'ID' || this.sorting.field === 'state') {
          sortingFactor = roomA[this.sorting.field] - roomB[this.sorting.field]
        } else if (this.sorting.field === 'name' || this.sorting.field === 'user') {
          sortingFactor = roomA[this.sorting.field].localeCompare(roomB[this.sorting.field])
        }

        return directionFactor * sortingFactor
      })

      return sortedRooms.slice(this.pager.currentPage * this.pager.itemsPerPage, (this.pager.currentPage + 1) * this.pager.itemsPerPage)
    },
    pagesToRender: (state) => {
      return filter([...Array(state.pager.numberOfPages).keys()], (pageNumber): boolean => {
        return pageNumber < state.pager.startEndPages || pageNumber > state.pager.numberOfPages - 1 - state.pager.startEndPages || // within the first or last elements
          inRange(pageNumber, state.pager.currentPage - state.pager.pagesAroundCurrent, state.pager.currentPage + 1 + state.pager.pagesAroundCurrent) // close enough to current page
      })
    },
    userFilterValues: (state) => {
      const userCounts = countBy(state.rooms, 'user')
      return map(userCounts, (count, user) => {
        return { user, count }
      }).sort((a, b) => {
        return a.user.localeCompare(b.user)
      })
    },
    stateFilterValues: (state): Array<{ state: 0 | 1 | 2 | 3, count: number }> => {
      const stateCounts = countBy(state.rooms, 'state')
      return map(stateCounts, (count, roomState) => {
        return { state: toInteger(roomState) as 0 | 1 | 2 | 3, count }
      })
    },
    stateToText: () => {
      return {
        0: 'new',
        1: 'accepted',
        2: 'rejected',
        3: 'cursed'
      }
    },
    sortingCharacter(state) {
      return (identifier: string): string => {
        if (identifier === state.sorting.field) {
          if (state.sorting.direction === 'asc') {
            return '↓'
          } else {
            return '↑'
          }
        }
        return ''
      }
    }
  },
  state: (): State => {
    return {
      rooms: [],
      pager: {
        currentPage: 0,
        numberOfPages: 0,
        itemsPerPage: 10,
        startEndPages: 2,
        pagesAroundCurrent: 2
      },
      filter: {
        user: '',
        state: '',
        nameSearch: ''
      },
      sorting: {
        field: 'ID',
        direction: 'asc'
      }
    }
  }
})
