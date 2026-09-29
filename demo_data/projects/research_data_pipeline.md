# Research Data Pipeline (RDP)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Data Systems Research Cohort  
**Term**: Fall 2024 – Present  

## Overview
The Research Data Pipeline ingests high-frequency experimental streams from physics, robotics, and environmental sensors across the engineering quad. It provides durable event replay for deep learning model training and scientific analysis.

## Key Decisions & Records
- `MIT-CE-RDP-DEC-001`: Apache Kafka vs RabbitMQ message broker selection for reproducible experiment replay.
- `MIT-CE-RDP-DEC-002`: PostgreSQL catalog adoption for research grant metadata and dataset manifests.

## Architecture Guidelines
- Durable, append-only logs for experimental reproducibility.
- Re-use of the central departmental PostgreSQL cluster for grant-level dataset authorization.
