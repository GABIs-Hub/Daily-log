import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Fetch recent GitHub events for a user
 * @param {string} username - GitHub username
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} Array of events grouped by date
 */
export async function fetchUserActivity(username, days = 7) {
  try {
    console.log(`[fetch] Fetching activity for @${username} over last ${days} days...`);
    
    const events = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

    if (!events.data || events.data.length === 0) {
      console.log('[fetch] No events found');
      return [];
    }

    // Filter events from the last N days and extract push events
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const pushEvents = events.data
      .filter(event => {
        const eventDate = new Date(event.created_at);
        return eventDate >= cutoffDate && event.type === 'PushEvent';
      })
      .map(event => ({
        date: new Date(event.created_at).toISOString().split('T')[0],
        repo: event.repo.name,
        commits: event.payload.commits || [],
        ref: event.payload.ref,
        size: event.payload.size || 0,
        distinct_size: event.payload.distinct_size || 0,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by date
    const grouped = {};
    pushEvents.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });

    console.log(`[fetch] Found ${pushEvents.length} push events`);
    return grouped;

  } catch (error) {
    console.error('[fetch] Error fetching activity:', error.message);
    throw error;
  }
}

/**
 * Get commit messages for a specific event
 */
export function extractCommitMessages(event) {
  return event.commits
    .map(commit => commit.message.split('\n')[0])
    .filter(Boolean);
}
