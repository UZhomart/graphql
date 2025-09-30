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

export const GET_PARTICIPANTS_INFO = /*gql*/`
query ViaUsers {
  user_public_view {
    id
    login
    firstName
    lastName
  }
}`

export const GET_FINISHED_PROJECT_GROUPS = /*gql*/`
query MyFinishedProjectGroupIds {
  group(
    where: {
      object: { type: { _eq: "project" } }
      status: { _eq: finished }
    }
    order_by: { updatedAt: desc }
  ) {
    id
  }
}`

export const GET_TEAMWORK_INFO_V3 = /*gql*/`
query GetTeamworkInfoV3($userId: Int!, $groupIds: [Int!]) {
  group_user(
    where: {
      group: {
        id: { _in: $groupIds }
        members: { 
          userId: { _eq: $userId }
          accepted: { _eq: true }
        }
      }
      accepted: { _eq: true }
    }
    order_by: [{ userId: desc }]
  ) {
    user {
      id
      firstName
      lastName
      login
    }
    group {
      id
      status
      object { 
        id 
        name 
        type 
      }
    }
  }
}`

// Mini Dashboard Queries
export const GET_USER_STATS = /*gql*/`
query GetUserStats($userId: Int!) {
  user(where: {id: {_eq: $userId}}) {
    id
    login
    firstName
    lastName
    auditRatio
    totalDown
    totalUp
    totalUpBonus
    createdAt
    audits_aggregate {
      aggregate { count }
    }
    failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate { count }
    }
  }
}`

export const GET_USER_PROGRESS = /*gql*/`
query GetUserProgress($userId: Int!) {
  progress(where: {userId: {_eq: $userId}, object: {type: {_eq: "project"}}}) {
    grade
    createdAt
    object { 
      name 
      type 
    }
  }
}`

export const GET_USER_TRANSACTIONS = /*gql*/`
query GetUserTransactions($userId: Int!) {
  transaction(where: {userId: {_eq: $userId}, type: {_eq: "xp"}}) {
    amount
    createdAt
  }
}`

// Collaboration Map Query
export const GET_COLLABORATION_DATA = /*gql*/`
query GetCollaborationData($userId: Int!) {
  progress(
    where: {
      object: {type: {_eq: "project"}}
      group: {members: {userId: {_eq: $userId}}}
    }
  ) {
    id
    userId
    grade
    createdAt
    group {
      id
      members {
        userId
        user {
          id
          login
          firstName
          lastName
        }
      }
      object {
        id
        name
        type
      }
    }
  }
}`

// Activity Heatmap Query
export const GET_ACTIVITY_DATA = /*gql*/`
query GetActivityData($userId: Int!) {
  transaction(
    where: {
      userId: {_eq: $userId}
      type: {_eq: "xp"}
    }
    order_by: {createdAt: desc}
  ) {
    id
    amount
    createdAt
    objectId
    attrs
  }
}`