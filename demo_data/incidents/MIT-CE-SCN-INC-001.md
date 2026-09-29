# Incident Post-Mortem: MIT-CE-SCN-INC-001
**Project**: Smart Campus Network  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-10-08  
**Severity**: HIGH  
**Record ID**: MIT-CE-SCN-INC-001  

## Observed Failure
During the first week of October 2024, approximately 34% of ambient environmental telemetry packets dropped silently between 8:55 AM and 9:15 AM across campus academic buildings.

## Suspected & Root Cause
Concurrent student device registrations during morning class change saturated the central gateway receiver thread. Synchronous database writes blocked the socket handler, causing TCP buffer overflows and silent packet rejection.

## Investigation & Corrective Action
- Implemented non-blocking asynchronous asyncio MQTT listeners.
- Added 64MB local circular flash ring buffers on gateways.
- Partitioned the ingestion pool so facilities telemetry does not contend with student device registrations.

## Outcome
Packet reception rate restored to 99.8% with zero dropped readings during subsequent campus class change intervals.

## Institutional Lesson
Campus networks experience extreme step-function traffic spikes during hourly student class changes. Ingestion services must decouple network listening from database commits using local backpressure queues.
