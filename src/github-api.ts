import * as core from '@actions/core'
import * as github from '@actions/github'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getActionContext = async () => {
  core.startGroup('Context')

  const config = {
    actionName: 'JIRA Reviewer',
    actionRepoURL: 'https://github.com/dinesh94singh/JIRA-Reviewer',
    label: core.getInput('check_issues'),
    keywords: core
      .getInput('keywords')
      .trim()
      .split(',')
      .map((kw: string) => kw.trim())
  }

  const github_token = '' // TODO: move this to env file
  const client = github.getOctokit(github_token)

  const {issue, repo} = github.context
  let pr_info

  if (issue?.number) {
    pr_info = await (
      await client.issues.get({
        ...repo,
        issue_number: issue.number
      })
    ).data

    // eslint-disable-next-line no-console
    console.log(pr_info) // TODO: read pr_info and get jira api and call the jira_api file with the url
    // TODO: After retrieving jira info, check for labels and fix_versions
  }

  return {
    client,
    config,
    repo,
    pr_info
  }
}

export default getActionContext
