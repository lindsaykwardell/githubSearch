require('isomorphic-fetch')
const { ApolloServer } = require('apollo-server-express')
const {
  introspectSchema,
  makeRemoteExecutableSchema,
} = require('graphql-tools')
// @ts-ignore
const { print } = require('graphql')

require('dotenv').config()

const executor = async ({
  document,
  variables,
}: {
  document: any
  variables: any
}) => {
  // @ts-ignore
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

module.exports = async (app: Express.Application) => {
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
