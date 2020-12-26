import express from 'express'
import graphql from './graphql'

const app = express()

graphql(app)

app.get('/test', (_, res) => {
  res.json({ msg: 'Hello, World' })
})

export default app
