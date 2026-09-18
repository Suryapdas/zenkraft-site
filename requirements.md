# Functional Requirements

## FR-001 Brand identity
The system shall display the approved ZENKRAFT brand name, logo, tagline and positioning.

Acceptance:
- No hard-coded conflicting brand variants.
- Brand values are sourced from configuration/content.

## FR-002 Contact identity
The system shall display only verified phone, email, address and map information.

Acceptance:
- Unverified placeholders cannot appear in production.
- Address, map pin and contact channels originate from one configuration source.

## FR-003 Homepage
The homepage shall communicate:
1. What ZENKRAFT does.
2. Why a visitor should trust it.
3. What type of projects it handles.
4. How to start a project.

## FR-004 Services
Services shall be configurable and support title, description, image, process, CTA and SEO metadata.

Initial categories:
- Interior Design
- Architecture
- Construction
- Turnkey Execution
- Renovation

## FR-005 Portfolio
Projects shall support:
- Title
- Category
- Location
- Year
- Cover image
- Gallery
- Description
- Scope
- Status/publish state
- SEO metadata

## FR-006 Project enquiry
The enquiry form shall capture:
- Name
- Phone
- Email
- City/location
- Project type
- Budget range
- Timeline
- Project description
- Preferred contact method
- Consent

Optional:
- Attachment
- Preferred consultation date/time

## FR-007 Lead qualification
Each enquiry shall have:
- Lead ID
- Created timestamp
- Source
- Status
- Owner
- Priority
- Next action
- Notes
- Last contacted timestamp

Statuses:
NEW → CONTACTED → QUALIFIED → CONSULTATION → PROPOSAL → WON / LOST

## FR-008 Notifications
New enquiries shall trigger notification to the configured enquiry channel.

## FR-009 Confirmation
After successful submission, the visitor shall see a confirmation containing:
- Submission acknowledgement
- Expected response timeframe
- Direct WhatsApp/call option where configured

## FR-010 WhatsApp
WhatsApp CTA shall use the verified configured number and prefilled context where supported.

## FR-011 Map
The map component shall use the verified coordinates/pin. It must not infer an office location from an unverified text address.

## FR-012 Admin
Authorized users shall manage:
- Leads
- Projects
- Services
- Contact configuration
- Basic site content

## FR-013 Search/SEO
Each public project/service page shall support configurable:
- title
- description
- canonical URL
- Open Graph metadata
- structured data where appropriate

## FR-014 Analytics
Track:
- CTA clicks
- enquiry starts
- enquiry submissions
- WhatsApp clicks
- phone clicks
- map clicks
- portfolio views
- consultation conversions

## FR-015 Auditability
Admin changes to contact details and published content shall record actor, timestamp and changed fields.
