import whisper
import os
import numpy as np
import subprocess

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
video_path = os.path.join(current_dir, "uploads", "105_precint_officer_a.mp4")
ffmpeg_path = os.path.join(project_root, "ffmpeg", "ffmpeg.exe")

# Print paths for debugging
print(f"Looking for ffmpeg at: {ffmpeg_path}")
print(f"Looking for video at: {video_path}")

def load_audio(file: str, sr: int = 16000):
    """
    Load audio file using ffmpeg and return the waveform data
    """
    if not os.path.exists(ffmpeg_path):
        raise FileNotFoundError(f"ffmpeg not found at {ffmpeg_path}")
    
    cmd = [
        ffmpeg_path,
        "-nostdin",
        "-threads", "0",
        "-i", file,
        "-f", "s16le",
        "-ac", "1",
        "-acodec", "pcm_s16le",
        "-ar", str(sr),
        "-"
    ]
    try:
        out = subprocess.run(cmd, capture_output=True, check=True).stdout
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Failed to load audio: {e.stderr.decode()}") from e
    
    return np.frombuffer(out, np.int16).flatten().astype(np.float32) / 32768.0

model = whisper.load_model("base")

# Check if file exists before transcribing
if os.path.exists(video_path):
    print(f"Processing video file: {video_path}")
    try:
        # First load the audio using our custom function
        audio = load_audio(video_path)
        # Then transcribe the loaded audio data
        result = model.transcribe(audio, fp16=False)
        print(result["text"])
    except Exception as e:
        print(f"Error processing file: {str(e)}")
else:
    print(f"Error: Video file not found at {video_path}")


