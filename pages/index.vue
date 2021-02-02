<template>
  <div class="flex justify-center">
    <div class="search-card bg-white shadow m-6">
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
                class="w-24 bg-green-300 hover:bg-green-400 hover:shadow transition duration-50 rounded p-2 ml-4 flex justify-center"
              >
                <Loader v-if="isSearching" />
                <template v-else> Search </template>
              </button>
            </div>
          </form>
        </label>
      </div>
      <div v-if="userCount" class="p-3 text-gray-600 text-lg">
        {{ userCount }} {{ userCount === 1 ? 'result' : 'results' }}
      </div>
      <UserCard v-for="user in users" :key="user.id" :user="user"> </UserCard>
      <div v-if="activeSearch" class="flex justify-around w-64 m-auto py-3">
        <button
          class="w-24 bg-gray-200 rounded p-1 text-xs text-gray-700 hover:shadow hover:bg-gray-300 transition duration-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!activeSearch.search.pageInfo.hasPreviousPage"
          @click="prev"
        >
          Previous
        </button>
        <button
          class="w-24 bg-gray-200 rounded p-1 text-xs text-gray-700 hover:shadow hover:bg-gray-300 transition duration-50 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center"
          :disabled="
            !activeSearch.search.pageInfo.hasNextPage || nextButtonStatus !== 0
          "
          @click="next"
        >
          <Loader v-if="nextButtonStatus !== 0" />
          <template v-else>Next</template>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GithubUser, GithubQuery } from '~/plugins/search'
import Loader from '~/components/Loader.vue'
import UserCard from '~/components/UserCard.vue'

enum SearchStatus {
  IDLE,
  LOADING,
}

export default Vue.extend({
  data: (): {
    searchStatus: SearchStatus
    nextButtonStatus: SearchStatus
    query: string
    searches: GithubQuery[]
    page: number
  } => ({
    searchStatus: SearchStatus.IDLE,
    nextButtonStatus: SearchStatus.IDLE,
    query: '',
    searches: [],
    page: -1,
  }),
  computed: {
    isSearching(): boolean {
      return this.searchStatus === SearchStatus.LOADING
    },
    activeSearch(): GithubQuery {
      return this.searches[this.page]
    },
    userCount(): number {
      return this.activeSearch?.search.userCount
    },
    users(): GithubUser[] {
      return (
        this.activeSearch?.search.nodes.filter(
          node => node.__typename !== 'Organization',
        ) || []
      )
    },
  },
  methods: {
    async search() {
      this.searchStatus = SearchStatus.LOADING
      const search = await this.$search(this.query)
      this.searches = [search]
      this.page = 0
      this.searchStatus = SearchStatus.IDLE
    },
    async next() {
      if (this.page + 1 < this.searches.length) return this.page++

      this.nextButtonStatus = SearchStatus.LOADING
      const search = await this.$search(this.query, {
        after: this.activeSearch.search.pageInfo.endCursor,
      })
      this.searches.push(search)
      this.page++
      this.nextButtonStatus = SearchStatus.IDLE
      window.scrollTo(0, 0)
    },
    prev() {
      this.page--
      window.scrollTo(0, 0)
    },
  },
  components: {
    Loader,
    UserCard,
  },
})
</script>

<style lang="postcss" scoped>
.search-card {
  width: 1400px;
}
</style>
