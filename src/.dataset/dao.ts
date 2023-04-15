type IAccount = {
  account_number: string
  account_name: string
  bank_code: string
}

type IUser = {
  user_id: number
  name: string
  is_verified?: boolean
  account?: IAccount
}

type IUserPayload = {
  name: string
  is_verified?: boolean
}

type DB = {
  users: IUser[]
}

const db: DB = {
  users: [],
}

export const saveUser = (payload: IUserPayload): IUser => {
  const hasDuplicate = db.users.some((u) => u.name === payload.name)
  if (hasDuplicate)
    throw new Error(`User, with name ${payload.name}, already exists.`)

  const newUser: IUser = {
    ...payload,
    user_id: db.users.length + 1,
    is_verified: false,
  }
  db.users.push(newUser)

  return newUser
}

export const addAccountDetailsToUser = (
  userId: number,
  payload: IAccount
): IAccount => {
  const hasDuplicate = db.users.some(
    (x) => x.account?.account_number == payload.account_number
  )
  if (hasDuplicate)
    throw new Error(
      `User, with account number ${payload.account_number}, already exists.`
    )

  const userIndex = db.users.findIndex((x) => x.user_id === userId)
  if (userIndex < 0) throw new Error('User not found')

  db.users[userIndex] = {
    ...db.users[userIndex],
    account: payload,
    is_verified: true,
  }

  return payload
}

export const getUserByName = (name: string): IUser | null => {
  const user = db.users.find((x) => x.name === name)

  return user || null
}

export const getUserByAccountNumber = (
  account_number: string
): IUser | null => {
  const user = db.users.find(
    (x) => x.account?.account_number === account_number
  )

  return user || null
}

export const invalidateUserAccountNumber = (
  account_number: string
): boolean => {
  const userIndex = db.users.findIndex(
    (x) => x.account?.account_number === account_number
  )
  if (userIndex < 0) throw new Error('User not found')

  db.users[userIndex] = {
    ...db.users[userIndex],
    is_verified: false,
  }

  return true
}
