import simpleGit from "simple-git";
import moment from "moment";

const git = simpleGit();
const today = moment("2026-05-02").endOf("day");

const cleanFutureCommits = async () => {
    try {
        // Get current branch
        const branch = await git.revparse(["--abbrev-ref", "HEAD"]);
        console.log(`Current branch: ${branch.trim()}`);

        // Get all commits with ISO date format
        const rawOutput = await git.raw(["log", "--format=%H %aI"]);
        const commits = rawOutput.trim().split("\n").filter(line => line.trim());

        console.log(`Total commits: ${commits.length}`);

        let futureHashes = [];

        for (const line of commits) {
            const [hash, dateStr] = line.split(" ");
            const commitDate = moment(dateStr);

            if (commitDate.isAfter(today)) {
                console.log(`Future commit found: ${hash} (${commitDate.format("YYYY-MM-DD")})`);
                futureHashes.push(hash);
            }
        }

        if (futureHashes.length === 0) {
            console.log("✓ No future commits found!");
            return;
        }

        // Get the hash of the first non-future commit (oldest future commit's parent)
        let resetPoint = null;
        for (const line of commits) {
            const [hash, dateStr] = line.split(" ");
            const commitDate = moment(dateStr);

            if (!commitDate.isAfter(today)) {
                resetPoint = hash;
                break;
            }
        }

        if (resetPoint) {
            console.log(`\nResetting to last valid commit: ${resetPoint}`);
            await git.reset(["--hard", resetPoint]);

            // Force push
            console.log("Force pushing to remote...");
            await git.push(["--force-with-lease"]);
            console.log(`✓ Successfully removed ${futureHashes.length} future commits and force-pushed`);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
};

cleanFutureCommits();
