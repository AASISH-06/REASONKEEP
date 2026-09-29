# Incident Post-Mortem: MIT-CE-EAA-FAIL-001
**Project**: Edge-Based Attendance Analytics  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2025-01-29  
**Severity**: MEDIUM  
**Record ID**: MIT-CE-EAA-FAIL-001  

## Observed Failure
Three Jetson edge compute units mounted above lecture hall projectors suffered thermal shutdown during a packed campus symposium, leaving HVAC controllers without occupancy data.

## Suspected & Root Cause
Enclosed junction boxes near ceiling lighting fixtures reached 55°C ambient. Rising thermal currents combined with projector hot-air exhaust caused edge GPU junction temperatures to exceed the 85°C thermal trip threshold.

## Investigation & Corrective Action
- Replaced enclosed junction boxes with custom extruded aluminum passively finned enclosures.
- Implemented dynamic frame-skipping firmware that drops inference rate from 15 FPS to 2 FPS when junction temperature reaches 70°C.

## Outcome
Passively cooled chassis and temperature-aware inference throttling kept edge processors below 68°C even under 100% GPU utilization during subsequent summer lectures.

## Institutional Lesson
Ceiling cavities in university lecture halls run significantly hotter than room ambient due to rising heat and projector exhausts. Always budget for worst-case thermal environments when deploying edge AI compute.
