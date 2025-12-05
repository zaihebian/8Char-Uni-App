# Security Guidelines

## ⚠️ IMPORTANT: Never Commit Secrets

This repository should **NEVER** contain:
- API keys (DeepSeek, etc.)
- Passwords
- Access tokens
- Private keys
- `.env` files
- Any files with actual credentials

## Files That Are Ignored

The following files are automatically ignored by `.gitignore`:
- `.env` and `.env.*` files
- `backend-example/.env`
- `node_modules/`
- Test files with real data
- Build outputs

## Before Committing

1. **Check for secrets:**
   ```powershell
   git status
   ```

2. **Verify no .env files are tracked:**
   ```powershell
   git ls-files | findstr "\.env"
   ```

3. **Search for API keys in code:**
   ```powershell
   git grep "sk-" -- "*.js" "*.vue" "*.ps1" "*.md"
   ```

## Setting Up API Keys

API keys should be set via environment variables or `.env` files (which are gitignored):

1. **Backend:** Create `backend-example/.env`:
   ```
   DEEPSEEK_API_KEY=your_actual_key_here
   PORT=3000
   ```

2. **Frontend:** Create `.env.development`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

**Never commit these files!**

## If You Accidentally Committed Secrets

If you accidentally committed secrets:

1. **Remove from git history:**
   ```powershell
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch path/to/file" --prune-empty --tag-name-filter cat -- --all
   ```

2. **Rotate the exposed keys immediately** - Generate new API keys and revoke old ones

3. **Force push (if already pushed):**
   ```powershell
   git push origin --force --all
   ```

## Best Practices

- ✅ Use environment variables
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use placeholder values in documentation
- ✅ Review `git status` before committing
- ❌ Never hardcode API keys
- ❌ Never commit `.env` files
- ❌ Never share API keys in issues or PRs

