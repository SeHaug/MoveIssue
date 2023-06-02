
import { Octokit } from "@octokit/rest";
import { myToken } from "./pat";

async function moveIssueToProject() {
  const octokit = new Octokit({
    auth: `${myToken}`,
  });

  const issueNumber = process.env.ISSUE_NUMBER;
  const fromProjectId = "3";
  const toProjectId = "2";
  const milestoneTitle = "operations";

  try {
    // Get the current issue
    const { data: issue } = await octokit.issues.get({
      owner: "SEHAINVIXO",
      repo: "MoveIssue",
      issue_number: issueNumber,
    });

    const milestone = issue.milestone;
    if (milestone && milestone.title === milestoneTitle) {
      const issueId = issue.id;

      // Move the issue to the target project
      await octokit.projects.createCard({
        column_id: toProjectId,
        content_type: "Issue",
        content_id: issueId,
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
