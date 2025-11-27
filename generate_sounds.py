#!/usr/bin/env python3
"""
Generate sound effects for Gumball Times Table game
Creates explosion and impact sounds using wave synthesis
"""

import wave
import math
import os
import struct
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Create assets/sounds directory if it doesn't exist
os.makedirs('assets/sounds', exist_ok=True)

def generate_sine_wave(frequency, duration, sample_rate=44100):
    """Generate a pure sine wave"""
    samples = []
    num_samples = int(sample_rate * duration)
    for i in range(num_samples):
        t = i / sample_rate
        sample = math.sin(2 * math.pi * frequency * t)
        samples.append(sample)
    return samples

def generate_noise(duration, sample_rate=44100):
    """Generate white noise"""
    import random
    samples = []
    num_samples = int(sample_rate * duration)
    for _ in range(num_samples):
        samples.append(random.uniform(-1, 1))
    return samples

def apply_envelope(samples, attack=0.01, decay=0.1, sustain_level=0.3, release=0.2, sample_rate=44100):
    """Apply ADSR envelope to samples"""
    duration = len(samples) / sample_rate

    attack_samples = int(attack * sample_rate)
    decay_samples = int(decay * sample_rate)
    release_samples = int(release * sample_rate)
    sustain_samples = len(samples) - attack_samples - decay_samples - release_samples

    envelope = []

    # Attack
    for i in range(attack_samples):
        envelope.append(i / attack_samples)

    # Decay
    for i in range(decay_samples):
        envelope.append(1.0 - (i / decay_samples) * (1.0 - sustain_level))

    # Sustain
    envelope.extend([sustain_level] * sustain_samples)

    # Release
    for i in range(release_samples):
        envelope.append(sustain_level * (1.0 - i / release_samples))

    return [s * e for s, e in zip(samples, envelope)]

def generate_explosion(duration=0.3, sample_rate=44100):
    """Generate explosion sound with pitch sweep"""
    samples = []
    num_samples = int(sample_rate * duration)

    for i in range(num_samples):
        t = i / sample_rate
        progress = t / duration

        # Pitch sweep from high to low
        start_freq = 800
        end_freq = 100
        freq = start_freq - (start_freq - end_freq) * progress

        # Add noise component that decays
        noise = __import__('random').uniform(-1, 1) * (1 - progress)

        # Sine wave component
        sine = math.sin(2 * math.pi * freq * t)

        # Combine sine and noise with fade
        sample = (sine * 0.7 + noise * 0.3) * (1 - progress)
        samples.append(sample)

    return samples

def generate_impact(duration=0.2, sample_rate=44100):
    """Generate impact/hit sound with low frequency"""
    samples = []
    num_samples = int(sample_rate * duration)

    for i in range(num_samples):
        t = i / sample_rate
        progress = t / duration

        # Low frequency impact (bass)
        base_freq = 150
        sample = math.sin(2 * math.pi * base_freq * t)

        # Exponential decay envelope
        envelope = math.exp(-5 * progress)

        samples.append(sample * envelope * 0.8)

    return samples

def samples_to_wav(samples, filename, sample_rate=44100):
    """Convert sample list to WAV file"""
    # Normalize samples to prevent clipping
    max_sample = max(abs(s) for s in samples) if samples else 1
    if max_sample > 0:
        samples = [s / max_sample * 0.95 for s in samples]

    # Convert to 16-bit signed integers
    frames = struct.pack('<' + 'h' * len(samples), *[int(s * 32767) for s in samples])

    # Write WAV file
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(frames)

    print(f"[+] Created: {filename}")

def convert_wav_to_mp3(wav_file, mp3_file):
    """Convert WAV to MP3 using FFmpeg if available"""
    import subprocess
    try:
        subprocess.run(['ffmpeg', '-i', wav_file, '-q:a', '9', mp3_file, '-y'],
                       capture_output=True, check=False)
        if os.path.exists(mp3_file):
            os.remove(wav_file)
            print(f"[+] Converted to MP3: {mp3_file}")
            return True
    except FileNotFoundError:
        print(f"[!] FFmpeg not found, keeping WAV file: {wav_file}")
    return False

# Generate explosion sounds
print("Generating explosion sounds...")
for i in range(1, 4):
    filename = f'assets/sounds/explosion{i}.mp3'
    wav_file = filename.replace('.mp3', '.wav')

    # Slightly different explosion each time
    duration = 0.3 + (i * 0.05)
    samples = generate_explosion(duration=duration)
    samples_to_wav(samples, wav_file)

    # Try to convert to MP3
    if not convert_wav_to_mp3(wav_file, filename):
        # If FFmpeg not available, rename to use WAV instead
        os.rename(wav_file, filename.replace('.mp3', '.wav'))

# Generate impact sounds
print("\nGenerating impact sound...")
filename = 'assets/sounds/impact.mp3'
wav_file = filename.replace('.mp3', '.wav')
samples = generate_impact(duration=0.2)
samples_to_wav(samples, wav_file)

if not convert_wav_to_mp3(wav_file, filename):
    os.rename(wav_file, filename.replace('.mp3', '.wav'))

print("\n[SUCCESS] Sound generation complete!")
print("Files created in assets/sounds/")
print("Note: If you don't have FFmpeg, WAV files will be created instead.")
print("You can convert them to MP3 later using an audio converter.")
