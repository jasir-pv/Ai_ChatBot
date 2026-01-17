# Live Chat Mode Guide

## What is Live Chat Mode?

Live Chat Mode enables continuous, natural voice conversations with the AI avatar. Instead of clicking buttons for each interaction, you can have a flowing conversation similar to talking with a real person.

## How It Works

### The Conversation Loop

1. **You Speak** → Microphone records your voice
2. **AI Transcribes** → Whisper API converts speech to text
3. **AI Responds** → ChatGPT generates a response
4. **AI Speaks** → TTS reads the response aloud with avatar lip-sync
5. **Repeat** → Automatically starts listening again

This creates a continuous conversation flow!

## How to Use Live Mode

### Starting Live Mode

1. Open the app at http://localhost:3000
2. Look for the **"Start Live Chat"** button below the avatar
3. Click the button
4. Allow microphone access if prompted
5. The status changes to **"Listening..."**

### Having a Conversation

**Step 1: Speak**
- When status shows "Listening...", speak your message
- The avatar shows it's listening (breathing animation)
- Speak clearly and at normal pace

**Step 2: Finish Speaking**
- Click the **"Done Speaking"** button when you're finished
- The status changes to "Processing..."

**Step 3: AI Responds**
- Your speech is transcribed and sent to ChatGPT
- The AI generates a response
- Status changes to "Speaking..."
- The avatar's mouth moves with lip-sync
- Audio plays automatically

**Step 4: Continue**
- After the AI finishes speaking (1 second pause)
- Status automatically returns to "Listening..."
- Speak again to continue the conversation
- The loop repeats!

### Stopping Live Mode

- Click the **"Stop Live Chat"** button (red button)
- Live mode ends immediately
- You can return to normal text/voice input

## Visual Indicators

### Status Indicators

| Status | Color | What It Means | What to Do |
|--------|-------|---------------|------------|
| **Listening** | Blue gradient | Microphone is recording | Speak your message |
| **Processing** | Yellow/Orange | Transcribing and getting AI response | Wait |
| **Speaking** | Green | AI is speaking | Listen |

### Avatar States

- **Listening**: Small mouth, gentle pulsing
- **Speaking**: Mouth opens/closes based on audio level (lip-sync)
- **Idle**: Smiling, gentle breathing

### Animation Bar

When active, you'll see an animated sound wave bar indicating the current status.

## Tips for Best Results

### 1. Speak Clearly
- Speak at normal conversational pace
- Avoid background noise
- Don't whisper or shout

### 2. Wait for Your Turn
- Let the AI finish speaking before you speak again
- The system will automatically start listening when ready

### 3. Keep Messages Concise
- Shorter messages work better for natural flow
- The AI responds faster to concise input

### 4. Use in Quiet Environment
- Background noise can affect transcription
- Close windows, turn off fans if possible

### 5. Check Microphone
- Ensure your microphone is working
- Test in browser settings if needed
- Chrome/Edge work best

## Troubleshooting

### "Microphone not working"
**Solution:**
- Check browser permissions
- Allow microphone access
- Try refreshing the page
- Use Chrome or Edge browser

### "Transcription is inaccurate"
**Solution:**
- Speak more clearly
- Reduce background noise
- Check microphone position
- Speak closer to microphone

### "AI doesn't speak automatically"
**Solution:**
- Wait a moment after "Processing" status
- Check browser audio isn't muted
- Verify OpenAI TTS API is working
- Check browser console for errors

### "Loop doesn't continue"
**Solution:**
- Click "Stop Live Chat" and start again
- Refresh the page
- Check all API keys are valid
- Check browser console for errors

### "Audio quality is poor"
**Solution:**
- Check internet connection
- Verify OpenAI API is not rate-limited
- Try different TTS voice in code

## Workflow Comparison

### Traditional Mode
```
1. Type message OR click mic → speak → click stop
2. Send message
3. Wait for AI response
4. Click "Speak" button to hear response
5. Repeat from step 1
```

### Live Chat Mode
```
1. Click "Start Live Chat" (once)
2. Speak → click "Done Speaking"
3. AI responds and speaks automatically
4. Automatically starts listening again
5. Continue conversation naturally!
```

## Use Cases

