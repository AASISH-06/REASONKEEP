# Environmental Sensor Gateway (ESG)
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Lead Team**: Environmental IoT Research Group  
**Term**: Spring 2025  

## Overview
Solar-powered microclimate, air quality (PM2.5), and stormwater runoff sensing stations dispersed across the 120-acre campus.

## Key Decisions & Records
- `MIT-CE-ESG-DEC-001`: Private LoRaWAN 915 MHz sub-GHz mesh vs. cellular LTE-M subscription fees.
- `MIT-CE-ESG-INC-001`: Winter solstice battery depletion incident and adaptive duty cycle firmware.

## Architecture Guidelines
- Private sub-GHz LoRaWAN gateways to eliminate recurring cellular SIM costs.
- Battery-aware progressive power management with cold-weather LiFePO4 cells.
