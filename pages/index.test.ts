import { render, fireEvent, waitFor } from '@testing-library/vue'
import { GithubQuery } from '~/plugins/search'
import index from '~/pages/index.vue'

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

  test('allows pagination', async () => {
    let page = -1

    const searchQuery = jest.fn(async (_: string) => {
      page = page + 1
      return await pages[page]?.data
    })

    const wrapper = render(index, {
      mocks: {
        $search: searchQuery,
      },
    })

    const input = wrapper.getByPlaceholderText(/Search GitHub/i)
    await fireEvent.update(input, user.login)
    const button = wrapper.getByText('Search')
    await fireEvent.click(button)

    await waitFor(() => {
      expect(wrapper.queryByText(page1.data.search.nodes[0].name)).toBeTruthy()
      expect(
        wrapper.queryByAltText(`${page1.data.search.nodes[0].name} avatar`),
      ).toBeTruthy()
      expect(wrapper.queryByText(page1.data.search.nodes[0].login)).toBeTruthy()
      expect(wrapper.queryByText(page1.data.search.nodes[0].bio)).toBeTruthy()
    })

    const next = wrapper.getByText('Next')
    await fireEvent.click(next)

    await waitFor(() => {
      expect(wrapper.queryByText(page1.data.search.nodes[0].name)).toBeFalsy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].name)).toBeTruthy()
      expect(
        wrapper.queryByAltText(`${page2.data.search.nodes[0].name} avatar`),
      ).toBeTruthy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].login)).toBeTruthy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].bio)).toBeTruthy()
    })

    const prev = wrapper.getByText('Previous')
    await fireEvent.click(prev)

    await waitFor(() => {
      expect(wrapper.queryByText(page2.data.search.nodes[0].name)).toBeFalsy()
      expect(wrapper.queryByText(page1.data.search.nodes[0].name)).toBeTruthy()
      expect(
        wrapper.queryByAltText(`${page1.data.search.nodes[0].name} avatar`),
      ).toBeTruthy()
      expect(wrapper.queryByText(page1.data.search.nodes[0].login)).toBeTruthy()
      expect(wrapper.queryByText(page1.data.search.nodes[0].bio)).toBeTruthy()
    })

    await fireEvent.click(next)

    await waitFor(() => {
      expect(wrapper.queryByText(page1.data.search.nodes[0].name)).toBeFalsy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].name)).toBeTruthy()
      expect(
        wrapper.queryByAltText(`${page2.data.search.nodes[0].name} avatar`),
      ).toBeTruthy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].login)).toBeTruthy()
      expect(wrapper.queryByText(page2.data.search.nodes[0].bio)).toBeTruthy()
    })
  })
})

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

const page1 = {
  data: {
    search: {
      userCount: 2685,
      pageInfo: {
        startCursor: 'Y3Vyc29yOjE=',
        endCursor: 'Y3Vyc29yOjU=',
        hasNextPage: true,
        hasPreviousPage: false,
      },
      nodes: [
        {
          __typename: 'User',
          id: 'MDQ6VXNlcjEwNzQzNTM0',
          login: 'lindsay',
          name: 'Lindsay St John',
          bio: 'Customer Success',
          email: '',
          location: 'Amsterdam, The Netherlands',
          isHireable: false,
          url: 'https://github.com/lindsay',
          avatarUrl:
            'https://avatars2.githubusercontent.com/u/10743534?u=2d07f85477f1527d417a3d7822cdf6f62fb09c32&v=4',
          followers: { totalCount: 20 },
          starredRepositories: { totalCount: 0 },
          pinnedItems: { nodes: [] },
          repositories: {
            totalCount: 11,
            nodes: [
              {
                name: 'lindsay.github.io',
                url: 'https://github.com/lindsay/lindsay.github.io',
                description: 'My personal page',
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: { color: '#563d7c', name: 'CSS' },
              },
              {
                name: 'patchwork-gh-pages-24',
                url: 'https://github.com/lindsay/patchwork-gh-pages-24',
                description: null,
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: null,
              },
              {
                name: 'github-workflow-13',
                url: 'https://github.com/lindsay/github-workflow-13',
                description: null,
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: null,
              },
              {
                name: 'github-for-developers-18',
                url: 'https://github.com/lindsay/github-for-developers-18',
                description: null,
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: null,
              },
              {
                name: 'travel',
                url: 'https://github.com/lindsay/travel',
                description: 'Some sort of travel log.',
                stargazerCount: 0,
                licenseInfo: null,
                primaryLanguage: { color: '#701516', name: 'Ruby' },
              },
            ],
          },
        },
      ],
    },
  },
}

