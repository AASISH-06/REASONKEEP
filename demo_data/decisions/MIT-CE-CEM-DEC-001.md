# Architecture Decision Record: MIT-CE-CEM-DEC-001
**Project**: Campus Energy Monitoring  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-11-28  
**Status**: APPROVED  
**Record ID**: MIT-CE-CEM-DEC-001  

## Context & Problem
Sub-meter power monitoring across research facilities generates high-frequency kW readings that must be joined with campus building blueprints and room schedules.

## Decision
Adopt TimescaleDB extension running inside PostgreSQL for high-rate sub-meter electricity readings.

## Rationale
Provides native time-series hypertable partitioning while retaining direct relational joins with campus building blueprints and room schedules established by the Smart Campus Network.

## Constraints
- Ingest 5-second interval kW readings from 320 smart electrical meters.
- Compress historical data beyond 30 days.
- Direct SQL compatibility with Grafana dashboards.

## Alternatives Evaluated
1. **PostgreSQL + TimescaleDB extension** — *SELECTED*
2. **Standalone InfluxDB** — *REJECTED*
3. **MongoDB time-series collections** — *REJECTED*

## Rejected Alternatives Rationale
- **InfluxDB**: Maintaining a separate InfluxDB cluster required cross-database joins against PostgreSQL room assets, duplicating maintenance burden for student IT staff.
- **MongoDB**: Rejected due to lack of advanced time-series window functions for peak-demand billing calculations and poor hypertable compression compared to Zstandard on TimescaleDB.

## Outcome
Achieved 91% compression ratio on electrical telemetry while allowing campus energy managers to run unified SQL queries across building meters and room usage.

## Institutional Lesson
When time-series metrics must be contextualized by relational building assets, choose a relational time-series extension rather than operating two disconnected database silos.
