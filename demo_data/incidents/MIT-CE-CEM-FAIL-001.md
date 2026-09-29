# Incident Post-Mortem: MIT-CE-CEM-FAIL-001
**Project**: Campus Energy Monitoring  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-12-10  
**Severity**: HIGH  
**Record ID**: MIT-CE-CEM-FAIL-001  

## Observed Failure
45 Wi-Fi power meters in the Science Center basement disconnected simultaneously during an access point firmware rollout, losing 72 hours of critical peak chiller electricity logs.

## Suspected & Root Cause
Basement switchgear rooms and electrical vaults act as Faraday cages. Concrete walls and 480V distribution transformers generated intense electromagnetic interference and RF attenuation, dropping Wi-Fi signal below receiver sensitivity.

## Investigation & Corrective Action
- Tested Wi-Fi range extenders, which failed due to CRC error rates.
- Replaced commercial ESP32 Wi-Fi smart plugs with industrial galvanically-isolated RS-485 Modbus meters over shielded twisted pair.

## Outcome
Wired RS-485 bus installation restored 100% telemetry continuity with zero dropped intervals across 6 months of severe electrical switching transients.

## Institutional Lesson
Never deploy consumer-grade wireless (Wi-Fi) sensors inside reinforced concrete electrical rooms or switchgear vaults. Industrial RS-485 serial over shielded copper is required for critical facilities monitoring.
