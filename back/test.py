import whisper
import os
from dotenv import load_dotenv
import numpy as np
import subprocess
import cv2
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

# Load environment variables
load_dotenv()
HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN')

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
video_path = os.path.join(current_dir, "uploads", "105_precint_officer_a.mp4")
ffmpeg_path = os.path.join(project_root, "ffmpeg", "ffmpeg.exe")
output_file = os.path.join(current_dir, "video_analysis.txt")

# Set up custom cache directory
cache_dir = os.path.join(current_dir, "model_cache")
os.makedirs(cache_dir, exist_ok=True)

def format_timestamp(seconds):
    """Convert seconds to HH:MM:SS format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

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

class VideoEvent:
    def __init__(self, timestamp, transcript="", visual_desc=""):
        self.timestamp = timestamp
        self.transcript = transcript
        self.visual_desc = visual_desc
        
    def format_summary(self):
        return f"[{self.timestamp}]\n" \
               f"Speech: {self.transcript}\n" \
               f"Visual: {self.visual_desc}\n"

def extract_frames(video_path, interval=1):
    """Extract frames from video at given interval (in seconds)"""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval)
    frames = []
    timestamps = []
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % frame_interval == 0:
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_pil = Image.fromarray(frame_rgb)
            frames.append(frame_pil)
            timestamps.append(frame_count / fps)
            
        frame_count += 1
    
    cap.release()
    return frames, timestamps

def analyze_frames(frames):
    """Analyze frames using BLIP"""
    try:
        # Print system information
        print(f"CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"CUDA device: {torch.cuda.get_device_name(0)}")
        else:
            print("Running on CPU")
            
        # Using simpler BLIP model
        model_name = "Salesforce/blip-image-captioning-base"
        print(f"Loading {model_name}...")
            
        processor = BlipProcessor.from_pretrained(
            model_name, 
            token=HUGGINGFACE_TOKEN,
            cache_dir=cache_dir
        )
        print("Processor loaded successfully")
        
        # Force CPU usage since CUDA is not available
        device = "cpu"
        dtype = torch.float32
        
        model = BlipForConditionalGeneration.from_pretrained(
            model_name,
            torch_dtype=dtype,
            token=HUGGINGFACE_TOKEN,
            cache_dir=cache_dir
        ).to(device)
        print(f"Model loaded successfully on {device} with {dtype}")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise
    
    descriptions = []
    for frame in frames:
        inputs = processor(frame, return_tensors="pt").to(model.device)
        output = model.generate(
            **inputs,
            max_new_tokens=50,
            do_sample=False
        )
        descriptions.append(processor.decode(output[0], skip_special_tokens=True))
    
    return descriptions

# Main execution
model = whisper.load_model("base")

if os.path.exists(video_path):
    print(f"Processing video file: {video_path}")
    try:
        # Audio transcription
        print("Loading audio...")
        audio = load_audio(video_path)
        print("Transcribing audio...")
        result = model.transcribe(audio, fp16=False)
        
        # Video frame analysis
        print("Extracting frames...")
        frames, frame_timestamps = extract_frames(video_path, interval=5)  # Extract frame every 5 seconds
        print("Analyzing frames...")
        frame_descriptions = analyze_frames(frames)
        
        # Combine results
        events = []
        for segment, timestamp, description in zip(result["segments"], frame_timestamps, frame_descriptions):
            event = VideoEvent(
                timestamp=format_timestamp(timestamp),
                transcript=segment["text"],
                visual_desc=description
            )
            events.append(event)
            print(event.format_summary())
        
        # Save to text file
        print(f"Saving output to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Video Analysis: {os.path.basename(video_path)}\n")
            f.write("=" * 50 + "\n\n")
            for event in events:
                f.write(event.format_summary())
                f.write("\n" + "-" * 30 + "\n")
            
            # Add full transcript at the end
            f.write("\n\nFULL TRANSCRIPT\n")
            f.write("=" * 50 + "\n\n")
            for segment in result["segments"]:
                f.write(f"[{format_timestamp(segment['start'])} - {format_timestamp(segment['end'])}] {segment['text']}\n")
                
        print(f"Analysis complete! Output saved to {output_file}")
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        print(traceback.format_exc())
else:
    print(f"Error: Video file not found at {video_path}")


