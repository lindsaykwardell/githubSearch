import { render, fireEvent } from '@testing-library/vue'
import { GithubQuery } from '~/plugins/search'
import index from '~/pages/index.vue'

describe('index', () => {
  test('searches based on input', async () => {
    const searchQuery = jest.fn(
      async (_: string): Promise<GithubQuery> => {
        return await {
          search: {
            nodes: [
              {
                __typename: 'User',
                name: 'Lindsay Wardell',
              },
            ],
          },
        }
      },
    )

    const wrapper = render(index, {
      mocks: {
        $search: searchQuery,
      },
    })

    const input = wrapper.getByPlaceholderText(/Search GitHub/i)
    await fireEvent.update(input, 'lindsaykwardell')
    const button = wrapper.getByText('Search')
    await fireEvent.click(button)

    expect(searchQuery.mock.calls).toEqual([['lindsaykwardell']])
  })
})
