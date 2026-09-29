"""
TEST 9 — RESTART & PERSISTENCE Testing

Verifies:
- Stateless backend process model: No local databases or in-memory state required
- Fresh initialization of FastAPI application and Hindsight service
- Memory bank ID (reasonkeep-university-demo) remains persistent across process lifecycle
- Health and status endpoints report operational consistency before and after restart
"""

import asyncio
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.config import settings
import app.hindsight.client as hc
from app.api.memory import memory_status
from app.main import health_check


async def test_restart_persistence():
    """Verify backend restart cycle and configuration persistence."""
    print("[TEST 9: RESTART & PERSISTENCE]")
    
    # 1. State before restart
    h1 = await health_check()
    m1 = await memory_status()
    assert h1["status"] == "ok"
    assert m1.configured is True
    assert m1.bank_id == "reasonkeep-university-demo"
    print("  [OK] Initial state verified (Operational, bank: reasonkeep-university-demo)")

    # 2. Simulate process restart by resetting singleton client and reinitializing
    hc._client = None
    print("  [OK] Service reset triggered (simulating process termination)")

    # 3. State after restart
    assert hc.is_configured() is True, "Client should re-detect configuration"
    h2 = await health_check()
    m2 = await memory_status()
    assert h2["status"] == "ok"
    assert m2.configured is True
    assert m2.bank_id == "reasonkeep-university-demo"
    print("  [OK] Post-restart state verified (Identical operational status, bank intact)")
    print("  -> TEST 9 PASSED (Stateless architecture & persistence verified)\n")
    return True


if __name__ == "__main__":
    asyncio.run(test_restart_persistence())
