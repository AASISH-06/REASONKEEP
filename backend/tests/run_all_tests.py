"""
REASONKEEP — Master Module 9 Test Suite Runner

Runs all Module 9 verification suites:
1. TEST 1: Hindsight Connection
2. TEST 2: Retain & Idempotency
3. TEST 3: Recall (4 Query Archetypes)
4. TEST 4: Reflect & Grounded Reasoning
5. TEST 5: Decision Trace (10-Stage Reconstruction & Zero-Fabrication)
6. TEST 6: Decision Drift (4 Proposals: Conflict / Aligned / Indeterminate / No Memory)
7. TEST 7: Error States & Sanitization
8. TEST 8: Full Regression Suite (Modules 1–8)
9. TEST 12: Security & Key Isolation Audit
"""

import asyncio
import sys
import time
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from tests.test_hindsight_connection import run_all as run_test1
from tests.test_retain import run_all as run_test2
from tests.test_recall import run_all as run_test3
from tests.test_reflect import run_all as run_test4
from tests.test_decision_trace import run_all as run_test5
from tests.test_decision_drift import run_all as run_test6
from tests.test_error_states import run_all as run_test7
from tests.test_regression import run_all as run_test8
from tests.test_restart_persistence import test_restart_persistence as run_test9
from tests.test_security_audit import run_all as run_test12


async def run_master_suite():
    print("=" * 70)
    print("REASONKEEP -- MODULE 9 AUTOMATED VERIFICATION SUITE")
    print("Institution: Meridian Institute of Technology (MIT)")
    print("Lab: Computer Engineering Research Lab")
    print("Memory Bank: reasonkeep-university-demo")
    print("=" * 70 + "\n")

    start_time = time.time()
    tests = [
        ("TEST 1: Hindsight Connection", run_test1),
        ("TEST 2: Retain & Idempotency", run_test2),
        ("TEST 3: Recall (4 Archetypes)", run_test3),
        ("TEST 4: Reflect & Grounded Reasoning", run_test4),
        ("TEST 5: Decision Trace (10 Stages)", run_test5),
        ("TEST 6: Decision Drift Detection", run_test6),
        ("TEST 7: Error States & Sanitization", run_test7),
        ("TEST 8: Full Regression (Modules 1-8)", run_test8),
        ("TEST 9: Restart & Persistence", run_test9),
        ("TEST 12: Security & Key Isolation Audit", run_test12),
    ]

    passed = 0
    failed = 0
    results_summary = []

    for name, test_func in tests:
        t0 = time.time()
        try:
            await test_func()
            elapsed = time.time() - t0
            passed += 1
            results_summary.append((name, "PASSED", f"{elapsed:.2f}s"))
        except Exception as exc:
            elapsed = time.time() - t0
            failed += 1
            print(f"  [FAIL] FAILED: {exc}\n")
            results_summary.append((name, f"FAILED: {exc}", f"{elapsed:.2f}s"))

    total_time = time.time() - start_time

    print("=" * 70)
    print("MODULE 9 TEST SUITE SUMMARY")
    print("=" * 70)
    for name, status, el in results_summary:
        print(f"  {status:6} | {name:<42} | {el}")
    print("-" * 70)
    print(f"Total Suites: {len(tests)} | Passed: {passed} | Failed: {failed} | Time: {total_time:.2f}s")
    print("=" * 70)
    assert failed == 0, f"Module 9 suite had {failed} failures!"


if __name__ == "__main__":
    asyncio.run(run_master_suite())
