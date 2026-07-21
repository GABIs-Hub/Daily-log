import fs from 'fs';
import path from 'path';
import { fetchUserActivity } from './fetch-activity.js';
import { generateDailySummary, generateWeeklySummary } from './summarize.js';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'GABIs-Hub';

/**
 * Main function to generate README with activity logs
 */
async function generateReadme() {
  try {
    console.log('[generate] Starting README generation...');

    // Fetch activity
    const activities = await fetchUserActivity(GITHUB_USERNAME, 7);

    if (Object.keys(activities).length === 0) {
      console.log('[generate] No activities found for the past week');
      return;
    }

    // Generate summaries for each day
    const dailyEntries = [];
    for (const [date, dayActivity] of Object.entries(activities).sort().reverse()) {
      const summary = await generateDailySummary(dayActivity, date);
      const repoCount = new Set(dayActivity.map(e => e.repo)).size;
      const commitCount = dayActivity.reduce((sum, e) => sum + (e.distinct_size || 1), 0);

      dailyEntries.push({
        date,
        summary,
        repos: repoCount,
        commits: commitCount,
      });
    }

    // Generate weekly summary
    const weeklySummary = await generateWeeklySummary(activities);

    // Build README content
    const readmeContent = buildReadmeContent(dailyEntries, weeklySummary);

    // Write to README
    fs.writeFileSync(path.join(process.cwd(), 'README.md'), readmeContent, 'utf-8');
    console.log('[generate] README.md updated successfully');

  } catch (error) {
    console.error('[generate] Fatal error:', error.message);
    process.exit(1);
  }
}

/**
 * Build the README markdown content
 */
function buildReadmeContent(dailyEntries, weeklySummary) {
  const today = new Date().toISOString().split('T')[0];

  let content = `# Daily Developer Log

> Automatically updated with GitHub activity and AI-powered summaries

## This Week's Summary

${weeklySummary}

---

## Daily Activity

`;

  for (const entry of dailyEntries) {
    const dateObj = new Date(entry.date + 'T00:00:00Z');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    content += `### ${formattedDate}\n\n`;
    content += `**Commits:** ${entry.commits} | **Repositories:** ${entry.repos}\n\n`;
    content += `${entry.summary}\n\n`;
  }

  content += `---\n\n`;
  content += `*Last updated: ${today} at ${new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  })}*\n`;

  return content;
}

// Run the generator
generateReadme();
