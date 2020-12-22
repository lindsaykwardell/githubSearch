import { Plugin } from '@nuxt/types'
import { request, gql } from 'graphql-request'

declare module 'vue/types/vue' {
  interface Vue {
    $search(query: string): Promise<GithubQuery>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $search(query: string): Promise<GithubQuery>
  }
  interface Context {
    $search(query: string): Promise<GithubQuery>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $search(query: string): Promise<GithubQuery>
  }
}

type GithubUser = {
  __typename: string
  name: string
}

type GithubQuery = {
  search: {
    nodes: GithubUser[]
  }
}

const searchGithubUsers = (query: string) =>
  request<GithubQuery>(
    '/api/graphql',
    gql`
      query GetUsers($query: String!) {
        search(query: $query, type: USER, first: 10) {
          nodes {
            __typename
            ... on User {
              name
            }
          }
        }
      }
    `,
    {
      query,
    },
  )

const myPlugin: Plugin = (context, inject) => {
  inject('search', searchGithubUsers)

  context.$search = searchGithubUsers
}

export default myPlugin