### Perfect For:
- ✅ Practicing conversations
- ✅ Language learning
- ✅ Hands-free interaction
- ✅ Natural dialogue flow
- ✅ Accessibility (voice-only usage)
- ✅ Interview practice
- ✅ Storytelling sessions

### Not Ideal For:
- ❌ Long monologues (use text input)
- ❌ Code discussions (use text with syntax highlighting)
- ❌ Noisy environments
- ❌ When you need to review before sending

## Advanced Features

### Interrupting Live Mode
- Click "Stop Live Chat" at any time
- Stops current operation immediately
- Returns to normal mode

### Switching Modes
- You can exit Live Mode and use text input
- Start Live Mode again anytime
- All messages are saved in conversation history

### Conversation History
- All Live Mode conversations are saved
- Access them from the sidebar
- They work the same as text conversations

## Technical Details

### What Happens Behind the Scenes

1. **Recording**: MediaRecorder API captures audio in WebM format
2. **Transcription**: Audio sent to OpenAI Whisper API
3. **AI Chat**: Text sent to ChatGPT API with streaming
4. **Speech**: Response sent to OpenAI TTS API
5. **Playback**: Web Audio API plays audio and analyzes frequency
6. **Lip-sync**: Audio level controls avatar mouth animation
7. **Loop**: Automatically restarts recording after 1-second delay

### API Calls Per Conversation Turn

- 1x Whisper API call (transcription)
- 1x ChatGPT API call (response)
- 1x TTS API call (speech generation)

### Performance Notes

- **Transcription**: ~1-3 seconds
- **AI Response**: ~2-5 seconds (depends on length)
- **Speech Generation**: ~2-4 seconds
- **Total per turn**: ~5-12 seconds

## Privacy & Data

### What's Recorded
- Your voice is sent to OpenAI Whisper API
- Transcription is saved in database
- AI responses are saved in database

### What's NOT Recorded
- Raw audio files are not stored
- Audio is processed and discarded
- Only text transcriptions are saved

### Data Storage
- Text messages: Neon PostgreSQL database
- Audio: Not stored (temporary processing only)

## Customization

### Change TTS Voice
Edit `lib/hooks/use-text-to-speech.ts`:
```typescript
// Change default voice
const speak = useCallback(async (text: string, voice: Voice = 'nova') => {
  // 'nova' is female voice
  // Other options: 'alloy', 'echo', 'fable', 'onyx', 'shimmer'
```

### Adjust Listening Restart Delay
Edit `components/ChatContainer.tsx`:
```typescript
// Change delay before restarting (milliseconds)
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
```

### Modify Avatar Animation
Edit `components/Avatar.tsx` to change colors, size, or animations.

## Best Practices

1. **Start Simple**: Try short phrases first
2. **Test Quality**: Check if transcription is accurate
3. **Natural Speech**: Speak as you normally would
4. **Patience**: Wait for AI to finish before speaking
5. **Feedback**: Watch status indicators

## Comparison with Other AI Assistants

### ChatGPT Voice Mode
- Similar continuous conversation
- Live Mode provides visual avatar
- More customizable

### Google Gemini Live
- Similar real-time interaction
- Live Mode uses same OpenAI models
- More transparent (can see transcription)

## Future Enhancements

Potential improvements:
- Voice activity detection (automatic start/stop)
- Real-time streaming (no button clicks)
- Multiple voice options in UI
- Emotion detection
- Background music mode
- Multi-language support

## FAQ

**Q: Can I use it on mobile?**
A: Yes! Works on mobile browsers with microphone access.

**Q: Does it work offline?**
A: No, requires internet for all AI APIs.

**Q: Can I change the AI voice?**
A: Yes, edit the code to use different TTS voices.

**Q: How much does it cost?**
A: Uses OpenAI API credits (Whisper + ChatGPT + TTS per turn).

**Q: Can multiple people use it?**
A: One person at a time per browser session.

**Q: Does it remember context?**
A: Yes! Full conversation history maintained.

## Support

If you encounter issues:
1. Check browser console (F12)
2. Verify all API keys are valid
3. Test microphone in browser settings
4. Review error messages
5. Restart the application

Enjoy your natural conversations with AI! 🎙️🤖
