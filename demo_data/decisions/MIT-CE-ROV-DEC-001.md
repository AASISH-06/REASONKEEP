# Architecture Decision Record: MIT-CE-ROV-DEC-001
**Project**: Campus Autonomous Delivery Rover  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab (UASL)  
**Date**: 2024-10-14  
**Status**: APPROVED  
**Record ID**: MIT-CE-ROV-DEC-001  

## Context & Problem
Reliable obstacle detection in outdoor campus walkways requires detecting low-lying obstacles (<15cm height) like curbs, backpacks, and skateboards under rapidly changing direct sunlight and dusk shadows.

## Decision
Use 3D LiDAR (Ouster OS1-32) fused with Stereo Vision cameras for primary obstacle detection.

## Rationale
Provides reliable 360-degree point clouds and metric depth estimation under rapidly changing university campus lighting conditions where cameras alone fail.

## Constraints
- Must detect low-lying obstacles (<15cm height).
- Must operate reliably in direct sunlight and dusk conditions.
- Total sensor budget under $8,000.

## Alternatives Evaluated
1. **LiDAR + Stereo Vision fusion** — *SELECTED*
2. **Single monocular RGB camera with depth neural network** — *REJECTED*
3. **Ultrasonic array with monocular camera** — *REJECTED*

## Rejected Alternatives Rationale
- **Single monocular RGB camera**: Performance degraded severely under low-light dusk conditions and caused false negative detections on dark asphalt shadows.
- **Ultrasonic array**: Narrow angular cone and acoustic reflections off glass building doors caused blind spots in pedestrian walkways.

## Outcome
Dual LiDAR + stereo camera perception achieved 99.4% obstacle detection reliability up to 15 meters across day and night conditions.

## Institutional Lesson
Sensor redundancy is essential for outdoor campus navigation. Never rely solely on monocular vision in unconstrained outdoor lighting environments.
