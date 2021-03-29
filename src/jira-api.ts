import fetch from 'isomorphic-fetch'
import uniqid from 'uniqid'

const state = uniqid()

const client_id = 'SR3R4Kk89tnhoAJIhLfx5dqQA6zgntSJ'
const client_secret =
  'iJtUR3bIZ2_JNxW5FbdoLvPLWXSvwbHUzAbo5Xf9auY6SiH_GSUrV_XnaMWb4Aqv' // TODO move this to a secret.yml file and read from that file.
const redirect_url = 'https://github.com/dinesh94singh'
const scope = 'read:jira-work'
const audience = 'api.atlassian.com'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getAccessToken = async () => {
  const authCodebody = {
    audience,
    client_id,
    client_secret,
    scope,
    state,
    redirect_url, // TODO: make this to the hosted url
    response_type: 'code',
    promt: 'consent'
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getAuthCode = async () => {
    const response = await fetch('https://auth.atlassian.com/authorize?', {
      method: 'POST',
      body: JSON.stringify(authCodebody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  const code = await getAuthCode()

  // eslint-disable-next-line no-console
  console.log('Code is ', code)

  const jwtBody = {
    client_id,
    client_secret,
    code,
    redirect_url // TODO: make this to the hosted url
  }

  return await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify(jwtBody),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getIssueDetails = (url: string) => {
  // example url: https://api/atlassian.com/jira/rest/api/latest/issue/{issueName}
  const token = getAccessToken()
  const authToken = `Bearer ${token}`
  return async () => {
    return await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authToken
      }
    })
  }
}

// console.log(getIssueDetails(''))

export default getIssueDetails
