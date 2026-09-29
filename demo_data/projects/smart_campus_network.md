# Smart Campus Network (SCN)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Campus Infrastructure Group  
**Term**: Fall 2024 – Present  

## Overview
The Smart Campus Network connects over 450 ambient sensor gateways, environmental monitors, and room telemetry units across 12 academic buildings. It acts as the backbone for facilities management, room occupancy optimization, and research telemetry.

## Key Decisions & Records
- `MIT-CE-SCN-DEC-001`: PostgreSQL vs MongoDB for device metadata and building inventory.
- `MIT-CE-SCN-INC-001`: Gateway telemetry buffer overflow and packet loss incident during peak registration.

## Architecture Guidelines
- Strict relational constraints for room/device hierarchy.
- Decoupled asynchronous MQTT ingestion to buffer against hourly student migration traffic bursts.
