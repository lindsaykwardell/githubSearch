import { Response } from 'express'

const express = require('express')
const graphql = require('./graphql')

const app = express()

graphql(app)

app.get('/test', (_: void, res: Response) => {
  res.json({ msg: 'Hello, World' })
})

module.exports = app
