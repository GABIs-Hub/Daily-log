import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * Generate AI summary of daily activity using Vercel AI SDK
 * @param {Object} dayActivity - Activity data for a single day
 * @param {string} date - ISO date string
 * @returns {Promise<string>} AI-generated summary
 */
export async function generateDailySummary(dayActivity, date) {
  try {
    if (!dayActivity || dayActivity.length === 0) {
      return 'No activity recorded.';
    }

    // Build activity context
    const repoStats = {};
    const allMessages = [];

    dayActivity.forEach(event => {
      if (!repoStats[event.repo]) {
        repoStats[event.repo] = {
          commits: 0,
          messages: [],
          branches: new Set(),
        };
      }
      repoStats[event.repo].commits += event.distinct_size || 1;
      repoStats[event.repo].branches.add(event.ref || 'unknown');
      event.commits.forEach(commit => {
        repoStats[event.repo].messages.push(commit.message.split('\n')[0]);
        allMessages.push(commit.message.split('\n')[0]);
      });
    });

    // Format stats for AI
    const statsText = Object.entries(repoStats)
      .map(
        ([repo, stats]) =>
          `- ${repo}: ${stats.commits} commits on ${Array.from(stats.branches).join(', ')}\n` +
          `  Commits: ${stats.messages.slice(0, 3).join('; ')}`
      )
      .join('\n');

    const prompt = `Summarize this developer's GitHub activity for ${date} in 1-2 sentences. Make it friendly and highlight what was accomplished:

Repositories and Activity:
${statsText}

Provide a brief, natural summary (2-3 sentences max).`;

    console.log('[summarize] Generating AI summary...');

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    });

    console.log('[summarize] Summary generated');
    return text;

  } catch (error) {
    console.error('[summarize] Error generating summary:', error.message);
    // Fallback to basic stats if AI fails
    const repoCount = new Set(dayActivity.map(e => e.repo)).size;
    const totalCommits = dayActivity.reduce((sum, e) => sum + (e.distinct_size || 1), 0);
    const repoLabel = repoCount === 1 ? 'repository' : 'repositories';
    return `Made ${totalCommits} commits across ${repoCount} ${repoLabel}.`;
  }
}

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(activities) {
  try {
    const repoSet = new Set();
    const totalCommits = Object.values(activities)
      .flat()
      .reduce((sum, event) => sum + (event.distinct_size || 1), 0);

    Object.values(activities).flat().forEach(e => repoSet.add(e.repo));

    const prompt = `Summarize this week's GitHub activity in 2-3 sentences. Focus on overall productivity:
- Total commits: ${totalCommits}
- Active repositories: ${Array.from(repoSet).join(', ')}
- Days active: ${Object.keys(activities).length}

Keep it concise and motivating.`;

    console.log('[summarize] Generating weekly summary...');

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    });

    return text;

  } catch (error) {
    console.error('[summarize] Error generating weekly summary:', error.message);
    return 'Weekly activity summary.';
  }
}
