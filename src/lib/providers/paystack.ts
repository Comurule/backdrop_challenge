import { request } from './httpRequest'
import {
  PaystackResponse as Response,
  ResolveAccountNumberPayload,
} from './paystack.d'
import {
  PAYSTACK_SECRET_KEY,
  PAYSTACK_SERVICE_URL,
} from '../../config/constants'

export const resolveAccountNumber = async (
  account_number: string,
  bank_code: string
) => {
  const options = {
    hostname: PAYSTACK_SERVICE_URL,
    path: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  }

  const response: Response<ResolveAccountNumberPayload> = await request(options)

  return response.data ? response.data.account_name : null
}
