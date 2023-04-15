import { graphqlHelper } from './graphqlHelper'
import { saveUser, getUserByName } from '../../.dataset/dao'
import {
  savedBankDetails,
  unSavedBankDetails,
} from '../../config/test.variables'

let s1: any, s2: any, s3: any
beforeAll(async () => {
  s1 = saveUser({ name: 'someone' })
  s2 = saveUser({ name: 'someone1' })
  s3 = saveUser({ name: 'someone2' })
})

const getBankAccountQuery = `query 
getBankAccountName($account_number: String!, $bank_code: String!) {
  getBankAccountName(account_number: $account_number, bank_code: $bank_code) 
}`

const addBankAccountMutation = `mutation addBankAccount(
  $account_number: String!, 
  $bank_code: String!, 
  $account_name: String!
) {
  addBankAccount(input: {
    user_account_number: $account_number, 
    user_bank_code: $bank_code, 
    user_account_name: $account_name
  }) {
    user_account_number
    user_bank_code
    user_account_name
  }
}`

describe('Account GraphQL API', () => {
  describe('addBankAccount', () => {
    it('adds the account to the user record iff all requirements are met.', async () => {
      const response = await graphqlHelper(
        addBankAccountMutation,
        {
          ...savedBankDetails,
          account_name: savedBankDetails.account_name.slice(0, -1),
        },
        s1.user_id
      )

      expect(response.data?.addBankAccount).not.toBeNull()

      const user = getUserByName(s1.name)
      expect(user).not.toBeNull()
      expect(user?.is_verified).toBeTruthy()
      expect(user?.account?.account_number).toBe(
        savedBankDetails.account_number
      )
    })

    it('throws error when the Levenshtein Distance between the provided account name and that of paystack is greater than 2.', async () => {
      const response = await graphqlHelper(
        addBankAccountMutation,
        {
          ...unSavedBankDetails,
          account_name: unSavedBankDetails.account_name.slice(0, -3),
        },
        s2.user_id
      )

      expect(response.data?.addBankAccount).toBeNull()
      expect(response.errors).toBeDefined()

      const user = getUserByName(s2.name)
      expect(user).not.toBeNull()
      expect(user?.is_verified).toBeFalsy()
      expect(user?.account?.account_number).not.toBe(
        savedBankDetails.account_number
      )
    })

    it('throws validation error for any missing field.', async () => {
      const response = await graphqlHelper(
        addBankAccountMutation,
        {
          ...savedBankDetails,
          account_number: null,
        },
        s2.user_id
      )

      expect(response.data?.addBankAccount).toBeUndefined()
      expect(response.errors).toBeDefined()

      const user = getUserByName(s2.name)
      expect(user).not.toBeNull()
      expect(user?.is_verified).toBeFalsy()
      expect(user?.account?.account_number).not.toBe(
        savedBankDetails.account_number
      )
    })

    it('throws error for invalid account details.', async () => {
      const response = await graphqlHelper(
        addBankAccountMutation,
        {
          ...savedBankDetails,
          bank_code: '087',
        },
        s2.user_id
      )

      expect(response.data?.addBankAccount).toBeNull()
      expect(response.errors).toBeDefined()

      const user = getUserByName(s2.name)
      expect(user).not.toBeNull()
      expect(user?.is_verified).toBeFalsy()
      expect(user?.account?.account_number).not.toBe(
        savedBankDetails.account_number
      )
    })

    it('should be protected, throws error for invalid user id.', async () => {
      const response = await graphqlHelper(
        addBankAccountMutation,
        savedBankDetails,
        10
      )

      expect(response.data?.addBankAccount).toBeNull()
      expect(response.errors).toBeDefined()
    })
  })

  describe('getBankAccountName', () => {
    it("gets the saved user's account name.", async () => {
      const response = await graphqlHelper(
        getBankAccountQuery,
        savedBankDetails
      )

      expect(response.data).toBeDefined()
      expect(response.data?.getBankAccountName).toBe(
        savedBankDetails.account_name.slice(0, -1)
      )
    })

    it('gets the paystack account name for unsaved account in sentence case.', async () => {
      const response = await graphqlHelper(
        getBankAccountQuery,
        unSavedBankDetails
      )

      expect(response.data).toBeDefined()
      expect(response.data?.getBankAccountName).toBe(
        unSavedBankDetails.account_name
      )
    })

    it('throws validation error for any missing field.', async () => {
      const response = await graphqlHelper(getBankAccountQuery, {
        ...savedBankDetails,
        account_number: undefined,
      })

      expect(response.data?.getBankAccountName).toBeUndefined()
      expect(response.errors).toBeDefined()
    })

    it('throws error for incorrect account details.', async () => {
      const response = await graphqlHelper(getBankAccountQuery, {
        ...savedBankDetails,
        account_number: '0800000000',
      })

      expect(response.data?.getBankAccountName).toBeUndefined()
      expect(response.errors).toBeDefined()
    })
  })
})
