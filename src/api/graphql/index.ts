import type { OptionsData } from 'express-graphql'
import schema from './schema'
import * as resolvers from './resolvers'

export const graphqlConfig = {
  schema: schema,
  rootValue: resolvers,
  graphiql: process.env.NODE_ENV !== 'production',
} as OptionsData
