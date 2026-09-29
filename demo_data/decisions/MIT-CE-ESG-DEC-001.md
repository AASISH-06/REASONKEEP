# Architecture Decision Record: MIT-CE-ESG-DEC-001
**Project**: Environmental Sensor Gateway  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2025-03-02  
**Status**: APPROVED  
**Record ID**: MIT-CE-ESG-DEC-001  

## Context & Problem
50 solar-powered outdoor stations measuring stormwater runoff and microclimate parameters need to transmit telemetry across a 120-acre campus with dense trees and stone architecture.

## Decision
Standardize on LoRaWAN (915 MHz US band) with three rooftop base stations for all outdoor environmental monitoring nodes.

## Rationale
LoRaWAN provides up to 3 km non-line-of-sight range through campus trees and masonry with sub-20uA sleep currents, eliminating monthly cellular SIM fees across 50 sensing nodes.

## Constraints
- Total hardware budget under $150 per outdoor station.
- Nodes must run indefinitely on solar trickle charging with 2500mAh LiFePO4 cells.
- Non-line-of-sight propagation across dense campus trees.

## Alternatives Evaluated
1. **LoRaWAN 915 MHz sub-GHz mesh** — *SELECTED*
2. **Cellular LTE-M / NB-IoT** — *REJECTED*
3. **Zigbee 2.4 GHz mesh networking** — *REJECTED*

## Rejected Alternatives Rationale
- **Cellular LTE-M**: Rejected due to $4/month per-SIM subscription costs that exceeded recurring departmental student research budgets across 50 nodes.
- **Zigbee mesh**: Rejected due to severe 2.4 GHz co-channel interference from student smartphones and poor penetration through brick campus buildings.

## Outcome
Three rooftop LoRaWAN gateways cover the entire 120-acre campus with 98.7% packet reception across 42 deployed stormwater and air quality stations.

## Institutional Lesson
For distributed outdoor campus monitoring, private sub-GHz LPWAN (LoRaWAN) vastly outperforms 2.4GHz mesh and eliminates perpetual cellular recurring costs.
