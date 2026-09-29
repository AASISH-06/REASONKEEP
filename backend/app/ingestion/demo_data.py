"""
REASONKEEP — Module 8 Demo & Synthetic Dataset
Institution: Meridian Institute of Technology (MIT — Fictional)
Department: Computer Engineering Research Lab (CERL)

Coherent Project Family:
1. Smart Campus Network (SCN)
2. Research Data Pipeline (RDP)
3. Campus Energy Monitoring (CEM)
4. Edge-Based Attendance Analytics (EAA)
5. Laboratory Equipment Monitoring (LEM)
6. Environmental Sensor Gateway (ESG)
7. Campus Autonomous Delivery Rover (Hermes / ROV)

DISCLAIMER:
DEMO / SYNTHETIC DATA for institutional memory verification and evaluation.
No real university events or personal data.
"""

from __future__ import annotations

from app.ingestion.schemas import (
    InstitutionalMemoryInput,
    MemoryType,
    RejectedAlternative,
)

INSTITUTION_NAME = "Meridian Institute of Technology"
DEPARTMENT_NAME = "Computer Engineering Research Lab"

DEMO_MEMORIES: list[InstitutionalMemoryInput] = [
    # ── 1. Smart Campus Network: Database Architecture Selection ──
    InstitutionalMemoryInput(
        project="Smart Campus Network",
        project_type="infrastructure_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Smart Campus Network Device & Topology Database Selection",
        decision="Standardize on PostgreSQL 16 for all device inventory, building topology, and maintenance tracking records.",
        reason="The smart campus infrastructure requires complex relational joins across building zones, floor plans, sensor hardware profiles, and historical maintenance logs.",
        constraints=[
            "Six-week initial rollout window before fall semester",
            "Must maintain strict referential integrity between hardware MAC addresses and campus room identifiers",
            "External facilities reporting requires standard SQL queries without bespoke aggregation code",
        ],
        alternatives=[
            "PostgreSQL 16 relational database",
            "MongoDB document store",
            "DynamoDB cloud NoSQL",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="MongoDB",
                reason="Evaluated for flexible JSON payload ingestion, but rejected because relationship-heavy device/location hierarchy created application-side join overhead, high query latency, and data inconsistency across building reconfigurations.",
            ),
            RejectedAlternative(
                alternative="DynamoDB",
                reason="Rejected due to recurring monthly cloud egress expenses and strict compliance mandates requiring on-premise university server deployment.",
            ),
        ],
        outcome="PostgreSQL successfully deployed on department rack servers, supporting 450 campus IoT gateways with sub-5ms query times and zero referential integrity faults across 18 months.",
        lesson="For campus infrastructure with rigid topological and relational device hierarchies, choose relational SQL engines with strict foreign key constraints over document databases. Relational data modeling eliminates complex application-side consistency code.",
        team_context="Campus Infrastructure Group",
        date="2024-09-12",
        source="MIT-CE-SCN-DEC-001",
        tags=["database", "postgresql", "mongodb", "architecture", "smart-campus", "relational"],
    ),

    # ── 2. Smart Campus Network: Gateway Telemetry Packet Loss Incident ──
    InstitutionalMemoryInput(
        project="Smart Campus Network",
        project_type="infrastructure_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.FAILURE,
        title="Gateway Telemetry Buffer Overflow and Packet Loss Incident",
        decision="Refactor gateway telemetry ingestion from single-threaded synchronous MQTT handler to an asynchronous backpressure pipeline with local flash buffering.",
        reason="During 9:00 AM class transition peaks, thousands of campus sensor heartbeats saturated the gateway listener, dropping 34% of ambient environmental data.",
        constraints=[
            "Must handle up to 5,000 concurrent sensor connections during student class changes",
            "Zero dropped telemetry readings during 15-minute campus network switch maintenance windows",
        ],
        alternatives=[
            "Scale server CPU cores for synchronous listener",
            "Asynchronous asyncio MQTT subscribers with 64MB circular flash storage buffer",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Scale server CPU cores",
                reason="Did not address gateway socket exhaustion or the single-threaded bottleneck in the legacy synchronous ingestion daemon.",
            )
        ],
        failure="A major telemetry outage occurred during the first week of October 2024 when concurrent student device registrations collided with environmental sensor reporting, exhausting connection pools and causing unbuffered packets to be dropped silently.",
        outcome="Implemented asynchronous asyncio MQTT subscribers with 64MB circular flash storage, restoring reception rate to 99.8% with zero dropped intervals during campus traffic bursts.",
        lesson="Campus networks experience extreme step-function traffic spikes during hourly student class changes. Ingestion services must decouple network listening from database commits using local backpressure queues.",
        team_context="Campus Infrastructure Group",
        date="2024-10-08",
        source="MIT-CE-SCN-INC-001",
        tags=["telemetry", "incident", "packet-loss", "mqtt", "buffer-overflow", "network-reliability"],
    ),

    # ── 3. Research Data Pipeline: High-Throughput Event Broker ──
    InstitutionalMemoryInput(
        project="Research Data Pipeline",
        project_type="data_systems_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="High-Throughput Research Sensor Event Broker Selection",
        decision="Deploy Apache Kafka as the central durable event log for all lab sensor feeds rather than RabbitMQ or Redis Pub/Sub.",
        reason="Downstream research groups require independent consumer offsets, immutable historical replay, and zero message loss for deep learning training datasets.",
        constraints=[
            "Must support sustained 25,000 events/second across multiple lab instruments",
            "7-day retention on local NVMe arrays for reproducible model experiments",
            "Deterministic per-partition message ordering",
        ],
        alternatives=[
            "Apache Kafka distributed event log",
            "RabbitMQ AMQP message broker",
            "Redis Pub/Sub in-memory broadcast",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="RabbitMQ",
                reason="Evaluated and rejected because messages are deleted upon consumer acknowledgement; research teams require arbitrary temporal replay of past experimental data whenever model training code is updated.",
            ),
            RejectedAlternative(
                alternative="Redis Pub/Sub",
                reason="Rejected due to in-memory retention volatility and lack of consumer group offset persistence during broker service restarts.",
            ),
        ],
        outcome="Kafka cluster has processed over 800 million sensor records with zero data loss, enabling 12 research cohorts to replay synchronized telemetry streams on demand.",
        lesson="In university research environments where experiment algorithms evolve, choose durable append-only event logs (like Kafka) over ephemeral message queues. Immutable data replay is vital for scientific reproducibility.",
        team_context="Data Systems Research Cohort",
        date="2024-10-22",
        source="MIT-CE-RDP-DEC-001",
        tags=["pipeline", "kafka", "event-streaming", "rabbitmq", "data-engineering"],
    ),

    # ── 4. Research Data Pipeline: Dataset Manifest Relational Store ──
    InstitutionalMemoryInput(
        project="Research Data Pipeline",
        project_type="data_systems_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Research Dataset Manifest and Metadata Store Selection",
        decision="Reaffirm PostgreSQL as the authoritative relational metadata catalog for dataset manifests and access permissions.",
        reason="Maintains schema compatibility with the department's existing Smart Campus Network infrastructure and provides ACID transactions across multi-author grant submissions.",
        constraints=[
            "Enforce role-based access control (RBAC) linked to university Active Directory",
            "Support complex queries joining researcher profiles, grant numbers, and dataset checksums",
            "Prevent orphaned dataset manifests without valid project grant IDs",
        ],
        alternatives=[
            "PostgreSQL schema with JSONB metadata columns",
            "MongoDB document collections",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="MongoDB",
                reason="Proposal to replace PostgreSQL with MongoDB was rejected because research dataset manifests require strict foreign-key relations with university grant funding IDs and published faculty papers. Without relational constraints, testing revealed orphan dataset entries.",
            )
        ],
        outcome="Saved 40 engineering hours by re-using existing database administration tooling, backup routines, and connection pooling from the Smart Campus Network.",
        lesson="Standardizing on a proven relational core across departmental research projects compounds institutional knowledge and eliminates redundant database management costs.",
        team_context="Data Systems Research Cohort",
        date="2024-11-15",
        source="MIT-CE-RDP-DEC-002",
        tags=["database", "postgresql", "mongodb", "metadata", "governance", "research-pipeline"],
    ),

    # ── 5. Campus Energy Monitoring: TimescaleDB Telemetry Storage ──
    InstitutionalMemoryInput(
        project="Campus Energy Monitoring",
        project_type="facilities_analytics",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Sub-Meter Electrical Telemetry Storage Selection",
        decision="Adopt TimescaleDB extension running inside PostgreSQL for high-rate sub-meter electricity readings.",
        reason="Provides native time-series hypertable partitioning while retaining direct relational joins with campus building blueprints and room schedules established by the Smart Campus Network.",
        constraints=[
            "Ingest 5-second interval kW readings from 320 smart electrical meters across 8 campus facilities",
            "Compress historical data beyond 30 days to fit within departmental lab storage",
            "Direct SQL compatibility with Grafana dashboards for student operators",
        ],
        alternatives=[
            "PostgreSQL + TimescaleDB extension",
            "Standalone InfluxDB",
            "MongoDB time-series collections",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="InfluxDB",
                reason="Rejected because maintaining a separate InfluxDB instance required cross-database joins against PostgreSQL room assets, duplicating maintenance burden for student IT staff.",
            ),
            RejectedAlternative(
                alternative="MongoDB",
                reason="Rejected due to lack of advanced time-series window functions for peak-demand billing calculations and poor hypertable compression compared to Zstandard on TimescaleDB.",
            ),
        ],
        outcome="Achieved 91% compression ratio on electrical telemetry while allowing campus energy managers to run unified SQL queries across building meters and room usage.",
        lesson="When time-series metrics must be contextualized by relational building assets, choose a relational time-series extension rather than operating two disconnected database silos.",
        team_context="Energy Analytics Cohort",
        date="2024-11-28",
        source="MIT-CE-CEM-DEC-001",
        tags=["energy", "timescaledb", "postgresql", "telemetry", "analytics", "database"],
    ),

    # ── 6. Campus Energy Monitoring: Sub-Station Wi-Fi Failure ──
    InstitutionalMemoryInput(
        project="Campus Energy Monitoring",
        project_type="facilities_analytics",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.FAILURE,
        title="Sub-Station Wi-Fi Polling Disconnection and RS-485 Migration",
        decision="Replace commercial ESP32 Wi-Fi smart plugs with industrial galvanically-isolated RS-485 Modbus meters over shielded twisted pair.",
        reason="Basement switchgear rooms and electrical vaults act as Faraday cages, causing high packet loss and dropped readings on wireless links.",
        constraints=[
            "Galvanic isolation to withstand high-voltage electrical inductive spikes",
            "Zero wireless radio dependencies in underground concrete switchgear rooms",
        ],
        alternatives=[
            "Wi-Fi range extenders in electrical vaults",
            "Shielded RS-485 Modbus RTU serial bus",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Wi-Fi range extenders",
                reason="Electrical vault concrete walls and high electromagnetic interference from 480V distribution transformers caused frequent Wi-Fi packet drops and corrupted CRC frames.",
            )
        ],
        failure="During November 2024 peak-demand testing, 45 Wi-Fi power meters in the Science Center basement disconnected simultaneously during an access point firmware rollout, losing 72 hours of critical peak chiller electricity logs.",
        outcome="Wired RS-485 bus installation restored 100% telemetry continuity with zero dropped intervals across 6 months of severe electrical switching transients.",
        lesson="Never deploy consumer-grade wireless (Wi-Fi) sensors inside reinforced concrete electrical rooms or switchgear vaults. Industrial RS-485 serial over shielded copper is required for critical facilities monitoring.",
        team_context="Energy Analytics Cohort",
        date="2024-12-10",
        source="MIT-CE-CEM-FAIL-001",
        tags=["energy", "failure", "modbus", "rs485", "wifi-drop", "hardware-reliability"],
    ),

    # ── 7. Edge-Based Attendance Analytics: Edge Inference vs Cloud Video ──
    InstitutionalMemoryInput(
        project="Edge-Based Attendance Analytics",
        project_type="embedded_vision_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Lecture Hall Occupancy Video Architecture and Privacy Compliance",
        decision="Perform on-device pedestrian and occupancy counting using NVIDIA Jetson Orin Nano edge units, discarding all raw video frames immediately after tensor inference.",
        reason="Strict university student privacy policies prohibit streaming or recording raw video feeds from lecture halls and public walkways.",
        constraints=[
            "Zero video frame retention on disk or network to satisfy university privacy policy",
            "Anonymous numeric count integer payloads only",
            "Latency under 2 seconds for dynamic HVAC damper adjustments",
        ],
        alternatives=[
            "Edge inference on NVIDIA Jetson Orin Nano",
            "Centralized RTSP video streaming to server GPU cluster",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Centralized RTSP video streaming",
                reason="Rejected due to severe student privacy violations (FERPA compliance risks) and campus network bandwidth saturation (over 6 Gbps across 80 lecture halls).",
            )
        ],
        outcome="Successfully passed university privacy review; reduced HVAC ventilation energy consumption by 24% by providing real-time room occupancy numbers with zero personal data transmission.",
        lesson="In campus vision deployments, edge analytics that discard raw imagery at the sensor level eliminate privacy compliance hurdles and network bandwidth bottlenecks.",
        team_context="Embedded Vision Cohort",
        date="2025-01-14",
        source="MIT-CE-EAA-DEC-001",
        tags=["edge-ai", "privacy", "computer-vision", "jetson", "hvac", "attendance"],
    ),

    # ── 8. Edge-Based Attendance Analytics: Thermal Throttling Failure ──
    InstitutionalMemoryInput(
        project="Edge-Based Attendance Analytics",
        project_type="embedded_vision_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.FAILURE,
        title="Lecture Hall Ceiling Enclosure Overheating and Thermal Shutdown",
        decision="Redesign edge compute enclosures with extruded aluminum heat sinks and implement dynamic frame-skipping when junction temperature exceeds 70°C.",
        reason="Enclosed junction boxes near ceiling lighting fixtures reached 55°C ambient, causing thermal throttling and OS kernel freezes during long lectures.",
        constraints=[
            "Passively cooled; zero audible fan noise in acoustic lecture halls",
            "Must operate continuously in ambient ceiling temperatures up to 55°C",
        ],
        alternatives=[
            "Active fan cooling",
            "Passively finned aluminum chassis with dynamic frame-skipping",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Active fan cooling",
                reason="High-RPM miniature fans exceeded the 25dB classroom acoustic noise limit and clogged with auditorium ceiling dust within two months.",
            )
        ],
        failure="Three Jetson units mounted above lecture hall projectors suffered thermal shutdown during a packed campus symposium, leaving HVAC controllers without occupancy data.",
        outcome="New passively cooled chassis and temperature-aware inference throttling kept edge processors below 68°C even under 100% GPU utilization.",
        lesson="Ceiling cavities in university lecture halls run significantly hotter than room ambient due to rising heat and projector exhausts. Always budget for worst-case thermal environments when deploying edge AI compute.",
        team_context="Embedded Vision Cohort",
        date="2025-01-29",
        source="MIT-CE-EAA-FAIL-001",
        tags=["hardware-failure", "thermal-throttling", "edge-compute", "jetson", "embedded"],
    ),

    # ── 9. Laboratory Equipment Monitoring: Freezer Heartbeat Failure ──
    InstitutionalMemoryInput(
        project="Laboratory Equipment Monitoring",
        project_type="safety_instrumentation",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.FAILURE,
        title="Cryogenic Freezer Wi-Fi Heartbeat Disconnection and Hardwired Interlock Migration",
        decision="Replace software Wi-Fi ping heartbeat alerts with fail-safe, normally-closed hardwired dry-contact relays directly coupled to the building emergency dispatch panel.",
        reason="A software Wi-Fi notification system failed silently during IT network switch maintenance, causing a 4-hour delay in reporting a thermal rise in a -80°C biology freezer.",
        constraints=[
            "Guaranteed alarm trigger within 30 seconds of thermal threshold breach",
            "Must operate independently of campus Wi-Fi, Ethernet, or software daemons",
        ],
        alternatives=[
            "Wi-Fi software ROS emergency topic heartbeat",
            "Hardwired normally-closed dry-contact relays with local battery-backed siren",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Wi-Fi software heartbeat",
                reason="Campus Wi-Fi authentication timeouts and overnight network switch reboots caused silent monitoring disconnections without alerting on-call staff.",
            )
        ],
        failure="A biological research sample freezer maintained at -80°C rose to -45°C overnight because the microcontroller's Wi-Fi connection timed out and went into an infinite retry loop without triggering a local audible alarm.",
        outcome="Installed hardwired dry-contact alarms and local battery-backed sirens; zero missed freezer faults recorded across 9 months of operation.",
        lesson="Critical laboratory safety systems must NEVER depend on campus Wi-Fi infrastructure or software network stacks. Use hardwired fail-safe normally-closed circuits with local battery-backed audible notification.",
        team_context="Safety & Instrumentation Group",
        date="2025-02-04",
        source="MIT-CE-LEM-FAIL-001",
        tags=["safety", "incident", "failure", "heartbeat", "freezer-alarm", "hardware-interlock"],
    ),

    # ── 10. Laboratory Equipment Monitoring: Out-of-Band Cellular Alert Dispatch ──
    InstitutionalMemoryInput(
        project="Laboratory Equipment Monitoring",
        project_type="safety_instrumentation",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Laboratory Cleanroom Out-of-Band Cellular Alert Dispatch Selection",
        decision="Install dedicated 4G/LTE cellular backup dialers for high-priority cleanroom fume hood and autoclave alarms.",
        reason="Campus email and campus network routing can be delayed by spam filters or nighttime network maintenance, missing urgent emergency windows.",
        constraints=[
            "Must dispatch SMS notifications within 30 seconds of an anomaly",
            "Must operate during complete campus power and network outages for at least 4 hours",
        ],
        alternatives=[
            "Dedicated industrial 4G/LTE cellular SMS dialer",
            "Campus email relay",
            "Campus Slack/Discord webhook",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Campus email relay",
                reason="Rejected after faculty emails were delayed by up to 45 minutes during university mail server queue backups.",
            ),
            RejectedAlternative(
                alternative="Campus Slack webhook",
                reason="Rejected because it relies on campus internet uplink which fails during building power outage events.",
            ),
        ],
        outcome="Cellular dialer delivered alarm SMS messages to lab safety officers within 12 seconds of simulated power cuts during quarterly campus disaster drills.",
        lesson="Emergency notifications for life-safety or irreversible sample loss must use an out-of-band communication path independent of the primary institutional IT network.",
        team_context="Safety & Instrumentation Group",
        date="2025-02-18",
        source="MIT-CE-LEM-DEC-001",
        tags=["safety", "cellular", "alerts", "out-of-band", "cleanroom", "hardware"],
    ),

    # ── 11. Environmental Sensor Gateway: LoRaWAN Protocol Selection ──
    InstitutionalMemoryInput(
        project="Environmental Sensor Gateway",
        project_type="environmental_iot",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.DECISION,
        title="Outdoor Campus Environmental Sensor Network Protocol Selection",
        decision="Standardize on LoRaWAN (915 MHz US band) with three rooftop base stations for all outdoor environmental monitoring nodes.",
        reason="LoRaWAN provides up to 3 km non-line-of-sight range through campus trees and masonry with sub-20uA sleep currents, eliminating monthly cellular SIM fees across 50 sensing nodes.",
        constraints=[
            "Total hardware budget under $150 per outdoor station",
            "Nodes must run indefinitely on solar trickle charging with 2500mAh LiFePO4 cells",
            "Non-line-of-sight propagation across dense campus trees",
        ],
        alternatives=[
            "LoRaWAN 915 MHz sub-GHz mesh",
            "Cellular LTE-M / NB-IoT",
            "Zigbee 2.4 GHz mesh networking",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Cellular LTE-M",
                reason="Rejected due to $4/month per-SIM subscription costs that exceeded recurring departmental student research budgets across 50 nodes.",
            ),
            RejectedAlternative(
                alternative="Zigbee mesh",
                reason="Rejected due to severe 2.4 GHz co-channel interference from student smartphones and poor penetration through brick campus buildings.",
            ),
        ],
        outcome="Three rooftop LoRaWAN gateways cover the entire 120-acre campus with 98.7% packet reception across 42 deployed stormwater and air quality stations.",
        lesson="For distributed outdoor campus monitoring, private sub-GHz LPWAN (LoRaWAN) vastly outperforms 2.4GHz mesh and eliminates perpetual cellular recurring costs.",
        team_context="Environmental IoT Research Group",
        date="2025-03-02",
        source="MIT-CE-ESG-DEC-001",
        tags=["lorawan", "iot", "environmental", "low-power", "mesh-network", "sensors"],
    ),

    # ── 12. Environmental Sensor Gateway: Winter Solar Starvation Incident ──
    InstitutionalMemoryInput(
        project="Environmental Sensor Gateway",
        project_type="environmental_iot",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME}",
        memory_type=MemoryType.FAILURE,
        title="Winter Solstice Power Starvation and Adaptive Sleep Firmware Migration",
        decision="Implement dynamic battery-aware duty cycling that scales reporting interval from 1 minute in sunlight down to 30 minutes when cell voltage drops below 3.2V.",
        reason="Snow cover and sub-freezing temperatures in December caused battery brownouts on 18 outdoor weather stations.",
        constraints=[
            "Sustain essential telemetry through 5 consecutive days of sub-zero overcast weather",
            "Prevent lithium battery low-voltage cutoff lockout",
        ],
        alternatives=[
            "Larger 50W solar panels",
            "Dynamic battery-aware duty cycle firmware with LiFePO4 cold-weather cells",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Larger 50W solar panels",
                reason="Tripled wind load on mounting poles, violating campus building services safety regulations during high-wind season.",
            )
        ],
        failure="During a December blizzard, continuous 1-minute GPS and particulate sensing depleted lithium cells within 48 hours, freezing microcontroller flash state.",
        outcome="Adaptive firmware and upgraded LiFePO4 cold-weather cells maintained continuous operation throughout subsequent winter storms without manual intervention.",
        lesson="Outdoor solar IoT nodes at temperate universities must implement battery-aware progressive degradation. Fixed reporting intervals inevitably cause mid-winter power starvation.",
        team_context="Environmental IoT Research Group",
        date="2025-03-12",
        source="MIT-CE-ESG-INC-001",
        tags=["environmental", "failure", "solar-power", "battery", "firmware", "iot"],
    ),

    # ── 13. Campus Autonomous Delivery Rover: Perception Suite Selection ──
    InstitutionalMemoryInput(
        project="Campus Autonomous Delivery Rover",
        project_type="capstone_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME} (UASL)",
        memory_type=MemoryType.DECISION,
        title="Obstacle Detection Sensor Suite Selection",
        decision="Use 3D LiDAR (Ouster OS1-32) fused with Stereo Vision cameras for primary obstacle detection.",
        reason="Provides reliable 360-degree point clouds and depth estimation under rapidly changing university campus lighting conditions.",
        constraints=[
            "Must detect low-lying obstacles (<15cm height) like curbs and backpacks",
            "Must operate reliably in direct sunlight and dusk conditions",
            "Total sensor budget under $8,000",
        ],
        alternatives=[
            "LiDAR + Stereo Vision fusion",
            "Single monocular RGB camera with depth neural network",
            "Ultrasonic array with monocular camera",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="Single monocular RGB camera",
                reason="Performance degraded severely under low-light dusk conditions and caused false negative detections on dark asphalt shadows.",
            ),
            RejectedAlternative(
                alternative="Ultrasonic array",
                reason="Narrow angular cone and acoustic reflections off glass building doors caused blind spots in pedestrian walkways.",
            ),
        ],
        failure="During early testing, an RGB-only camera setup failed to detect an empty skateboard on concrete during a late evening test run, causing an emergency collision halt.",
        outcome="Dual LiDAR + stereo camera perception achieved 99.4% pedestrian and obstacle detection reliability up to 15 meters across day and night conditions.",
        lesson="Sensor redundancy is essential for outdoor campus navigation. Never rely solely on monocular vision in unconstrained outdoor lighting environments.",
        team_context="Perception & Sensing Subsystem Cohort",
        date="2024-10-14",
        source="MIT-CE-ROV-DEC-001",
        tags=["perception", "lidar", "stereo-vision", "obstacle-detection", "safety", "rover"],
    ),

    # ── 14. Campus Autonomous Delivery Rover: Motor Controller CAN Migration ──
    InstitutionalMemoryInput(
        project="Campus Autonomous Delivery Rover",
        project_type="capstone_research",
        organization_context=f"{INSTITUTION_NAME} — {DEPARTMENT_NAME} (UASL)",
        memory_type=MemoryType.FAILURE,
        title="Motor Controller Communication Bus Failure and CAN Migration",
        decision="Migrate all motor controller communications from USB-to-UART serial adapters to isolated differential CAN bus (CANopen protocol).",
        reason="High-torque brushless hub motors generated severe electromagnetic interference (EMI) that caused USB serial controllers to hang and disconnect.",
        constraints=[
            "Deterministic message latency under 10 milliseconds",
            "Hardware galvanic isolation between 48V power stage and 5V logic",
            "Bus recovery from bus-off state without rebooting main computer",
        ],
        alternatives=[
            "Isolated CAN 2.0B / CANopen",
            "USB-to-UART serial with ferrite chokes",
            "RS-485 differential serial",
        ],
        rejected_alternatives=[
            RejectedAlternative(
                alternative="USB-to-UART serial with ferrite chokes",
                reason="Even with clip-on ferrite beads, transient motor back-EMF spikes caused USB host controller PHY resets in the Linux kernel.",
            )
        ],
        failure="The rover unexpectedly froze in the middle of a campus pedestrian crosswalk when sudden acceleration drew 40A, crashing the USB FTDI chip and leaving the rover unresponsive to steering commands.",
        outcome="Transition to isolated CAN transceivers completely eliminated EMI bus resets with zero communication drops over 120km of campus endurance testing.",
        lesson="Never use single-ended USB connections for motor actuation in high-current electric vehicles. Differential industrial buses like CAN with hardware galvanic isolation are mandatory.",
        team_context="Embedded Hardware & Powertrain Subsystem",
        date="2024-11-05",
        source="MIT-CE-ROV-FAIL-001",
        tags=["powertrain", "can-bus", "emi", "hardware-failure", "embedded", "rover"],
    ),
]
