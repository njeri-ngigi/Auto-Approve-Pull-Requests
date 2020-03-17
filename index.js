const github = require("@actions/github");
const core = require("@actions/core");
const SKIPPED_BRANCH = "skip";
const SKIPPED_BRANCH_LENGTH = 4;

async function run() {
  try {
    const token = core.getInput("token", { required: true });
    const client = new github.GitHub(token);
    const { pull_request: pr } = github.context.payload;
    if (!pr) {
      throw new Error("Event payload missing `pull_request`");
    }
    core.debug(`Creating approving review for pull request #${pr.number}`);
    if (
      typeof pr.head.ref === "string" &&
      pr.head.ref.length > SKIPPED_BRANCH_LENGTH &&
      pr.head.ref.slice(0, SKIPPED_BRANCH_LENGTH) === SKIPPED_BRANCH
    ) {
      await client.pulls.createReview({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: pr.number,
        event: "APPROVE"
      });
    }
    core.debug(`Approved pull request #${pr.number}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();