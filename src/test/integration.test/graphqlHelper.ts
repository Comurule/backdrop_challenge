import { graphql } from 'graphql'
import { graphqlConfig } from '../../api/graphql'

export const graphqlHelper = async (
  query: string,
  variables?: any,
  user_id?: number
) => {
  return graphql({
    ...graphqlConfig,
    source: query,
    variableValues: variables,
    contextValue: {
      headers: {
        user_id,
      },
    },
  })
}
