import { mount } from '@vue/test-utils'
import { GithubQuery } from '~/plugins/search'
import index from '~/pages/index.vue'

describe('index', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(index)
    expect(wrapper.vm).toBeTruthy()
  })

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

    const wrapper = mount(index, {
      mocks: {
        $search: searchQuery,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('lindsaykwardell')
    await wrapper.find('button').trigger('click')

    expect(searchQuery.mock.calls).toEqual([['lindsaykwardell']])
  })
})
