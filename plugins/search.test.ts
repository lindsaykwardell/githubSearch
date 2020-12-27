import 'isomorphic-fetch'
import { Server } from 'http'
import express from 'express'
import { searchGithubUsers } from './search'
import graphql from '~/api/graphql'

let server: Server

describe('search.ts', () => {
  beforeAll(async () => {
    const app = express()

    await graphql(app)

    server = app.listen(4000)
  })

  afterAll(() => {
    server.close()
  })

  it('searches Github', async () => {
    const res = await searchGithubUsers(
      'lindsaykwardell',
      {},
      'http://localhost:4000/graphql',
    )

    expect(res.search.nodes[0].login).toEqual('lindsaykwardell')
  })
})
