# Data Model

## Lead
- id UUID
- created_at timestamp
- updated_at timestamp
- name
- email
- phone
- city
- project_type
- budget_range
- timeline
- description
- preferred_contact_method
- consent_at
- source
- status
- priority
- owner_id
- next_action_at
- last_contacted_at

## LeadNote
- id
- lead_id
- author_id
- note
- created_at

## Project
- id
- slug
- title
- category
- location
- year
- description
- scope
- cover_media_id
- published
- created_at
- updated_at

## ProjectMedia
- id
- project_id
- storage_key
- alt_text
- sort_order

## Service
- id
- slug
- title
- description
- body
- cover_media_id
- published
- sort_order

## SiteContactConfig
- id
- phone
- whatsapp
- email
- address fields
- latitude
- longitude
- map_url
- business hours
- verification status
- updated_by
- updated_at

## AuditLog
- id
- actor_id
- entity_type
- entity_id
- action
- before_json
- after_json
- created_at
