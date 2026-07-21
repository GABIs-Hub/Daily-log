# GitHub Secrets Setup Guide

Your token name is: **GABI_GITHUB_TOKEN**

## Where to Add It

1. Go to your repo: **github.com/GABIs-Hub/Daily-log**
2. Click **Settings** (top menu)
3. On left side, click **Secrets and variables** → **Actions**
4. Click the green **"New repository secret"** button

## What to Add

You need **2 secrets total**:

### Secret 1: OpenAI Key
- **Name:** `OPENAI_API_KEY`
- **Value:** (paste your OpenAI key starting with `sk-`)

### Secret 2: GitHub Token
- **Name:** `GABI_GITHUB_TOKEN`
- **Value:** (paste your GitHub token starting with `ghp_`)

## How to Create Your GitHub Token

If you don't have a token yet:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Daily-Log`
4. Check this box: **`repo`** (this allows it to access your repositories)
5. Scroll down and click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Come back to your repo secrets and paste it

## Final Check

After adding both secrets, you should see:
- `OPENAI_API_KEY` ✓
- `GABI_GITHUB_TOKEN` ✓

That's it! The workflow will now work.

## Test It

1. Go to your repo
2. Click **Actions** tab
3. Click **"Daily Developer Log"** on the left
4. Click **"Run workflow"** → **"Run workflow"** button
5. Wait 1-2 minutes
6. Your **README.md** will update automatically!
