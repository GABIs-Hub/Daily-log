# Setup Guide - Daily Developer Log

## Quick Start (5 minutes)

### Step 1: Get Your GitHub Token

1. Go to GitHub Settings → Personal access tokens (classic)
   - Or visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Daily Log"
4. Select scope: `public_repo` (to read public events)
5. Click "Generate token"
6. Copy the token (you'll only see it once!)

### Step 2: Get Your OpenAI API Key

1. Go to https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Name it "Daily Log"
4. Copy the key

### Step 3: Add Secrets to GitHub Repository

1. Go to your repo: https://github.com/GABIs-Hub/Daily-log
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add two secrets:
   - Name: `OPENAI_API_KEY` | Value: (paste your OpenAI key)
   - `GITHUB_TOKEN` is already provided by GitHub Actions, so you don't need to add it

### Step 4: Test Locally (Optional)

```bash
# Clone the repo
git clone https://github.com/GABIs-Hub/Daily-log.git
cd Daily-log

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your tokens
# GITHUB_TOKEN=ghp_xxxx...
# OPENAI_API_KEY=sk-...

# Run the generator
npm run generate

# Check README.md - it should now have your activity log!
```

### Step 5: Enable Automated Workflow

The workflow runs automatically every day at **9 AM UTC**.

To manually trigger it:
1. Go to your repo
2. Click Actions
3. Click "Daily Developer Log"
4. Click "Run workflow" → "Run workflow"

The README will update in 1-2 minutes!

---

## Customization

### Change the Daily Schedule

Edit `.github/workflows/daily-summary.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # 9 AM UTC
  # Change to:
  # '0 14 * * *'  # 2 PM UTC
  # '30 6 * * *'  # 6:30 AM UTC
  # '0 0 * * 0'   # Sunday midnight UTC
```

Common times:
- `'0 9 * * *'` = 9 AM UTC (3 AM EST)
- `'0 14 * * *'` = 2 PM UTC (8 AM EST)
- `'0 22 * * *'` = 10 PM UTC (4 PM EST)

### Change the Activity Lookback Period

Edit `scripts/generate.js`:

```javascript
const activities = await fetchUserActivity(GITHUB_USERNAME, 7); // Change 7 to different days
// 7 = last 7 days
// 14 = last 14 days
// 30 = last 30 days
```

### Use a Different AI Model

Edit `scripts/summarize.js`:

```javascript
model: openai('gpt-4o-mini'), // Current: fast and cheap

// Options:
// 'gpt-4o-mini'      // Fast, cheap (recommended)
// 'gpt-4o'           // Better quality, more expensive
// 'gpt-4-turbo'      // For complex analysis
```

### Change Your GitHub Username

Edit `scripts/generate.js` or set the environment variable:

```bash
export GITHUB_USERNAME="your-username"
npm run generate
```

---

## Troubleshooting

### "No activities found"
- Make sure you have public repositories
- Push a commit and wait 1-2 minutes for GitHub to update
- Check your GitHub username is correct

### "OpenAI API key is missing"
- Script still works! It falls back to basic stats
- To use AI summaries, add the secret to GitHub: Settings → Secrets → OPENAI_API_KEY

### Workflow not running?
- Check Actions tab for error logs
- Ensure secrets are properly set
- Try manually triggering: Actions → Daily Developer Log → Run workflow

### README not updating?
- Check the Actions tab for errors
- Look at the workflow run details
- Verify the `.github/workflows/daily-summary.yml` file exists

---

## File Structure

```
daily-log/
├── .github/workflows/
│   └── daily-summary.yml          # Automation schedule
├── scripts/
│   ├── fetch-activity.js          # Fetches from GitHub API
│   ├── summarize.js               # AI summaries
│   └── generate.js                # Main generator
├── .env.example                   # Template for env vars
├── package.json                   # Dependencies
├── README.md                       # Your daily log (auto-updated)
└── SETUP.md                        # This file
```

---

## How It Works

1. **GitHub Actions** triggers the workflow (daily or manually)
2. **fetch-activity.js** gets your recent commits from GitHub API
3. **summarize.js** creates AI-powered summaries
4. **generate.js** builds a nice README
5. **Workflow** automatically commits and pushes changes

Each day gets its own section in the README with:
- Date and day of week
- Number of commits
- Number of repositories
- AI summary (or basic stats if API key missing)

---

## Support

If something breaks:
1. Check the GitHub Actions logs (Actions tab)
2. Look at the error messages
3. Review this guide
4. Try running locally: `npm run generate`

---

Enjoy your automated developer log!
