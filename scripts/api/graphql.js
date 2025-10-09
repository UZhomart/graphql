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
query MyFinishedProjectGroupIds($userId: Int!) {
  group(
    where: {
      object: { type: { _eq: "project" } }
      status: { _eq: finished }
      members: { 
        userId: { _eq: $userId }
        accepted: { _eq: true }
      }
    }
  ) {
    id
    status
    object {
      name
      type
    }
  }
}`

export const GET_AUDITS_FOR_GROUPS = /*gql*/`
query GetAuditsForGroups($groupIds: [Int!]) {
  audit(
    where: {
      groupId: { _in: $groupIds }
    }
  ) {
    groupId
    closureType
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

// Progress Line Chart Query
export const GET_USER_TRANSACTIONS = /*gql*/`
query GetUserTransactions($userId: Int!) {
  transaction(where: {userId: {_eq: $userId}, type: {_eq: "xp"}}) {
    amount
    createdAt
    object {
      name
      type
    }
    path
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

// Event user data for specific programs by login
export const GET_EVENT_USER_LEVELS_BY_LOGIN = /*gql*/`
query GetEventUserLevelsByLogin($login: String!) {
  core: event_user(
    where: {eventId: {_eq: 96}, publicUser: {login: {_eq: $login}}}
    order_by: {userAuditRatio: desc}
  ) {
    id
    userAuditRatio
    userLogin
    level
    publicUser {
      id
      lastName
      firstName
    }
  }
  piscine_js: event_user(
    where: {eventId: {_in: [228, 247, 285]}, publicUser: {login: {_eq: $login}}}
    order_by: {level: desc}
  ) {
    id
    userAuditRatio
    userLogin
    level
    publicUser {
      id
      lastName
      firstName
    }
  }
  piscine_go: event_user(
    where: {eventId: {_in: [32, 43, 54, 130, 142, 151, 176, 190, 200, 217, 238, 257]}, publicUser: {login: {_eq: $login}}}
    order_by: {level: desc}
  ) {
    id
    userAuditRatio
    userLogin
    level
    publicUser {
      id
      lastName
      firstName
    }
  }
}`