# Sound Effects Guide

The game now includes sound effects for explosions and impacts. Add the following audio files to `assets/sounds/`:

## Explosion Sounds (Required)
Place in `assets/sounds/`:
- `explosion1.mp3` - Explosion sound 1 (5-7 sec burst)
- `explosion2.mp3` - Explosion sound 2 (5-7 sec burst)
- `explosion3.mp3` - Explosion sound 3 (5-7 sec burst)

**Recommendations:**
- Fast, punchy explosion effects (80-150ms duration recommended)
- High energy, satisfying "BOOM" sound
- Slightly different pitch/tone for each variation
- Loud/energetic to match the visual effects

## Impact Sounds (Required)
Place in `assets/sounds/`:
- `impact.mp3` - Deep thud/hit sound for screen shake (200-400ms)

**Recommendations:**
- Low-frequency bass impact sound
- Heavy, weighty feeling to emphasize the hit
- Complements the screen shake animation

## Where to Get Sounds

### Free Sound Effect Resources:
1. **Freesound.org** - Search for "explosion", "impact", "boom"
2. **Zapsplat.com** - High-quality free sound effects
3. **OpenGameArt.org** - Game-specific sound effects
4. **BBC Sound Library** - Creative Commons sounds

### Suggested Search Terms:
- "Cartoon explosion sound"
- "Video game hit sound"
- "Impact boom sound effect"
- "Arcade explosion"

## Integration
Once you add the sound files to `assets/sounds/`:
- Explosion sounds play when projectiles hit (one of 3 randomly selected)
- Impact sound plays with the screen shake effect
- All sounds respect the existing volume settings (0.7)
- Sounds are skipped gracefully if not found (no errors)

## Volume Control
To adjust sound levels, edit `script.js` line 50:
```javascript
audio.volume = 0.7; // Change 0.7 to desired volume (0.0-1.0)
```

## Testing
Test sounds by:
1. Running the game locally
2. Answering questions correctly (triggers explosion + impact)
3. Answering questions incorrectly (triggers opponent explosion + impact)
4. Check browser console for any 404 errors if sounds don't play
