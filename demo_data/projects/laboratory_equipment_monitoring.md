# Laboratory Equipment Monitoring (LEM)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Safety & Instrumentation Group  
**Term**: Winter 2025 – Present  

## Overview
Continuous thermal and safety monitoring of biological cryogenic freezers (-80°C), cleanroom fume hoods, and autoclaves.

## Key Decisions & Records
- `MIT-CE-LEM-FAIL-001`: Cryogenic freezer Wi-Fi heartbeat drop incident and migration to fail-safe dry-contact relays.
- `MIT-CE-LEM-DEC-001`: Out-of-band 4G/LTE cellular SMS alerting for cleanroom fume hoods.

## Architecture Guidelines
- Life-safety and irreversible sample alerts must never rely on campus Wi-Fi or email relays.
- Mandatory normally-closed hardware interlocks with local battery-backed audible alarms.
