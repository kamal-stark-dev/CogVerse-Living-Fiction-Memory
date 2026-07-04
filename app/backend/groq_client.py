import os
from groq import Groq

_client = Groq(api_key=os.environ["GROQ_API_KEY"])

# llama-3.3-70b-versatile was deprecated by Groq on June 17, 2026.
# openai/gpt-oss-120b is the current recommended general-purpose replacement.
# Verify against https://console.groq.com/docs/models before your demo.
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")


def generate_reply(system_prompt: str, user_question: str) -> str:
    completion = _client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_question},
        ],
        temperature=0.8,
    )
    return completion.choices[0].message.content
