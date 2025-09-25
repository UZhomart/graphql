export const GET_USER_INFO = /*gql*/`
{
  user {
    firstName
    lastName
  }
}`

export const GET_USER_PROFILE_INFO = /*gql*/`
{
  user {
    id
    login
    firstName
    lastName
    email
    createdAt
    attrs
  }
}`

export const GET_AUDIT_RATIO_INFO = /*gql*/`
{
  user {
    auditRatio
    totalDown
    totalUp
    totalUpBonus
  }
}`

export const GET_AUDITS_INFO = /*gql*/`
{
  user {
    audits_aggregate(where: {closureType: {_eq: succeeded}}) {
      aggregate {
        count
      }
    }
    failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate {
        count
      }
    }
  }
}`

export const GET_PROJECTS_INFO = /*gql*/`
{
  progress(where: {object: {type: {_eq: "project"}}}) {
    id
    userId
    grade
    createdAt
    updatedAt
    path
    object {
      id
      name
      type
      attrs
    }
  }
}`



export const GET_LEVEL_INFO = /*gql*/`
{
  transaction(
    where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
    order_by: {amount: desc}
    limit: 1
  ) {
    amount
  }
}`

export const GET_LAST_TRANSACTIONS = /*gql*/`
{
  user {
    transactions(where: {type: {_eq: "xp"}}, order_by: {createdAt: desc}) {
      object {
        name
      }
      amount
      createdAt
    }
  }
}`

export const GET_SKILLS = /*gql*/`
{
  user {
    transactions(where: {type: {_nin: ["xp", "level", "up", "down"]}}) {
      type
      amount
    }
  }
}`

export const GET_TRANSACTIONS = /*gql*/`
query GetTransactions($name: String!) {
  event(where: {object: {name: {_eq: $name}}}){
    object{
      events{
            startAt
            endAt
            }
        }
    }
  transaction(
    where: {
      _and: [
        { type: { _eq: "xp" } }, 
        { event: { object: { name: { _eq: $name } } } },
      ]
    },
    order_by: {createdAt: asc}
  ) {
    amount
    object {
      name
    }
    createdAt
  }
}`
