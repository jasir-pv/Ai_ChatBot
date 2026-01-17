# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] OpenAI API key
- [ ] Neon DB account

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, OpenAI SDK, Drizzle ORM, and more.

### 2. Configure Environment Variables

Create a `.env` file in the root directory (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and fill in your credentials:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=16384

# Neon DB Configuration
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Getting Your OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in `.env`

#### Getting Your Neon DB URL:
1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project
4. Copy the connection string from the dashboard
5. Paste it as `DATABASE_URL` in `.env`

### 3. Set Up Database

Run these commands to create your database schema:

```bash
# Generate migration files
npm run db:generate

# Apply migrations to your database
npm run db:push
```

You should see output confirming the tables were created:
- `conversations` table
- `messages` table

### 4. Start Development Server

```bash
npm run dev
```

Open your browser to http://localhost:3000

You should see the AI Avatar Chat interface!

## Testing the Features

### Test Text Chat
1. Type a message in the input box
2. Click Send or press Enter
3. Watch the streaming response appear
4. The conversation is automatically saved

### Test Voice Input
1. Click the microphone icon
2. Allow microphone access when prompted
3. Speak your message
4. Click the stop button
5. Wait for transcription
6. Send the message

### Test Voice Output
1. Receive an AI response
2. Click the "Speak" button on the message
3. Watch the avatar animate with lip-sync
4. The avatar's mouth moves with the audio level

### Test Conversation History
1. Click "New Chat" to start a new conversation
2. Send some messages
3. Create another new chat
4. Click on previous conversations in the sidebar
5. Your messages are preserved

### Test Theme Toggle
1. Click the sun/moon icon in the top-right
2. Theme switches between light and dark mode
3. Preference is saved to localStorage

## Troubleshooting

### Issue: "OPENAI_API_KEY is not set"
**Solution**: Make sure your `.env` file exists and contains a valid API key.

### Issue: "DATABASE_URL is not set"
**Solution**: Ensure you have the Neon DB connection string in `.env`.

### Issue: "Failed to fetch conversations"
**Solution**:
- Check that `npm run db:push` completed successfully
- Verify your DATABASE_URL is correct
- Check Neon dashboard to confirm database is active

### Issue: Microphone not working
**Solution**:
- Browser needs HTTPS or localhost
- Check browser permissions for microphone
- Ensure no other app is using the microphone

### Issue: Audio not playing
**Solution**:
- Check browser audio permissions
- Verify your OpenAI API key has TTS access
- Check browser console for errors

### Issue: Build errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Production Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file
   - Redeploy for changes to take effect

### Important for Production

1. **Set Production DATABASE_URL**
   - Use the Neon production connection string
   - Enable connection pooling

2. **Secure Your API Keys**
   - Never commit `.env` to Git
   - Use Vercel's environment variable encryption
   - Rotate keys periodically

3. **Enable Analytics** (Optional)
   - Vercel Analytics for performance monitoring
   - OpenAI usage tracking

## Development Tips

### Hot Reload
- Any changes to files automatically reload the browser
- API routes restart on change
- Styles update instantly

### Database Changes
```bash
# After modifying schema.ts
npm run db:generate  # Create migration
npm run db:push      # Apply to database
```

### Debugging
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use React DevTools for component inspection
- Use Network tab to inspect API calls

### Code Quality
```bash
# Run linter
npm run lint

# Build for production (checks for errors)
npm run build
```

## What's Next?

1. **Customize the Avatar**
   - Edit `components/Avatar.tsx`
   - Modify colors, animations, or add new states

2. **Adjust AI Settings**
   - Change model in `.env` (e.g., `gpt-4o`, `gpt-4o-mini`)
   - Adjust temperature in `app/api/chat/route.ts`

3. **Add Features**
   - User authentication
   - Conversation sharing
   - Custom avatar selection
   - More TTS voices

4. **Optimize Performance**
   - Add caching
   - Implement rate limiting
   - Optimize database queries

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Open an issue on GitHub
- Check OpenAI documentation: https://platform.openai.com/docs

## Success Checklist

- [ ] Dependencies installed
- [ ] `.env` configured with valid credentials
- [ ] Database schema created
- [ ] Dev server running on http://localhost:3000
- [ ] Chat messages send and receive
- [ ] Voice recording works
- [ ] Text-to-speech works
- [ ] Avatar animates
- [ ] Conversations save and load
- [ ] Theme toggle works

If all items are checked, you're ready to go! 🎉
