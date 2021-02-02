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
      <div
        v-for="user in users"
        :key="user.id"
        class="flex flex-col md:flex-row m-3 p-3 border-b border-gray-300"
      >
        <img
          class="avatar rounded-full shadow m-auto"
          :src="user.avatarUrl"
          :alt="`${user.name} avatar`"
        />
        <div class="flex-grow md:pl-5">
          <div class="flex flex-col md:flex-row items-center md:items-end my-3">
            <h2 class="text-3xl">
              <a
                :href="user.url"
                class="text-blue-500 underline hover:text-blue-700"
                >{{ user.name }}</a
              >
            </h2>
            <div class="md:pl-5 text-gray-500">{{ user.login }}</div>
          </div>
          <div class="flex">
            <div class="py-2 flex-grow md:pr-5">
              <p class="my-3">{{ user.bio }}</p>
              <div
                class="flex flex-col md:flex-row items-center text-sm text-gray-600 pt-2"
              >
                <div v-if="user.location" class="md:pr-5">
                  {{ user.location }}
                </div>
                <div v-if="user.email">
                  <a
                    :href="`mailto:${user.email}`"
                    class="underline hover:text-blue-700"
                    >{{ user.email }}</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col text-gray-600 text-sm md:w-32 text-center md:text-left"
        >
          <div v-if="user.repositories">
            {{ user.repositories.totalCount }}
            {{
              user.repositories.totalCount === 1 ? 'repository' : 'repositories'
            }}
          </div>
          <div v-if="user.followers">
            {{ user.followers.totalCount }}
            {{ user.followers.totalCount === 1 ? 'follower' : 'followers' }}
          </div>
          <div v-if="user.starredRepositories">
            {{ user.starredRepositories.totalCount }}
            {{ user.starredRepositories.totalCount === 1 ? 'star' : 'stars' }}
          </div>
          <div v-if="user.repositories">
            {{ preferredLanguage(user.repositories.nodes) }}
          </div>
        </div>
      </div>
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
import { GithubUser, GithubQuery, GithubRepository } from '~/plugins/search'

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
    preferredLanguage(repoList: GithubRepository[]): string {
      const languages = new Map<string, number>()
      repoList
        .filter(repo => repo.primaryLanguage)
        .forEach(repo => {
          const existingLanguage = languages.get(repo.primaryLanguage!.name)
          if (existingLanguage)
            languages.set(repo.primaryLanguage!.name, existingLanguage + 1)
          else languages.set(repo.primaryLanguage!.name, 1)
        })

      const [mostUsedLang] = [...languages.keys()].reduce(
        (mostUsedLang: [string, number], next: string): [string, number] => {
          const count = languages.get(next)
          if (count! > mostUsedLang[1]) return [next, count!]
          else return mostUsedLang
        },
        ['', 0],
      )

      return `${Math.round(
        (languages.get(mostUsedLang)! / repoList.length) * 100,
      )}% ${mostUsedLang}`
    },
  },
})
</script>

<style lang="postcss" scoped>
.search-card {
  width: 1400px;
}

.avatar {
  width: 150px;
  height: 150px;
}
</style>
