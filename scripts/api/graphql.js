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

// Event user data for specific programs by login (filtered by event path)
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
    where: {event: {path: {_like: "%piscine-js%"}}, publicUser: {login: {_eq: $login}}}
    order_by: {eventId: asc}
  ) {
    id
    eventId
    level
  }
  piscine_go: event_user(
    where: {event: {path: {_like: "%piscinego%"}}, publicUser: {login: {_eq: $login}}}
    order_by: {eventId: asc}
  ) {
    id
    eventId
    level
  }
  piscine_ai: event_user(
    where: {event: {path: {_like: "%piscine-ai%"}}, publicUser: {login: {_eq: $login}}}
    order_by: {eventId: asc}
  ) {
    id
    eventId
    level
  }
  piscine_rust: event_user(
    where: {event: {path: {_like: "%piscine-rust%"}}, publicUser: {login: {_eq: $login}}}
    order_by: {eventId: asc}
  ) {
    id
    eventId
    level
  }
}`

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

// Event program stats for participant by ID
export const GET_PARTICIPANT_PROGRAM_STATS_BY_ID = /*gql*/`
query GetParticipantProgramStatsById($userId: Int!, $jsPath: String!, $goPath: String!, $aiPath: String!) {
  core: event_user(
    where: {eventId: {_eq: 96}, userId: {_eq: $userId}}
    order_by: {userAuditRatio: desc}
  ) {
    id
    userAuditRatio
    level
  }
  piscine_js: result(
    where: {path: {_eq: $jsPath}, userId: {_eq: $userId}}
    order_by: {createdAt: asc}
  ) {
    grade
    createdAt
  }
  piscine_go: result(
    where: {path: {_eq: $goPath}, userId: {_eq: $userId}}
    order_by: {createdAt: asc}
  ) {
    grade
    createdAt
  }
  piscine_ai: result(
    where: {path: {_eq: $aiPath}, userId: {_eq: $userId}}
    order_by: {createdAt: asc}
  ) {
    grade
    createdAt
  }
}`

export const GET_GAMES_INFO = /*gql*/`
query GetGamesInfo {
  result {
    id
    attrs
    audits_aggregate {
      nodes {
        id
      }
    }
  }
}`