# Architecture Decision Records (ADRs)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  

| Record ID | Project | Title | Selected Option | Key Rejected Option |
|---|---|---|---|---|
| `MIT-CE-SCN-DEC-001` | Smart Campus Network | Device & Topology Database | PostgreSQL 16 | MongoDB |
| `MIT-CE-RDP-DEC-001` | Research Data Pipeline | High-Throughput Event Log | Apache Kafka | RabbitMQ / Redis |
| `MIT-CE-RDP-DEC-002` | Research Data Pipeline | Dataset Manifest Store | PostgreSQL | MongoDB |
| `MIT-CE-CEM-DEC-001` | Campus Energy Monitoring | Time-Series Metric Storage | TimescaleDB (PostgreSQL) | InfluxDB / MongoDB |
| `MIT-CE-EAA-DEC-001` | Edge Attendance Analytics | Video Ingestion Architecture | On-Device Edge Jetson | RTSP Video Streaming |
| `MIT-CE-LEM-DEC-001` | Lab Equipment Monitoring | Cleanroom Alert Dispatch | 4G/LTE Cellular SMS | Campus Email / Webhooks |
| `MIT-CE-ESG-DEC-001` | Environmental Sensor Gateway | Mesh LPWAN Protocol | LoRaWAN (915 MHz) | Cellular LTE-M / Zigbee |
| `MIT-CE-ROV-DEC-001` | Autonomous Delivery Rover | Perception Sensor Suite | 3D LiDAR + Stereo Vision | Monocular RGB Camera |
