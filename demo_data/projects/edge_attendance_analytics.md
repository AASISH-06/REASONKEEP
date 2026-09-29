# Edge-Based Attendance Analytics (EAA)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Embedded Vision Cohort  
**Term**: Winter 2025  

## Overview
Edge cameras placed in large lecture halls compute anonymized room occupancy counts to drive dynamic HVAC ventilation while strictly preserving student privacy.

## Key Decisions & Records
- `MIT-CE-EAA-DEC-001`: On-device Jetson inference vs. central RTSP streaming (FERPA student privacy compliance).
- `MIT-CE-EAA-FAIL-001`: Lecture hall ceiling enclosure overheating and dynamic frame-skipping redesign.

## Architecture Guidelines
- Immediate frame deletion at the sensor level; only anonymous count integers transmitted.
- High-temperature chassis design for ceiling junction cavities.
