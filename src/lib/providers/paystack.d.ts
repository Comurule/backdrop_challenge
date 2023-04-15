export type PaystackResponse<T = any> = {
  status: boolean
  message: string
  data?: T
}

export type ResolveAccountNumberPayload = {
  account_number: string
  account_name: string
  bank_id: number
}
