import { defineStore } from 'pinia'
import { filter, inRange } from 'lodash'

export const usePagerStore = defineStore({
  id: 'pager',
  actions: {
    updateCurrentPage(newPage: number) {
      if (newPage >= 0 && newPage < this.numberOfPages) {
        this.currentPage = newPage
      }
    }
  },
  getters: {
    pagesToRender: (state) => {
      return filter([...Array(state.numberOfPages).keys()], (pageNumber): boolean => {
        return pageNumber < state.startEndPages || pageNumber > state.numberOfPages - 1 - state.startEndPages || // within the first or last elements
          inRange(pageNumber, state.currentPage - state.pagesAroundCurrent, state.currentPage + 1 + state.pagesAroundCurrent) // close enough to current page
      })
    }
  },
  state: () => {
    return {
      currentPage: 0,
      numberOfPages: 0,
      itemsPerPage: 10,
      startEndPages: 2,
      pagesAroundCurrent: 2
    }
  }
})
