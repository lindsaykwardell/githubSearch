import 'isomorphic-fetch'
import app from './api'

let server

describe('GraphQL API', () => {
  beforeAll(() => {
    server = app.listen(4000)
  })

  afterAll(() => {
    server.close()
  })

  it('accepts a basic query', async () => {
    const res = await (await fetch('http://localhost:4000/test')).json()

    expect(res.msg).toEqual('Hello, World')
  })
})
