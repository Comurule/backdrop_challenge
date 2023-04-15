import { buildSchema } from 'graphql'

export default buildSchema(`
    input UserBankAccountInput {
      user_account_number: String!
      user_bank_code: String!
      user_account_name: String!
    }

    type UserBankAccount {
      user_account_number: String!
      user_bank_code: String!
      user_account_name: String!
    }

    type Mutation {
      addBankAccount(input: UserBankAccountInput): UserBankAccount
    }

    type Query {
      getBankAccountName(account_number: String, bank_code: String): String!
    }
`)
