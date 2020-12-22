<template>
  <div class="flex h-screen bg-gray-100 justify-center">
    <div class="search-card bg-white shadow my-6">
      <div class="p-3">
        <label>
          <h1 class="text-xl text-gray-600">
            Search more than <strong>64M</strong> users
          </h1>
          <form @submit.stop.prevent="search">
            <div class="flex pt-2">
              <input
                v-model="query"
                type="text"
                class="shadow w-full p-2 bg-gray-100 flex-grow"
                placeholder="Search GitHub"
              />
              <button
                class="w-24 bg-green-300 hover:bg-green-400 transition duration-50 rounded p-2 ml-4"
                @click="search"
              >
                Search
              </button>
            </div>
          </form>
        </label>
      </div>
      <div v-for="user in users" :key="user.name">{{ user }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GithubUser } from '~/plugins/search'

export default Vue.extend({
  data: (): {
    query: string
    users: GithubUser[]
  } => ({
    query: '',
    users: [],
  }),
  methods: {
    async search() {
      const { search } = await this.$search(this.query)
      this.users = search.nodes
    },
  },
})
</script>

<style lang="postcss" scoped>
.search-card {
  width: 1400px;
}
</style>
