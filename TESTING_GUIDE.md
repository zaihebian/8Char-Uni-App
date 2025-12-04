# Testing Guide - BaZi App with DeepSeek Integration

This guide will help you test the app locally to see the UI and all features.

## Quick Start - Testing the UI

### Step 1: Install Dependencies

```bash
yarn install
# or
npm install
```

### Step 2: Start Development Server

For H5 (Web) testing:
```bash
yarn run dev:h5
```

This will:
- Start a development server (usually on http://localhost:3000)
- Open your browser automatically
- Enable hot-reload (changes update automatically)

### Step 3: Access the App

Open your browser and go to:
- **http://localhost:3000** (or the URL shown in terminal)

## Testing the Features

### 1. Home Page (排盘输入)

1. **Enter your information:**
   - Name (optional)
   - Gender (男/女)
   - Date & Time (click to select)
   - Sect (晚子时处理方式)

2. **Input Methods:**
   - **阴历 (Lunar Calendar)**: Select solar date, shows lunar equivalent
   - **四柱 (Four Pillars)**: Directly input the eight characters

3. **Click "开始排盘"** to calculate

### 2. Detail Page - Four Tabs

After calculation, you'll see 5 tabs:

#### Tab 1: 命主信息 (Personal Information)
- Shows basic personal data
- Date information (solar/lunar)
- Zodiac and constellation

#### Tab 2: 基本命盘 (Basic Chart)
- Four Pillars display
- Ten Gods (十神)
- Nayin (纳音)
- Empty Death (空亡)
- Gods & Demons (神煞)
- Five Elements analysis

#### Tab 3: 专业细盘 (Professional Detailed Chart)
- Advanced analysis
- Major fortune timeline
- Detailed element relationships

#### Tab 4: 在线批命 (Online Fortune Reading)
- Classical references
- Traditional interpretations

#### Tab 5: AI解读 (AI Interpretation) ⭐ NEW
- Click "AI 智能解读" button
- Shows loading state
- Displays AI-generated interpretation
- **Note**: Requires backend API endpoint to work

## Testing AI Interpretation Feature

### Option A: With Backend (Recommended)

1. **Start the backend proxy:**
   ```bash
   cd backend-example
   npm install
   # Create .env file with: DEEPSEEK_API_KEY=your_key_here
   npm start
   ```

2. **Update API URL in app:**
   - The app will use `http://localhost:3000` by default
   - Or set `VITE_API_URL` in `.env.development`

3. **Test in browser:**
   - Calculate BaZi
   - Go to "AI解读" tab
   - Click "AI 智能解读"
   - Wait for interpretation

### Option B: Without Backend (UI Only)

The UI will show but won't get real interpretations:
- Button will show
- Clicking will show error (expected)
- You can see the UI/UX design

## Testing Different Scenarios

### Test with Your Birthday

1. Go to home page
2. Select: July 21, 1987, 6:00 AM
3. Gender: Male
4. Click "开始排盘"
5. Explore all tabs

### Test with Different Dates

Try various dates to see:
- Different zodiac signs
- Different element combinations
- Various Ten Gods patterns

### Test Lunar Calendar Input

1. Select "阴历" mode
2. Pick a date
3. See lunar calendar conversion

### Test Four Pillars Direct Input

1. Select "四柱" mode
2. Directly input the eight characters
3. See instant calculation

## Development Tips

### Hot Reload
- Changes to `.vue` files update automatically
- No need to refresh browser

### Debugging
- Open browser DevTools (F12)
- Check Console for errors
- Network tab shows API calls

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Dependencies error:**
```bash
# Clear and reinstall
rm -rf node_modules
yarn install
```

**API errors:**
- Check backend is running
- Verify API URL in `.env.development`
- Check browser console for CORS errors

## Testing Checklist

- [ ] Home page loads correctly
- [ ] Date picker works
- [ ] BaZi calculation succeeds
- [ ] All 5 tabs display correctly
- [ ] Four Pillars show correctly
- [ ] Ten Gods display properly
- [ ] AI interpretation tab visible
- [ ] AI button clickable (even if API fails)
- [ ] Error messages display properly
- [ ] Responsive design works on different screen sizes

## Next Steps After Testing

1. **If UI looks good:**
   - Set up backend with DeepSeek API key
   - Test full AI interpretation flow
   - Deploy to production

2. **If you find issues:**
   - Check browser console
   - Review error messages
   - Check network requests
   - Verify dependencies installed

## Screenshots to Check

When testing, verify these UI elements:
- ✅ Logo and header
- ✅ Input form layout
- ✅ Tab navigation
- ✅ Four Pillars table
- ✅ Color-coded elements
- ✅ AI interpretation button
- ✅ Loading states
- ✅ Error messages

Enjoy testing! 🎉


