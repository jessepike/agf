
# Security Architecture Review Ontology v0.1
## Decision Intelligence Platform

## Purpose

This ontology defines the **core semantic model** used by the Decision Intelligence Platform
to evaluate security architecture decisions.

It provides consistent definitions for:

- entities
- relationships
- trust boundaries
- data classifications
- threat categories
- control families
- decision outcomes

This ontology ensures that automated reasoning modules produce **consistent structured outputs**.

---

# 1. Core Ontology Layers

The ontology is organized into six conceptual layers:

1. System Layer
2. Data Layer
3. Interaction Layer
4. Trust & Exposure Layer
5. Threat Layer
6. Control Layer

---

# 2. System Layer

Represents systems, components, and services involved in the architecture.

## Entity Types

| Entity | Description |
|------|-------------|
| System | Top-level business or technical system |
| Application | Software application |
| Service | Microservice or backend service |
| API | Interface for service communication |
| Infrastructure | Compute or hosting platform |
| DataStore | Database, storage bucket, warehouse |
| Queue | Messaging system |
| Function | Serverless function |
| Container | Containerized workload |
| Model | AI or ML model |
| Integration | External integration point |
| Vendor | Third-party provider |

---

# 3. Data Layer

Represents types of data handled by the system.

## Entity Types

| Entity | Description |
|------|-------------|
| Dataset | Collection of related data |
| DataClass | Sensitivity classification |
| DataElement | Individual data field |
| Credential | Secret or authentication material |
| Token | API or auth token |
| Key | Encryption key |

## Data Classification

| Class | Description |
|------|-------------|
| Public | No confidentiality requirement |
| Internal | Internal business information |
| Confidential | Sensitive internal data |
| Restricted | Highly sensitive regulated data |
| Regulated | Data covered by legal regulations |

Examples:

- PII
- PHI
- PCI
- Financial records
- Authentication credentials

---

# 4. Interaction Layer

Describes system interactions and flows.

## Relationship Types

| Relationship | Description |
|-------------|-------------|
| calls | Service invokes another service |
| reads_from | Reads data from datastore |
| writes_to | Writes data to datastore |
| transfers_to | Sends data externally |
| authenticates_with | Uses authentication service |
| integrates_with | Integrates with external system |
| triggers | Event or workflow trigger |
| depends_on | Dependency relationship |

---

# 5. Trust & Exposure Layer

Represents exposure and trust boundaries.

## Entity Types

| Entity | Description |
|------|-------------|
| TrustBoundary | Boundary between trust zones |
| NetworkZone | Logical network zone |
| Environment | Runtime environment |
| AccessSurface | Exposed entry point |

Examples:

- Internet
- Corporate network
- Private VPC
- Partner network
- Mobile device

---

# 6. Threat Layer

Threats represent potential security risks in the architecture.

## Threat Categories

Based loosely on STRIDE.

| Threat | Description |
|------|-------------|
| Spoofing | Identity impersonation |
| Tampering | Data manipulation |
| Repudiation | Lack of action traceability |
| InformationDisclosure | Unauthorized data access |
| DenialOfService | Service disruption |
| ElevationOfPrivilege | Unauthorized privilege escalation |

Additional categories relevant to modern systems:

| Threat | Description |
|------|-------------|
| DataLeakage | Data exposure outside trust boundary |
| ModelAbuse | Abuse of AI/ML model |
| SupplyChainRisk | Dependency compromise |
| Misconfiguration | Security control misconfiguration |
| ExcessivePrivilege | Overly broad permissions |
| CredentialExposure | Secrets leakage |

---

# 7. Control Layer

Represents security controls used to mitigate threats.

## Control Families

| Control Family | Description |
|---------------|-------------|
| Authentication | Identity verification |
| Authorization | Access control |
| Encryption | Data protection |
| NetworkSecurity | Network segmentation |
| Monitoring | Logging and detection |
| KeyManagement | Cryptographic key protection |
| DataProtection | Data classification & masking |
| SecretsManagement | Secure credential storage |
| Integrity | Tamper prevention |
| Availability | Resilience and redundancy |

---

# 8. Example Control Types

| Control | Description |
|------|-------------|
| MFA | Multi-factor authentication |
| RBAC | Role-based access control |
| EncryptionAtRest | Data encryption |
| EncryptionInTransit | TLS protection |
| IAMLeastPrivilege | Minimal access permissions |
| APIAuthentication | Authenticated API access |
| InputValidation | Input validation |
| AuditLogging | Security audit logging |
| RateLimiting | Request throttling |
| SecretsVault | Secure secret storage |

---

# 9. Decision Outcomes

Possible governance outcomes.

| Outcome | Description |
|--------|-------------|
| Approve | Architecture acceptable |
| ApproveWithConditions | Changes required before deployment |
| Reject | Architecture unacceptable |
| Escalate | Requires higher authority |
| Defer | Await additional evidence |
| ExceptionGranted | Risk accepted with exception |

---

# 10. Risk Dimensions

Risk scoring considers multiple dimensions.

| Dimension | Description |
|----------|-------------|
| Likelihood | Probability of exploitation |
| Impact | Business damage potential |
| Detectability | Ability to detect attack |
| Exposure | Attack surface size |
| ControlStrength | Effectiveness of controls |

Residual risk is calculated after controls.

---

# 11. Example Ontology Instance

Example simplified architecture:

System: Customer Analytics Platform

Entities:

- Web Application
- API Gateway
- Analytics Service
- Data Warehouse
- Third-party Analytics Vendor

Relationships:

- Web App calls API Gateway
- API Gateway calls Analytics Service
- Analytics Service writes to Data Warehouse
- Analytics Service transfers data to Vendor

Threats detected:

- DataLeakage
- ExcessivePrivilege
- InformationDisclosure

Controls recommended:

- EncryptionInTransit
- IAMLeastPrivilege
- APIAuthentication

Outcome:

ApproveWithConditions

---

# 12. Design Principles

The ontology should follow these principles:

- extensible
- versioned
- workflow-agnostic
- machine-readable
- human understandable

---

# 13. Versioning

Ontology versions should follow semantic versioning.

Example:

security-ontology-v0.1.0

Changes must record:

- added entities
- removed entities
- modified relationships
- control updates

---

# 14. Future Extensions

Future ontology versions may add:

- regulatory mappings (NIST, ISO, CIS)
- AI safety threats
- supply chain risk taxonomy
- business impact modeling
- financial loss modeling

---

# Summary

This ontology defines the **semantic structure** used by the Decision Graph system.

It enables:

- consistent reasoning
- explainable decisions
- reusable workflows
- governance traceability
