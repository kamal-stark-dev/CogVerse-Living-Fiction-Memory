"""
Single source of truth for whether Cognee runs against your local self-hosted
install or Cognee Cloud (using your hackathon credits).

Drop this file into your project root (next to ingest.py's parent, or
anywhere importable from scripts/ and app/backend/). Import `configure_cognee()`
and call it once, before your first cognee.add / cognify / search call in any
script. Nothing else about your existing add/cognify/search calls changes —
this only changes where they're routed.

Flip back to local anytime by setting COGNEE_MODE=local in .env — no code
changes needed. Useful if Cognee Cloud has a hiccup mid-demo and you need a
reliable fallback fast.
"""
import os
import cognee
from dotenv import load_dotenv

load_dotenv()

_configured = False
_mode = None


async def configure_cognee():
    global _configured, _mode
    if _configured:
        return

    _mode = os.getenv("COGNEE_MODE", "local").lower()

    if _mode == "cloud":
        api_key = os.environ["COGNEE_API_KEY"]
        base_url = os.getenv("COGNEE_BASE_URL", "https://api.cognee.ai")
        await cognee.serve(url=base_url, api_key=api_key)
        print(f"[cognee_bootstrap] Connected to Cognee Cloud at {base_url}")
    else:
        print("[cognee_bootstrap] Running local self-hosted Cognee (COGNEE_MODE=local)")

    _configured = True


async def shutdown_cognee():
    global _configured
    if _mode == "cloud" and _configured:
        await cognee.disconnect()
    _configured = False
