from pathlib import Path
from openai import OpenAI

client = OpenAI(api_key="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")
speech_file_path = Path(__file__).parent / "speech.mp3"

with client.audio.speech.with_streaming_response.create(
    model="gpt-4o-mini-tts",
    voice="coral",
    input="Today is a wonderful day to build something people love!",
    instructions="Speak in a cheerful and positive tone.",
) as response:
    response.stream_to_file(speech_file_path)