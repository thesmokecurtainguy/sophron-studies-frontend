# Git Setup Guide for Sanity CMS Repository

## Current State Analysis

✅ **Confirmed:** `/Users/mcphajomo/Documents/GitHub/sophron-studies-cms-main` is **NOT a Git repository**
- It's just downloaded files (likely a ZIP download)
- No `.git` folder exists
- No remote repository configured

## Step-by-Step Setup Instructions

### Step 1: Get the GitHub Repository URL

You mentioned you have access to the GitHub repo. You'll need the repository URL. It will look like one of these:
- `https://github.com/username/sophron-studies-cms.git` (HTTPS)
- `git@github.com:username/sophron-studies-cms.git` (SSH)

**If you don't know the URL:**
1. Go to GitHub and find the repository
2. Click the green "Code" button
3. Copy the HTTPS or SSH URL

### Step 2: Backup Current Files (Optional but Recommended)

Before deleting the old folder, you might want to backup any local changes:

```bash
# Create a backup folder
cd /Users/mcphajomo/Documents/GitHub
mkdir sophron-studies-cms-backup
cp -r sophron-studies-cms-main/* sophron-studies-cms-backup/
```

### Step 3: Remove the Old Downloaded Folder

```bash
# Navigate to GitHub directory
cd /Users/mcphajomo/Documents/GitHub

# Remove the old downloaded folder
rm -rf sophron-studies-cms-main
```

**Explanation:** Since it's not a Git repo, we'll clone fresh from GitHub.

### Step 4: Clone the Repository

```bash
# Clone the repository (replace REPO_URL with actual URL)
git clone REPO_URL sophron-studies-cms-main

# Example with HTTPS:
# git clone https://github.com/username/sophron-studies-cms.git sophron-studies-cms-main

# Example with SSH:
# git clone git@github.com:username/sophron-studies-cms.git sophron-studies-cms-main
```

**Explanation:** This creates a fresh Git repository with full history and remote tracking.

### Step 5: Navigate into the Repository

```bash
cd sophron-studies-cms-main
```

### Step 6: Check Current Branch and Remote

```bash
# Check what branch you're on (should be 'main' or 'master')
git branch

# Check remote repository
git remote -v

# Check current status
git status
```

**Explanation:** Verify you're connected to the correct remote and on the default branch.

### Step 7: Fetch Latest Changes

```bash
# Fetch all branches and updates from remote
git fetch origin

# Check if you're behind any commits
git status
```

**Explanation:** Ensures you have the latest code before creating your branch.

### Step 8: Create Feature Branch

```bash
# Create and switch to new feature branch
git checkout -b feature/phase-1-faq-schemas

# Verify you're on the new branch
git branch
```

**Explanation:** 
- `-b` flag creates the branch and switches to it
- Branch name follows common naming convention: `feature/description`

### Step 9: Verify Branch Setup

```bash
# Confirm current branch (should show asterisk next to feature branch)
git branch

# Show current branch name
git rev-parse --abbrev-ref HEAD

# Check status
git status
```

**Expected output:**
```
* feature/phase-1-faq-schemas
  main
```

### Step 10: Verify Repository Health

Run these checks to ensure everything is ready:

```bash
# 1. Check repository is clean
git status
# Should show: "nothing to commit, working tree clean"

# 2. Verify remote is configured
git remote -v
# Should show: origin with fetch/push URLs

# 3. Check branch tracking (if applicable)
git branch -vv
# Shows which branches track which remotes

# 4. Verify you can see commit history
git log --oneline -5
# Shows last 5 commits

# 5. Check for uncommitted changes
git diff
# Should be empty (no output)
```

### Step 11: Set Up Branch Protection (Safety Check)

Before pushing, verify which branches are protected:

```bash
# Try to see remote branches
git branch -r

# Check if main/master exists and is protected
# (You won't be able to push to protected branches)
```

**Safety Note:** If `main` or `develop` are protected (which they should be), Git will prevent accidental pushes.

## Complete Command Sequence

Here's the complete sequence in one block (replace `REPO_URL`):

```bash
# Navigate to GitHub directory
cd /Users/mcphajomo/Documents/GitHub

# Remove old downloaded folder
rm -rf sophron-studies-cms-main

# Clone repository
git clone REPO_URL sophron-studies-cms-main

# Enter repository
cd sophron-studies-cms-main

# Fetch latest changes
git fetch origin

# Create feature branch
git checkout -b feature/phase-1-faq-schemas

# Verify setup
git branch
git remote -v
git status
```

## Verification Checklist

After setup, verify:

- [ ] `git branch` shows `* feature/phase-1-faq-schemas`
- [ ] `git remote -v` shows correct repository URL
- [ ] `git status` shows "working tree clean"
- [ ] `git log` shows commit history
- [ ] You can see `schemaTypes/` folder with existing schemas
- [ ] `package.json` exists and looks correct

## Next Steps After Setup

Once your branch is ready:

1. **Copy FAQ schema files** from frontend repo:
   ```bash
   cp /Users/mcphajomo/Documents/GitHub/sophron-studies-frontend-main/src/sanity/schemas/faqCategory.ts \
      /Users/mcphajomo/Documents/GitHub/sophron-studies-cms-main/schemaTypes/faqCategory.ts
   
   cp /Users/mcphajomo/Documents/GitHub/sophron-studies-frontend-main/src/sanity/schemas/faq.ts \
      /Users/mcphajomo/Documents/GitHub/sophron-studies-cms-main/schemaTypes/faq.ts
   ```

2. **Update `schemaTypes/index.ts`** to register the new schemas

3. **Test locally** with `npm run dev`

4. **Commit changes**:
   ```bash
   git add schemaTypes/faqCategory.ts schemaTypes/faq.ts schemaTypes/index.ts
   git commit -m "feat: add FAQ category and FAQ schemas"
   ```

5. **Push feature branch**:
   ```bash
   git push -u origin feature/phase-1-faq-schemas
   ```

6. **Create Pull Request** on GitHub (don't merge directly to main!)

## Safety Reminders

⚠️ **Important:**
- Never push directly to `main` or `develop`
- Always work in feature branches
- Create Pull Requests for review before merging
- Test locally before pushing
- The live Sanity project is separate from Git - schema changes won't affect production until deployed

## Troubleshooting

**If clone fails:**
- Check you have access to the repository
- Verify the URL is correct
- Try HTTPS if SSH fails (or vice versa)
- Check your GitHub authentication

**If branch creation fails:**
- Make sure you're not in a detached HEAD state
- Run `git checkout main` first, then create branch

**If you accidentally commit to main:**
- Don't panic! Create a new branch: `git checkout -b feature/your-feature`
- Cherry-pick your commit: `git cherry-pick <commit-hash>`
- Reset main: `git checkout main && git reset --hard origin/main`

