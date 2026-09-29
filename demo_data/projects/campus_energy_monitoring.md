# Campus Energy Monitoring (CEM)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Energy Analytics Cohort  
**Term**: Fall 2024 – Winter 2025  

## Overview
Sub-meter power monitoring across research laboratories, central computing clusters, and campus chiller plants. Captures 5-second interval kW readings to support peak demand shedding.

## Key Decisions & Records
- `MIT-CE-CEM-DEC-001`: TimescaleDB extension on PostgreSQL for time-series sub-meter data.
- `MIT-CE-CEM-FAIL-001`: Sub-station Wi-Fi polling disconnection failure and RS-485 Modbus migration.

## Architecture Guidelines
- Extension of relational database with time-series hypertables instead of standing up separate NoSQL stores.
- Shielded twisted-pair RS-485 serial for all basement switchgear installations.
