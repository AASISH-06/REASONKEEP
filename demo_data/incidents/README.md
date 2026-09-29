# Engineering Incidents & Failure Post-Mortems
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  

| Record ID | Project | Incident / Failure Title | Root Cause | Preventive Countermeasure |
|---|---|---|---|---|
| `MIT-CE-SCN-INC-001` | Smart Campus Network | Gateway Packet Loss Incident | Ingestion pool exhaustion during class change | Asynchronous MQTT queues with flash buffer |
| `MIT-CE-CEM-FAIL-001` | Campus Energy Monitoring | Wi-Fi Sub-Meter Disconnection | RF attenuation in basement switchgear vault | Shielded RS-485 Modbus over copper |
| `MIT-CE-EAA-FAIL-001` | Edge Attendance Analytics | Ceiling Enclosure Thermal Shutdown | Poor ventilation & rising heat near lighting | Passively finned chassis & frame-skipping |
| `MIT-CE-LEM-FAIL-001` | Lab Equipment Monitoring | Cryo-Freezer Wi-Fi Heartbeat Drop | Silent Wi-Fi dropout during switch maintenance | Fail-safe normally-closed dry contacts |
| `MIT-CE-ESG-INC-001` | Environmental Sensor Gateway | Winter Solstice Battery Depletion | Snow cover & non-adaptive 1-min sampling | Dynamic battery-aware sleep duty cycling |
| `MIT-CE-ROV-FAIL-001` | Autonomous Delivery Rover | Motor Controller Bus Freeze | Inductive back-EMF spikes over USB FTDI | Galvanically isolated differential CAN bus |
