<template>
  <div class="flex flex-col md:flex-row m-3 p-3 border-b border-gray-300">
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
          <p v-if="user.bio" class="my-3">{{ user.bio }}</p>
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
        {{ user.repositories.totalCount === 1 ? 'repository' : 'repositories' }}
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
</template>

<script lang="ts">
import Vue from 'vue'

import { GithubRepository } from '~/plugins/search'

export default Vue.extend({
  props: {
    user: {
      type: Object,
      default: () => null,
    },
  },
  methods: {
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
.avatar {
  width: 150px;
  height: 150px;
}
</style>
