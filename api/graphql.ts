import 'isomorphic-fetch'
import { ApolloServer } from 'apollo-server-express'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'
import { print } from 'graphql'
import { Express } from 'express'

require('dotenv').config()

const executor = async ({
  document,
  variables,
}: {
  document: any
  variables: any
}) => {
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

export default async (app: Express) => {
  // @ts-ignore
  const introspectionResult = await introspectSchema(executor)
  const githubSchema = makeRemoteExecutableSchema({
    schema: introspectionResult,
    // @ts-ignore
    executor,
  })

  const server = new ApolloServer({
    schema: githubSchema,
  })

  server.applyMiddleware({ app })
}
