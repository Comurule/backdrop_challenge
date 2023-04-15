import { Request } from 'express'
import { UserBankAccountInput } from '../../core/types'
import {
  addUserBankAccount,
  getUserBankAccountName,
} from '../../core/services/account.services'

const validateAccountNumber = (account_number: string) => {
  if (account_number.length !== 10) {
    throw new Error(
      'Inaccurate account number length. Check the account number and try again.'
    )
  }
}

export const addBankAccount = async (
  args: { input: UserBankAccountInput },
  req: Request
) => {
  try {
    if (!req.headers.user_id) throw new Error('Forbidden Route. Pass the user_id header');
    validateAccountNumber(args.input.user_account_number)

    const userId = Number(req.headers.user_id);
    return addUserBankAccount(args.input, userId)
  } catch (error: any) {
    throw error
  }
}

export const getBankAccountName = async (args: {
  account_number: string
  bank_code: string
}) => {
  try {
    validateAccountNumber(args.account_number)

    return getUserBankAccountName(args.account_number, args.bank_code)
  } catch (error: any) {
    throw error
  }
}
