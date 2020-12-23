import { Plugin } from '@nuxt/types'
import { request, gql } from 'graphql-request'

declare module 'vue/types/vue' {
  interface Vue {
    $search(
      query: string,
      pagination?: {
        after?: string
        before?: string
      },
    ): Promise<GithubQuery>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $search(
      query: string,
      pagination?: {
        after?: string
        before?: string
      },
    ): Promise<GithubQuery>
  }
  interface Context {
    $search(
      query: string,
      pagination?: {
        after?: string
        before?: string
      },
    ): Promise<GithubQuery>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $search(
      query: string,
      pagination?: {
        after?: string
        before?: string
      },
    ): Promise<GithubQuery>
  }
}

export type GithubRepository = {
  name: string
  url: string
  description: string | null
  stargazerCount: number
  licenseInfo: {
    name: string
  } | null
  primaryLanguage: {
    color: string
    name: string
  } | null
}

export type GithubUser = {
  __typename: string
  id: string
  login: string
  name: string
  bio: string
  email: string
  location: string
  isHireable: boolean
  url: string
  avatarUrl: string
  followers: {
    totalCount: number
  }
  starredRepositories: {
    totalCount: number
  }
  pinnedItems: {
    nodes: GithubRepository[]
  }
  repositories: {
    totalCount: number
    nodes: GithubRepository[]
  }
}

export type GithubQuery = {
  search: {
    userCount: number
    pageInfo: {
      startCursor: string
      endCursor: string
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    nodes: GithubUser[]
  }
}

export const searchGithubUsers = (
  query: string,
  pagination: {
    after?: string
    before?: string
  } = {},
  url: string = '/api/graphql',
) => {
  const variables = {
    query,
    before: null,
    after: null,
    ...pagination,
  }

  return request<GithubQuery>(
    url,
    gql`
      query GetUsers($query: String!, $before: String, $after: String) {
        search(
          query: $query
          type: USER
          first: 5
          before: $before
          after: $after
        ) {
          userCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          nodes {
            __typename
            ... on User {
              id
              login
              name
              bio
              email
              location
              isHireable
              url
              avatarUrl
              followers {
                totalCount
              }
              starredRepositories {
                totalCount
              }
              pinnedItems(first: 6, types: [REPOSITORY]) {
                nodes {
                  ... on Repository {
                    name
                    url
                    description
                    stargazerCount
                    licenseInfo {
                      name
                    }
                    primaryLanguage {
                      color
                      name
                    }
                  }
                }
              }
              repositories(
                first: 5
                orderBy: { field: UPDATED_AT, direction: DESC }
              ) {
                totalCount
                nodes {
                  name
                  url
                  description
                  stargazerCount
                  licenseInfo {
                    name
                  }
                  primaryLanguage {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables,
  )
}

const myPlugin: Plugin = (context, inject) => {
  inject('search', searchGithubUsers)

  context.$search = searchGithubUsers
}

export default myPlugin
