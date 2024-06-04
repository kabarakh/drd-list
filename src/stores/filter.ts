import { defineStore } from 'pinia'

export const useFilterStore = defineStore({
  id: 'filters',
  actions: {
    resetFilters() {
      this.$reset()
    }
  },
  getters: {
    stateToText: () => {
      return {
        0: 'new',
        1: 'accepted',
        2: 'rejected',
        3: 'cursed'
      }
    }
  },
  state: (): {
    user: string,
    state: '' | 1 | 2 | 3,
    nameSearch: string
  } => {
    return {
      user: '',
      state: '',
      nameSearch: ''
    }
  }
})
