"""
TEST 12 — SECURITY AUDIT Testing
"""

import asyncio
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from pathlib import Path
from app.config import settings
from app.api.memory import memory_status
from app.main import health_check


def test_gitignore_protects_env():
    """Verify .gitignore includes .env."""
    repo_root = Path(__file__).resolve().parent.parent.parent
    gitignore_path = repo_root / ".gitignore"
    assert gitignore_path.exists(), ".gitignore file must exist"
    content = gitignore_path.read_text(encoding="utf-8")
    assert ".env" in content, ".gitignore must list .env"
    return True


def test_env_example_has_no_secrets():
    """Verify backend/.env.example contains only placeholders / blank values."""
    repo_root = Path(__file__).resolve().parent.parent.parent
    example_path = repo_root / "backend" / ".env.example"
    assert example_path.exists(), "backend/.env.example must exist"
    content = example_path.read_text(encoding="utf-8")
    assert "HINDSIGHT_API_KEY=" in content, (
        ".env.example must define HINDSIGHT_API_KEY"
    )
    if settings.HINDSIGHT_API_KEY:
        assert settings.HINDSIGHT_API_KEY not in content, (
            "CRITICAL: Real HINDSIGHT_API_KEY leaked into .env.example!"
        )
    return True


def test_frontend_has_no_hindsight_key():
    """Verify frontend source files do not contain HINDSIGHT_API_KEY or the secret."""
    repo_root = Path(__file__).resolve().parent.parent.parent
    frontend_src = repo_root / "frontend" / "src"
    assert frontend_src.exists(), "frontend/src must exist"
    
    secret = settings.HINDSIGHT_API_KEY
    for f in frontend_src.rglob("*.ts*"):
        text = f.read_text(encoding="utf-8")
        assert "HINDSIGHT_API_KEY" not in text, f"Forbidden key name found in {f.name}"
        if secret:
            assert secret not in text, f"CRITICAL: Secret value leaked in {f.name}"
    return True


async def test_api_status_responses_clean():
    """Verify public endpoints do not expose API keys."""
    h = await health_check()
    m = await memory_status()
    secret = settings.HINDSIGHT_API_KEY
    
    dumped = str(h) + str(m.model_dump())
    if secret:
        assert secret not in dumped, "CRITICAL: Secret leaked in health or memory status response"
    assert "api_key" not in dumped.lower(), "api_key field leaked in public status response"
    return True


async def run_all():
    print("[TEST 12: SECURITY AUDIT]")
    test_gitignore_protects_env()
    print("  [OK] .gitignore properly ignores .env")
    test_env_example_has_no_secrets()
    print("  [OK] .env.example contains placeholders only (Zero secrets)")
    test_frontend_has_no_hindsight_key()
    print("  [OK] Frontend source code scan clean (Zero API key references)")
    await test_api_status_responses_clean()
    print("  [OK] Backend API status endpoints clean (Zero secrets leaked)")
    print("  -> TEST 12 PASSED (Security Audit Complete)\n")


if __name__ == "__main__":
    asyncio.run(run_all())
