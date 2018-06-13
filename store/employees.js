import { api } from '../plugins/api'

export const state = () => ({
  employees: null,
  fetching: false,
  error: null
})

export const getters = {
  fetching: state => {
    return state.fetching
  },
  employees: state => {
    return state.employees || []
  }
}

export const mutations = {
  fetching(state) {
    state.fetching = true
    state.error = null
    state.employees = null
  },
  success(state, payload) {
    state.employees = payload
    state.fetching = false
    state.error = null
  },
  error(state, error) {
    state.fetching = false
    state.error = error
    state.employees = null
  }
}

export const actions = {
  success({ commit }, payload) {
    commit('success', payload)
  },
  error({ commit }, error = null) {
    commit('error', error)
  },
  async fetchEmployees({commit}) {
    commit('fetching')
    const response = await api.get('employees')
    if (response.ok) {
      commit('success', response.data)
    } else {
      commit('error', response.problem)
    }
  },
  async newEmployee({ commit, dispatch }, payload) {
    const response = await api.post(`employees`, payload)
    if (response.ok) {
      dispatch('fetchEmployees')
    } else {
      commit('error', response.problem)
    }
  },
  async updateEmployee({ commit, dispatch }, payload) {
    const response = await api.put(`employees`, payload)
    if (response.ok) {
      dispatch('fetchProducts')
    } else {
      commit('error', response.problem)
    }
  },
  async deleteEmployee({ commit, dispatch }, payload) {
    const { id } = payload
    const response = await api.delete(`employees/${id}`)
    if (response.ok) {
      dispatch('fetchEmployees')
    } else {
      commit('error', response.problem)
    }
  },
}
