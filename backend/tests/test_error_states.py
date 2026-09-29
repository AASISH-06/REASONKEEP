"""
TEST 7 — ERROR STATES & Sanitization Test
"""

import asyncio
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from fastapi import HTTPException
from pydantic import ValidationError
from app.config import settings
from app.assistant.schemas import AssistantAskRequest
from app.assistant.service import query_assistant
from app.drift.schemas import DriftAnalysisRequest
from app.trace.schemas import DecisionTraceRequest


async def test_empty_query_validation():
    """Verify empty or whitespace queries are rejected by schema validators."""
    try:
        AssistantAskRequest(query="   ")
        assert False, "Should have raised ValidationError on empty assistant query"
    except ValidationError:
        pass

    try:
        DriftAnalysisRequest(proposal="   ")
        assert False, "Should have raised ValidationError on empty drift proposal"
    except ValidationError:
        pass

    try:
        DecisionTraceRequest(query="")
        assert False, "Should have raised ValidationError on empty trace query"
    except ValidationError:
        pass
    return True


async def test_sanitized_error_handling():
    """Verify that any raised HTTPException does not leak secrets or filesystem paths."""
    secret = settings.HINDSIGHT_API_KEY
    try:
        req = AssistantAskRequest(query="Test error sanitization query")
        await query_assistant(req)
    except HTTPException as exc:
        err_msg = str(exc.detail)
        if secret:
            assert secret not in err_msg, "CRITICAL: API key leaked in error detail"
        assert "traceback" not in err_msg.lower(), "Stack trace leaked in error detail"
        assert "c:\\" not in err_msg.lower(), "Local path leaked in error detail"
    except Exception as exc:
        err_str = str(exc)
        if secret:
            assert secret not in err_str, "CRITICAL: API key leaked in exception string"
    return True


async def run_all():
    print("[TEST 7: ERROR STATES & SANITIZATION]")
    await test_empty_query_validation()
    print("  [OK] Empty query validation verified (Pydantic rejected invalid inputs)")
    await test_sanitized_error_handling()
    print("  [OK] Error sanitization verified (No API keys, paths, or tracebacks leaked)")
    print("  -> TEST 7 PASSED\n")


if __name__ == "__main__":
    asyncio.run(run_all())
