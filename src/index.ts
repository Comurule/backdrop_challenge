import express, { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { saveUser } from './.dataset/dao'
import { graphqlConfig } from './api/graphql'

const app: Application = express()

app.use('/graphql', graphqlHTTP(graphqlConfig))

const PORT = Number(process.env.PORT) || 8000
app.listen(PORT, () => {
  saveUser({ name: 'Initial User' })
  console.log(
    `Running a GraphQL API server at http://localhost:${PORT}/graphql`
  )
})
