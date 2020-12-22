import graphql from './graphql'
import express from 'express'

const app = express()

graphql(app)

app.get('/test', (_, res) => {
  res.json({ msg: 'Hello, World' })
})

export default app
