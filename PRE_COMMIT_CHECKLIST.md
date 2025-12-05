# Pre-Commit Checklist

## ✅ Before Committing to GitHub

Run these checks to ensure your repository is safe:

### 1. Check for API Keys
```powershell
git grep -i "sk-" -- "*.js" "*.vue" "*.ps1" "*.md" "*.json" "*.ts"
```
**Should return:** No matches (or only placeholder values like "your_api_key_here")

### 2. Check for .env Files
```powershell
git ls-files | findstr "\.env"
```
**Should return:** Empty (no .env files tracked)

### 3. Verify .gitignore
```powershell
git check-ignore .env.development .env.production backend-example/.env
```
**Should return:** All files listed (meaning they're ignored)

### 4. Review Changed Files
```powershell
git status
```
**Check:** No sensitive files in the list

### 5. Check for Hardcoded Secrets
```powershell
git diff --cached | findstr /i "password\|secret\|key\|token" | findstr /v "your_api_key\|your_key\|placeholder"
```
**Should return:** No actual secrets

## ✅ Safe to Commit

If all checks pass, you're safe to commit:
```powershell
git add .
git commit -m "Your commit message"
git push
```

## ⚠️ If You Find Secrets

1. **STOP** - Don't commit!
2. Remove secrets from files
3. If already committed, see `SECURITY.md` for cleanup instructions
4. Rotate any exposed keys immediately

