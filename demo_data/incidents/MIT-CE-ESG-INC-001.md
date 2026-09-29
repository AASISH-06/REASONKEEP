# Incident Post-Mortem: MIT-CE-ESG-INC-001
**Project**: Environmental Sensor Gateway  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2025-03-12  
**Severity**: HIGH  
**Record ID**: MIT-CE-ESG-INC-001  

## Observed Failure
During a major December blizzard, 18 outdoor environmental monitoring stations stopped transmitting telemetry within 48 hours.

## Suspected & Root Cause
Heavy snow accumulated on horizontal 5W solar panels, blocking all photovoltaic input. Microcontrollers were configured with aggressive 1-minute sampling intervals including GPS satellite acquisition, draining 2500mAh lithium cells below the battery low-voltage lockout threshold.

## Investigation & Corrective Action
- Redesigned firmware to implement battery-aware progressive sleep: 1-minute intervals when battery > 3.8V, scaling down to 30-minute intervals below 3.3V.
- Upgraded battery chemistry from standard Li-ion (which freezes below -10°C) to LiFePO4 cells rated down to -25°C.

## Outcome
Adaptive sleep duty cycling maintained telemetry continuity throughout 6 subsequent days of heavy winter overcast with zero battery lockouts.

## Institutional Lesson
Outdoor solar IoT nodes at temperate universities must implement battery-aware progressive degradation. Fixed reporting intervals inevitably cause mid-winter power starvation.
