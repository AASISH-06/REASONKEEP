# Architecture Decision Record: MIT-CE-LEM-DEC-001
**Project**: Laboratory Equipment Monitoring  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2025-02-18  
**Status**: APPROVED  
**Record ID**: MIT-CE-LEM-DEC-001  

## Context & Problem
Critical cleanroom fume hood exhaust drops and autoclave overpressure states require immediate, guaranteed alerting to safety officers even during campus IT outages.

## Decision
Install dedicated 4G/LTE cellular backup dialers for high-priority cleanroom fume hood and autoclave alarms.

## Rationale
Campus email and campus network routing can be delayed by spam filters or nighttime network maintenance, missing urgent emergency windows.

## Constraints
- Must dispatch SMS notifications within 30 seconds of an anomaly.
- Must operate during complete campus power and network outages for at least 4 hours.

## Alternatives Evaluated
1. **Dedicated industrial 4G/LTE cellular SMS dialer** — *SELECTED*
2. **Campus email relay** — *REJECTED*
3. **Campus Slack/Discord webhook** — *REJECTED*

## Rejected Alternatives Rationale
- **Campus email relay**: Rejected after faculty emails were delayed by up to 45 minutes during university mail server queue backups.
- **Campus Slack webhook**: Rejected because it relies on campus internet uplink which fails during building power outage events.

## Outcome
Cellular dialer delivered alarm SMS messages to lab safety officers within 12 seconds of simulated power cuts during quarterly campus disaster drills.

## Institutional Lesson
Emergency notifications for life-safety or irreversible sample loss must use an out-of-band communication path independent of the primary institutional IT network.
