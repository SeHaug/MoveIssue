import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";


const testTokenFineGrain = "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";
const testTokenClassic = "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";

const octokitGraphql = graphql.defaults({
  headers: {
    authorization: `Bearer ${testTokenClassic}`,
  },
});


// async function moveIssueToProject() {
//   const octokit = new Octokit({
//     auth: process.env.GITHUB_TOKEN,
//   });

//   // const issueNumber = process.env.GITHUB_EVENT.issue.number;
//   // const fromProjectId = process.env.FROM_PROJECT_ID;
//   // const toProjectId = process.env.TO_PROJECT_ID;
//   // const milestoneTitle = "operations";

//   const issueNumber = 1;
//   const fromProjectId = "PVT_kwHOB9i2Ts4ARCt9";
//   const toProjectId = "PVT_kwHOB9i2Ts4ARCug";
//   const milestoneTitle = "operations";

//   try {
//     // Get the issue details
//     const result = await octokit.issues.get({
//       owner: "SeHaug",
//       repo: "MoveIssue",
//       issue_number: issueNumber,
//     });
//     console.log("got the issue details " + JSON.stringify(result.data))
//     const milestone = result.data.milestone;
//     console.log(milestone);
//     console.log(result.data.project_card?.id)
//     if (milestone && milestone.title === milestoneTitle) {
//       // Move the issue to the target project
//       await octokit.rest.projects.createCard({
//         column_id: toProjectId,
//         content_type: "Issue",
//         content_id: issueNumber,
//       });
//       console.log("moved the issue to target")
//       // Remove the issue from the current project
//       const cardId = result.data.project_card?.id;
//       if (cardId) {
//         await octokit.projects.deleteCard({
//           card_id: cardId,
//         });
//       }
//       console.log("Issue moved to the target project successfully.");
//     } else {
//       console.log("Issue does not have the target milestone. Skipping move to another project.");
//     }
//   } catch (error) {
//     console.error("Error moving issue:", error.message);
//   }
// }

// moveIssueToProject()
// .then((value) => {console.log("issuemoved!! " + value)})
// .catch((error) => console.log("ENDERROR: " + error));

const issueNumber = 1;
const issueId = "PVTI_lAHOB9i2Ts4ARCt9zgHG9B8"
const fromProjectId = "PVT_kwHOB9i2Ts4ARCt9";
const toProjectId = "PVT_kwHOB9i2Ts4ARCug";
const milestoneTitle = "operations";

async function getIssue() {
  const query = `query GetIssueWithStatus {
    viewer {
      login
      projectV2(number: 3) {
        id
        items(first: 100) {
          edges {
            node {
              fieldValues(first: 4) {
                edges {
                  node {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      id
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
              type
              id
            }
          }
        }
      }
    }
  }`

  const query1 = `query getIssueById {
    node(id: "PVT_kwHOB9i2Ts4ARCt9") {
      ... on ProjectV2 {
        items(first: 20) {
          nodes {
            id
            fieldValues(first: 8) {
              nodes {
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldDateValue {
                  date
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
              }
            }
            content {
              ... on DraftIssue {
                title
                body
              }
              ... on Issue {
                title
                assignees(first: 10) {
                  nodes {
                    login
                  }
                }
              }
              ... on PullRequest {
                title
                assignees(first: 10) {
                  nodes {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }`

  const query2 = `query getIssue {
    repository(name: "MoveIssue", owner: "SeHaug") {
      projectV2(number: 3) {
        id
        items(first: 10) {
          edges {
            node {
              id
              fieldValues(first: 5) {
                edges {
                  node {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      id
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          id
                          name
                        }
                      }
                      item {
                        id
                        type
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`
  const response = await octokitGraphql(query);
  console.log(response.viewer.projectV2.items.edges[0].node);
  console.log(response.viewer.projectV2.items.edges[0].node.fieldValues.edges[3])
}

getIssue();