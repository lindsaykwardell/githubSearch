const express = require('express')
const graphql = require('graphql')

const app = express()

graphql(app)

app.get('/test', (_, res) => {
  res.json({ msg: 'Hello, World' })
})

export default app
