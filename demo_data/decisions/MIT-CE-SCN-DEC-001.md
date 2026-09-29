# Architecture Decision Record: MIT-CE-SCN-DEC-001
**Project**: Smart Campus Network  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-09-12  
**Status**: APPROVED  
**Record ID**: MIT-CE-SCN-DEC-001  

## Context & Problem
The Smart Campus Network project requires managing over 450 campus IoT gateways and thousands of room environmental sensors across 12 academic buildings. Queries require traversing building zones, floor levels, device hardware profiles, and historical maintenance logs.

## Decision
Standardize on PostgreSQL 16 for all device inventory, building topology, and maintenance tracking records.

## Rationale
Relational data modeling with strict foreign key constraints maps directly to the physical campus building and room hierarchy. Foreign keys guarantee that no sensor can exist without an authoritative room assignment, preventing orphaned telemetry.

## Constraints
- Six-week initial rollout window before fall semester.
- Strict referential integrity between hardware MAC addresses and campus room identifiers.
- External facilities reporting requires standard SQL queries without bespoke aggregation code.

## Alternatives Evaluated
1. **PostgreSQL 16 (Relational Database)** — *SELECTED*
2. **MongoDB (Document Database)** — *REJECTED*
3. **DynamoDB (Cloud NoSQL)** — *REJECTED*

## Rejected Alternatives Rationale
- **MongoDB**: Evaluated for flexible JSON payload ingestion, but rejected because relationship-heavy device/location queries required multi-collection application-side joins, increasing API latency and causing data inconsistencies during room renumbering.
- **DynamoDB**: Rejected due to unpredictable monthly cloud egress expenses and institutional requirements to host campus operational data on-premise.

## Outcome
Deployed successfully on departmental rack hardware. Sub-5ms query times across 450 gateways with zero referential integrity violations over 18 months of continuous operation.

## Institutional Lesson
For campus infrastructure with rigid topological and relational device hierarchies, choose relational SQL engines with strict foreign key constraints over document databases. Relational data modeling eliminates complex application-side consistency code.
