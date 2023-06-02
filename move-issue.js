const { Octokit } = require("@octokit/rest");

async function moveIssueToProject() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const issueNumber = process.env.GITHUB_EVENT.issue.number;
  const fromProjectId = process.env.FROM_PROJECT_ID;
  const toProjectId = process.env.TO_PROJECT_ID;
  const milestoneTitle = "TARGET_MILESTONE_TITLE";

  try {
    // Get the issue details
    const { data: issue } = await octokit.issues.get({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      issue_number: issueNumber,
    });

    const milestone = issue.milestone;
    if (milestone && milestone.title === milestoneTitle) {
      // Move the issue to the target project
      await octokit.projects.createCard({
        column_id: toProjectId,
        content_type: "Issue",
        content_id: issueNumber,
      });

      // Remove the issue from the current project
      const cardId = issue.project_card?.id;
      if (cardId) {
        await octokit.projects.deleteCard({
          card_id: cardId,
        });
      }

      console.log("Issue moved to the target project successfully.");
    } else {
      console.log("Issue does not have the target milestone. Skipping move to another project.");
    }
  } catch (error) {
    console.error("Error moving issue:", error.message);
  }
}

moveIssueToProject();

