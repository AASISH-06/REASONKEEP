# Campus Autonomous Delivery Rover (ROV)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Autonomous Systems Lab (UASL)  
**Term**: Fall 2024 – Spring 2025  

## Overview
Electric autonomous delivery rover navigating mixed pedestrian campus sidewalks, courtyard plazas, and delivery portals.

## Key Decisions & Records
- `MIT-CE-ROV-DEC-001`: 3D LiDAR (Ouster OS1-32) + Stereo Vision obstacle detection vs. monocular RGB.
- `MIT-CE-ROV-FAIL-001`: Motor controller communication bus EMI crash and isolated CAN migration.

## Architecture Guidelines
- Multi-modal perception with active 3D range sensing for curb and obstacle detection.
- Galvanically isolated differential industrial buses (CAN) for high-power electric powertrains.
