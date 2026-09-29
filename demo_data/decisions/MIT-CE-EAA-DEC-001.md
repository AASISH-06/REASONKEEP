# Architecture Decision Record: MIT-CE-EAA-DEC-001
**Project**: Edge-Based Attendance Analytics  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2025-01-14  
**Status**: APPROVED  
**Record ID**: MIT-CE-EAA-DEC-001  

## Context & Problem
Measuring real-time lecture hall occupancy is needed to optimize HVAC damper ventilation. However, streaming classroom video introduces severe student privacy and FERPA compliance risks.

## Decision
Perform on-device pedestrian and occupancy counting using NVIDIA Jetson Orin Nano edge units, discarding all raw video frames immediately after tensor inference.

## Rationale
Strict university student privacy policies prohibit streaming or recording raw video feeds from lecture halls and public walkways. On-device edge processing eliminates privacy liability while reducing network load.

## Constraints
- Zero video frame retention on disk or network.
- Anonymous numeric count integer payloads only.
- Latency under 2 seconds for dynamic HVAC adjustments.

## Alternatives Evaluated
1. **Edge inference on NVIDIA Jetson Orin Nano** — *SELECTED*
2. **Centralized RTSP video streaming to server GPU cluster** — *REJECTED*

## Rejected Alternatives Rationale
- **Centralized RTSP video streaming**: Rejected due to severe student privacy violations (FERPA compliance risks) and campus network bandwidth saturation (over 6 Gbps across 80 lecture halls).

## Outcome
Successfully passed university privacy review; reduced HVAC ventilation energy consumption by 24% by providing real-time room occupancy numbers with zero personal data transmission.

## Institutional Lesson
In campus vision deployments, edge analytics that discard raw imagery at the sensor level eliminate privacy compliance hurdles and network bandwidth bottlenecks.
