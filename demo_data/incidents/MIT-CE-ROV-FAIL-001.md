# Incident Post-Mortem: MIT-CE-ROV-FAIL-001
**Project**: Campus Autonomous Delivery Rover  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab (UASL)  
**Date**: 2024-11-05  
**Severity**: CRITICAL  
**Record ID**: MIT-CE-ROV-FAIL-001  

## Observed Failure
The autonomous delivery rover froze completely in the middle of a campus pedestrian crosswalk when acceleration drew 40A, crashing the motor controller communication and leaving the rover unresponsive to steering.

## Suspected & Root Cause
High-current brushless hub motors generated severe back-EMF inductive voltage spikes. Single-ended USB FTDI serial connections suffered electromagnetic interference (EMI) that triggered kernel PHY host resets.

## Investigation & Corrective Action
- Clip-on ferrite beads were tested and found insufficient to prevent USB controller resets.
- Migrated motor communication architecture to an isolated differential CAN bus (CANopen protocol) with hardware galvanic optoisolators between the 48V motor battery and 5V logic.

## Outcome
Eliminated EMI resets completely with zero communication drops over 120km of campus sidewalk endurance runs.

## Institutional Lesson
Never use single-ended USB connections for motor actuation in high-current electric vehicles. Differential industrial buses like CAN with hardware galvanic isolation are mandatory.
