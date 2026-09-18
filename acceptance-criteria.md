# Acceptance & QA Criteria

## Critical path tests

### AC-001 Contact accuracy
Given verified business configuration,
when a visitor opens Contact,
then address, phone, email and map location match the approved source exactly.

### AC-002 No unverified contact data
Given any required contact field is unverified,
when production build validation runs,
then deployment fails with a clear configuration error.

### AC-003 Lead submission
Given valid enquiry data,
when the visitor submits,
then exactly one lead is created and confirmation is shown.

### AC-004 Duplicate protection
Given the same request is retried,
when the idempotency key is reused,
then another lead is not created.

### AC-005 Validation
Given invalid email/phone/missing required data,
when submit is attempted,
then submission is blocked and the relevant field is identified.

### AC-006 Notification
Given a new lead,
when lead creation succeeds,
then configured internal notification is triggered.

### AC-007 WhatsApp
Given a verified WhatsApp number,
when WhatsApp CTA is clicked,
then the correct destination number is used.

### AC-008 Map
Given verified coordinates,
when map CTA is clicked,
then the configured map destination opens.

### AC-009 Admin authorization
Given a non-admin user,
when contact configuration is requested,
then access is denied.

### AC-010 Audit
Given an admin changes contact details,
then an audit record contains actor, timestamp and before/after values.

### AC-011 Mobile
Critical visitor journeys work at 320px width without horizontal scrolling.

### AC-012 Accessibility
Critical forms and navigation pass keyboard and screen-reader-oriented checks.

### AC-013 Performance
Public pages meet the agreed Core Web Vitals targets before launch.

### AC-014 SEO
Published project/service pages have valid title, description, canonical URL and indexability settings.

### AC-015 Failure handling
If lead API fails,
then the user receives a clear retry path and entered form information is not silently lost.
