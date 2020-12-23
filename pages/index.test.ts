import { Server } from 'http'
import { render, fireEvent, waitFor, RenderResult } from '@testing-library/vue'
import express from 'express'
import { GithubUser, searchGithubUsers } from '~/plugins/search'
import index from '~/pages/index.vue'
import graphql from '~/api/graphql'

let server: Server

const searchByQuery = async (wrapper: RenderResult, query: string) => {
  const input = wrapper.getByPlaceholderText(/Search GitHub/i)
  await fireEvent.update(input, query)
  const button = wrapper.getByText('Search')
  await fireEvent.click(button)
  Promise.resolve()
}

const queryUserContent = async (wrapper: RenderResult, user: GithubUser) =>
  await waitFor(() => {
    expect(wrapper.queryAllByText(user.name)).toBeTruthy()
    expect(wrapper.queryAllByAltText(`${user.name} avatar`)).toBeTruthy()
    expect(wrapper.queryAllByText(user.login)).toBeTruthy()
    expect(wrapper.queryAllByText(user.bio)).toBeTruthy()
    expect(wrapper.queryAllByText(user.location)).toBeTruthy()
    expect(
      wrapper.queryAllByText(`${user.repositories.totalCount} repositories`),
    ).toBeTruthy()
    expect(
      wrapper.queryAllByText(`${user.starredRepositories.totalCount} stars`),
    ).toBeTruthy()
    expect(
      wrapper.queryAllByText(`${user.followers.totalCount} followers`),
    ).toBeTruthy()
  })

describe('index', () => {
  beforeAll(async () => {
    const app = express()

    await graphql(app)

    server = app.listen(4000)
  })

  afterAll(() => {
    server.close()
  })

  it('searches based on input', async () => {
    const searchQuery = jest.fn((query, pagination) =>
      searchGithubUsers(query, pagination, 'http://localhost:4000/graphql'),
    )

    const wrapper = render(index, {
      mocks: {
        $search: searchQuery,
      },
    })

    const data = await searchGithubUsers(
      'lindsaykwardell',
      {},
      'http://localhost:4000/graphql',
    )

    const user = data.search.nodes[0]

    expect(wrapper.queryByText(user.name)).toBeFalsy()
    await searchByQuery(wrapper, user.login)
    expect(searchQuery.mock.calls).toEqual([[user.login]])
    await queryUserContent(wrapper, user)
  })

  it('correctly paginates between content', async () => {
    const searchQuery = jest.fn((query, pagination) =>
      searchGithubUsers(query, pagination, 'http://localhost:4000/graphql'),
    )

    const wrapper = render(index, {
      mocks: {
        $search: searchQuery,
      },
    })

    await searchByQuery(wrapper, 'lindsay')
    const page1 = await searchGithubUsers(
      'lindsay',
      {},
      'http://localhost:4000/graphql',
    )
    await queryUserContent(wrapper, page1.search.nodes[0])
    const next = wrapper.getByText('Next')
    await fireEvent.click(next)
    const page2 = await searchGithubUsers(
      'lindsay',
      {
        after: page1.search.pageInfo.endCursor,
      },
      'http://localhost:4000/graphql',
    )
    await queryUserContent(wrapper, page2.search.nodes[0])
    await waitFor(() =>
      expect(wrapper.queryByText(page1.search.nodes[0].login)).toBeFalsy(),
    )
    const prev = wrapper.getByText('Previous')
    await fireEvent.click(prev)
    await queryUserContent(wrapper, page1.search.nodes[0])
    await waitFor(() =>
      expect(wrapper.queryByText(page2.search.nodes[0].login)).toBeFalsy(),
    )
    await fireEvent.click(next)
    await waitFor(() => {
      expect(wrapper.queryByText(page1.search.nodes[0].login)).toBeFalsy()
      expect(wrapper.queryByText(page2.search.nodes[0].login)).toBeTruthy()
    })
  })
})
