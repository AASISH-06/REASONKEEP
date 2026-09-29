"""
TEST 1 — Hindsight Connection Test
"""

import asyncio
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.config import settings
from app.hindsight.client import is_configured
from app.main import health_check
from app.api.memory import memory_status


async def test_health_check_endpoint():
    """Verify GET /health returns expected operational payload."""
    res = await health_check()
    assert isinstance(res, dict), "Health check should return a dict"
    assert res.get("status") == "ok", f"Expected status 'ok', got {res.get('status')}"
    assert res.get("service") == "reasonkeep-api", f"Unexpected service: {res.get('service')}"
    assert res.get("version") == "0.6.0", f"Unexpected version: {res.get('version')}"
    return True


async def test_hindsight_configuration():
    """Verify Hindsight is properly configured and bank ID is reasonkeep-university-demo."""
    configured = is_configured()
    assert configured is True, "Hindsight client should be detected as configured."
    assert settings.HINDSIGHT_BANK_ID == "reasonkeep-university-demo", (
        f"Expected bank 'reasonkeep-university-demo', got {settings.HINDSIGHT_BANK_ID}"
    )
    assert settings.HINDSIGHT_API_KEY, "Backend HINDSIGHT_API_KEY must not be empty in .env"
    return True


async def test_memory_status_endpoint_security():
    """Verify /api/memory/status exposes metadata but NEVER the API key."""
    status_res = await memory_status()
    assert status_res.configured is True, "Memory status should report configured=True"
    assert status_res.bank_id == "reasonkeep-university-demo", f"Unexpected bank_id: {status_res.bank_id}"
    assert status_res.provider == "hindsight", f"Unexpected provider: {status_res.provider}"
    
    # Security verification: Ensure API key is NOT in response model
    dumped = status_res.model_dump()
    assert "api_key" not in dumped, "CRITICAL: api_key must never be in MemoryStatusResponse"
    assert "HINDSIGHT_API_KEY" not in str(dumped), "CRITICAL: HINDSIGHT_API_KEY leaked in memory status"
    assert settings.HINDSIGHT_API_KEY not in str(dumped), "CRITICAL: Real API key leaked in memory status"
    return True


async def run_all():
    print("[TEST 1: HINDSIGHT CONNECTION]")
    await test_health_check_endpoint()
    print("  [OK] Health check endpoint verified (/health)")
    await test_hindsight_configuration()
    print("  [OK] Hindsight client configuration verified (bank: reasonkeep-university-demo)")
    await test_memory_status_endpoint_security()
    print("  [OK] Memory status endpoint & API key security verified (/api/memory/status)")
    print("  -> TEST 1 PASSED\n")


if __name__ == "__main__":
    asyncio.run(run_all())
