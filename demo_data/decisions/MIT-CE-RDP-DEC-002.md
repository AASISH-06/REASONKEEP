# Architecture Decision Record: MIT-CE-RDP-DEC-002
**Project**: Research Data Pipeline  
**Institution**: Meridian Institute of Technology  
**Department**: Computer Engineering Research Lab  
**Date**: 2024-11-15  
**Status**: APPROVED  
**Record ID**: MIT-CE-RDP-DEC-002  

## Context & Problem
Research datasets need an authoritative catalog linking raw data partitions to grant funding numbers, research authors, publication licenses, and checksum manifests.

## Decision
Reaffirm PostgreSQL as the authoritative relational metadata catalog for dataset manifests and access permissions, rejecting a proposed migration to MongoDB.

## Rationale
Maintains schema compatibility with the department's existing Smart Campus Network database cluster and enforces ACID transactions across multi-author grant submissions.

## Constraints
- Enforce role-based access control linked to university Active Directory.
- Prevent orphaned dataset manifests without valid project grant IDs.

## Alternatives Evaluated
1. **PostgreSQL with JSONB metadata columns** — *SELECTED*
2. **MongoDB document collections** — *REJECTED*

## Rejected Alternatives Rationale
- **MongoDB**: The proposal to replace PostgreSQL with MongoDB was rejected because research dataset manifests require strict foreign-key relations with university grant funding IDs and published faculty papers. Without relational constraints, testing revealed orphan dataset entries.

## Outcome
Saved estimated 40 engineering hours by re-using existing database administration tooling, backup routines, and connection pooling.

## Institutional Lesson
Standardizing on a proven relational core across departmental research projects compounds institutional knowledge and eliminates redundant database management costs.
