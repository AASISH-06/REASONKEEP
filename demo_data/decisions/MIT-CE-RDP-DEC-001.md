# Architecture Decision Record: MIT-CE-RDP-DEC-001
**Project**: Research Data Pipeline  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-10-22  
**Status**: APPROVED  
**Record ID**: MIT-CE-RDP-DEC-001  

## Context & Problem
The department's experimental research cohorts generate high-frequency sensor bursts that must be consumed simultaneously by multiple independent analytics pipelines (machine learning training, real-time dashboards, long-term archival).

## Decision
Deploy Apache Kafka as the central durable event log for all lab sensor feeds rather than RabbitMQ or Redis Pub/Sub.

## Rationale
Kafka provides durable, append-only disk storage with decoupled consumer group offsets. This enables student researchers to replay past experimental runs from specific timestamp offsets when evaluating new neural network architectures.

## Constraints
- Sustained throughput of 25,000 events/second.
- 7-day retention window on local NVMe arrays.
- Deterministic per-partition ordering.

## Alternatives Evaluated
1. **Apache Kafka (Distributed Event Log)** — *SELECTED*
2. **RabbitMQ (AMQP Message Broker)** — *REJECTED*
3. **Redis Pub/Sub (In-Memory Broadcast)** — *REJECTED*

## Rejected Alternatives Rationale
- **RabbitMQ**: Evaluated and rejected because messages are deleted upon consumer acknowledgement; research teams require arbitrary temporal replay of past experimental data whenever model training code is updated.
- **Redis Pub/Sub**: Rejected due to memory exhaustion risks during network partitions and lack of durable message replay after broker restarts.

## Outcome
Processed over 800 million sensor records with zero data loss, enabling 12 research cohorts to replay synchronized telemetry streams on demand.

## Institutional Lesson
In university research environments where experiment algorithms evolve, choose durable append-only event logs (like Kafka) over ephemeral message queues. Immutable data replay is vital for scientific reproducibility.