const page2 = {
  data: {
    search: {
      userCount: 2685,
      pageInfo: {
        startCursor: 'Y3Vyc29yOjE=',
        endCursor: 'Y3Vyc29yOjU=',
        hasNextPage: true,
        hasPreviousPage: false,
      },
      nodes: [
        {
          __typename: 'User',
          id: 'MDQ6VXNlcjY0Nw==',
          login: 'progrium',
          name: 'Jeff Lindsay',
          bio: 'Not a bio',
          email: 'progrium@gmail.com',
          location: 'Austin, TX',
          isHireable: false,
          url: 'https://github.com/progrium',
          avatarUrl:
            'https://avatars1.githubusercontent.com/u/647?u=94ad50fe6a3d4963f22dc315439a3cddbf15d32a&v=4',
          followers: { totalCount: 3180 },
          starredRepositories: { totalCount: 486 },
          pinnedItems: {
            nodes: [
              {
                name: 'qtalk',
                url: 'https://github.com/manifold/qtalk',
                description: null,
                stargazerCount: 12,
                licenseInfo: null,
                primaryLanguage: { color: '#f1e05a', name: 'JavaScript' },
              },
              {
                name: 'envy',
                url: 'https://github.com/progrium/envy',
                description: 'Lightweight dev environments with a twist',
                stargazerCount: 318,
                licenseInfo: { name: 'MIT License' },
                primaryLanguage: { color: '#f1e05a', name: 'JavaScript' },
              },
              {
                name: 'dokku',
                url: 'https://github.com/dokku/dokku',
                description:
                  'A docker-powered PaaS that helps you build and manage the lifecycle of applications',
                stargazerCount: 20378,
                licenseInfo: { name: 'MIT License' },
                primaryLanguage: { color: '#89e051', name: 'Shell' },
              },
              {
                name: 'registrator',
                url: 'https://github.com/gliderlabs/registrator',
                description:
                  'Service registry bridge for Docker with pluggable adapters',
                stargazerCount: 4432,
                licenseInfo: { name: 'MIT License' },
                primaryLanguage: { color: '#00ADD8', name: 'Go' },
              },
              {
                name: 'ssh',
                url: 'https://github.com/gliderlabs/ssh',
                description: 'Easy SSH servers in Golang',
                stargazerCount: 1787,
                licenseInfo: {
                  name: 'BSD 3-Clause "New" or "Revised" License',
                },
                primaryLanguage: { color: '#00ADD8', name: 'Go' },
              },
            ],
          },
          repositories: {
            totalCount: 229,
            nodes: [
              {
                name: 'busybox',
                url: 'https://github.com/progrium/busybox',
                description: 'Busybox container with glibc+opkg',
                stargazerCount: 357,
                licenseInfo: { name: 'MIT License' },
                primaryLanguage: { color: '#89e051', name: 'Shell' },
              },
              {
                name: 'termshare',
                url: 'https://github.com/progrium/termshare',
                description: 'Quick and easy terminal sharing.',
                stargazerCount: 314,
                licenseInfo: { name: 'BSD 2-Clause "Simplified" License' },
                primaryLanguage: { color: '#00ADD8', name: 'Go' },
              },
              {
                name: 'entrykit',
                url: 'https://github.com/progrium/entrykit',
                description:
                  'Entrypoint tools for elegant, programmable containers',
                stargazerCount: 414,
                licenseInfo: null,
                primaryLanguage: { color: '#00ADD8', name: 'Go' },
              },
              {
                name: 'localtunnel',
                url: 'https://github.com/progrium/localtunnel',
                description: 'Expose localhost servers to the Internet',
                stargazerCount: 3060,
                licenseInfo: { name: 'MIT License' },
                primaryLanguage: { color: '#00ADD8', name: 'Go' },
              },
              {
                name: 'gitreceive',
                url: 'https://github.com/progrium/gitreceive',
                description: 'Easily accept and handle arbitrary git pushes',
                stargazerCount: 1149,
                licenseInfo: null,
                primaryLanguage: { color: '#89e051', name: 'Shell' },
              },
            ],
          },
        },
      ],
    },
  },
}

const pages = [page1, page2]
