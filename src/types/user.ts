
/** ID of a user */
export type UserId = string & { __hidden: 'UserId' };

export type User = {
  id: UserId
  displayName: string
  username: string
  password: string
}
