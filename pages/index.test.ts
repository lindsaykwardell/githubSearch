import { render, fireEvent, waitFor } from '@testing-library/vue'
import { GithubQuery } from '~/plugins/search'
import index from '~/pages/index.vue'

const user = {
  __typename: 'User',
  id: 'MDQ6VXNlcjMyMjI5MzAw',
  login: 'lindsaykwardell',
  name: 'Lindsay Wardell',
  bio:
    "I'm a Full Stack Developer with experience in Javascript/Typescript, Java, SQL, PHP, and C#. Functional curious (Elm/Elixir).",
  email: '',
  location: 'Portland, OR',
  isHireable: false,
  url: 'https://github.com/lindsaykwardell',
  avatarUrl:
    'https://avatars1.githubusercontent.com/u/32229300?u=8e392c9cbe694d21100b658ddfd185d718fb925e&v=4',
  followers: {
    totalCount: 9,
  },
  starredRepositories: {
    totalCount: 62,
  },
  pinnedItems: {
    nodes: [
      {
        name: 'lindsaykwardell',
        url: 'https://github.com/lindsaykwardell/lindsaykwardell',
        description:
          'Personal profile page, developed with Gridsome (Vue) to be hosted on Netlify.',
        stargazerCount: 0,
        licenseInfo: null,
        primaryLanguage: { color: '#2c3e50', name: 'Vue' },
      },
      {
        name: 'natural-order',
        url: 'https://github.com/lindsaykwardell/natural-order',
        description: 'Sort arrays of strings or objects naturally.',
        stargazerCount: 0,
        licenseInfo: { name: 'MIT License' },
        primaryLanguage: { color: '#2b7489', name: 'TypeScript' },
      },
      {
        name: 'juralen-elm',
        url: 'https://github.com/lindsaykwardell/juralen-elm',
        description: 'Implementation of Juralen in Elm',
        stargazerCount: 1,
        licenseInfo: null,
        primaryLanguage: { color: '#60B5CC', name: 'Elm' },
      },
      {
        name: 'nuxt-github-api',
        url: 'https://github.com/lindsaykwardell/nuxt-github-api',
        description:
          'Source plugin for pulling data into Nuxt from the official GitHub v4 GraphQL API. ',
        stargazerCount: 13,
        licenseInfo: { name: 'MIT License' },
        primaryLanguage: { color: '#f1e05a', name: 'JavaScript' },
      },
      {
        name: 'http-wrapper',
        url: 'https://github.com/lindsaykwardell/http-wrapper',
        description: "Simple Server/Router wrapper around Deno's HTTP module",
        stargazerCount: 6,
        licenseInfo: { name: 'MIT License' },
        primaryLanguage: { color: '#2b7489', name: 'TypeScript' },
      },
      {
        name: 'hlc-nuxt',
        url: 'https://github.com/lindsaykwardell/hlc-nuxt',
        description: null,
        stargazerCount: 0,
        licenseInfo: null,
        primaryLanguage: { color: '#2c3e50', name: 'Vue' },
      },
    ],
  },
  repositories: {
    totalCount: 62,
    nodes: [
      {
        name: 'githubSearch',
        url: 'https://github.com/lindsaykwardell/githubSearch',
        description: null,
        stargazerCount: 0,
        licenseInfo: null,
        primaryLanguage: { color: '#2b7489', name: 'TypeScript' },
      },
      {
        name: 'lindsaykwardell',
        url: 'https://github.com/lindsaykwardell/lindsaykwardell',
        description:
          'Personal profile page, developed with Gridsome (Vue) to be hosted on Netlify.',
        stargazerCount: 0,
        licenseInfo: null,
        primaryLanguage: { color: '#2c3e50', name: 'Vue' },
      },
      {
        name: 'hlc-nuxt',
        url: 'https://github.com/lindsaykwardell/hlc-nuxt',
        description: null,
        stargazerCount: 0,
        licenseInfo: null,
        primaryLanguage: { color: '#2c3e50', name: 'Vue' },
      },
      {
        name: 'juralen-elm',
        url: 'https://github.com/lindsaykwardell/juralen-elm',
        description: 'Implementation of Juralen in Elm',
        stargazerCount: 1,
        licenseInfo: null,
        primaryLanguage: { color: '#60B5CC', name: 'Elm' },
      },
      {
        name: 'nuxt-github-api',
        url: 'https://github.com/lindsaykwardell/nuxt-github-api',
        description:
          'Source plugin for pulling data into Nuxt from the official GitHub v4 GraphQL API. ',
        stargazerCount: 13,
        licenseInfo: { name: 'MIT License' },
        primaryLanguage: { color: '#f1e05a', name: 'JavaScript' },
      },
      {
        name: 'FreedomWriter',
        url: 'https://github.com/lindsaykwardell/FreedomWriter',
        description: null,
        stargazerCount: 0,
        licenseInfo: { name: 'MIT License' },
        primaryLanguage: null,
      },
    ],
  },
}

describe('index', () => {
  test('searches based on input', async () => {
    const searchQuery = jest.fn(
      async (_: string): Promise<GithubQuery> => {
        return await {
          search: {
            userCount: 1,
            pageInfo: {
              startCursor: 'Y3Vyc29yOjE=',
              endCursor: 'Y3Vyc29yOjE=',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            nodes: [user],
          },
        }
      },
    )

    const wrapper = render(index, {
      mocks: {
        $search: searchQuery,
      },
    })
    expect(wrapper.queryByText(user.name)).toBeFalsy()
    const input = wrapper.getByPlaceholderText(/Search GitHub/i)
    await fireEvent.update(input, user.login)
    const button = wrapper.getByText('Search')
    await fireEvent.click(button)
    expect(searchQuery.mock.calls).toEqual([[user.login]])
    await waitFor(() => {
      expect(wrapper.queryByText(user.name)).toBeTruthy()
      expect(wrapper.queryByAltText(`${user.name} avatar`)).toBeTruthy()
      expect(wrapper.queryByText(user.login)).toBeTruthy()
      expect(wrapper.queryByText(user.bio)).toBeTruthy()
    })
  })
})
