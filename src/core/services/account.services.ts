import * as PaystackProvider from '../../lib/providers/paystack'
import { UserBankAccountInput, UserBankAccount } from '../types'
import getLevenshteinDistance from '../utils/levenshteinDistance'
import { MAX_LEVENSHTEIN_DISTANCE } from '../../config/constants'
import { isSame, toSentenceCase } from '../utils/stringHelpers'
import * as DBService from '../../.dataset/dao'

export const addUserBankAccount = async (
  bankDetails: UserBankAccountInput,
  userId: number
) => {
  const accountName = await PaystackProvider.resolveAccountNumber(
    bankDetails.user_account_number,
    bankDetails.user_bank_code
  )
  if (!accountName)
    throw new Error('Invalid Account details. Check parameters or try again.')

  if (!isSame(accountName, bankDetails.user_account_name)) {
    const checkSimilarityDiff = getLevenshteinDistance(
      accountName,
      bankDetails.user_account_name
    )
    if (checkSimilarityDiff > MAX_LEVENSHTEIN_DISTANCE)
      throw new Error('Invalid Account details. Check parameters or try again.')
  }

  const payload = {
    account_number: bankDetails.user_account_number,
    account_name: bankDetails.user_account_name,
    bank_code: bankDetails.user_bank_code,
  }
  DBService.addAccountDetailsToUser(userId, payload)

  return bankDetails
}

export const getUserBankAccountName = async (
  account_number: string,
  bank_code: string
): Promise<string> => {
  const accountNameFromBank = await PaystackProvider.resolveAccountNumber(
    account_number,
    bank_code
  )
  const savedUser = DBService.getUserByAccountNumber(account_number)
  if (accountNameFromBank === null) {
    if (savedUser) DBService.invalidateUserAccountNumber(account_number)
    throw new Error('Invalid Account details. Check parameters or try again.')
  }

  return savedUser && savedUser.account
    ? savedUser.account.account_name
    : toSentenceCase(accountNameFromBank)
}
