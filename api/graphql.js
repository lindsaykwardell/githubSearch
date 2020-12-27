import 'isomorphic-fetch'
import { ApolloServer } from 'apollo-server-express'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'
import { print } from 'graphql'

require('dotenv').config()

const executor = async ({ document, variables }) => {
  const query = print(document)
  const fetchResult = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  return fetchResult.json()
}

export default async app => {
  const introspectionResult = await introspectSchema(executor)
  const githubSchema = makeRemoteExecutableSchema({
    schema: introspectionResult,
    executor,
  })

  const server = new ApolloServer({
    schema: githubSchema,
  })

  server.applyMiddleware({ app })
}
