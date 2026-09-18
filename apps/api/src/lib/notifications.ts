import { logger } from "./logger.js";

export interface NewLeadNotificationPayload {
  leadId: string;
  name: string;
  city: string;
  projectType: string;
  preferredContactMethod: string;
  createdAt: Date;
}

export interface NotificationChannel {
  notifyNewLead(payload: NewLeadNotificationPayload): Promise<void>;
}

/**
 * FR-008 / AC-006: Phase 1 proves the "new lead triggers a notification"
 * contract via a structured log line. Phase 3 swaps this for a real SMTP
 * channel behind the same interface — nothing above this layer changes.
 */
export class ConsoleNotificationChannel implements NotificationChannel {
  async notifyNewLead(payload: NewLeadNotificationPayload): Promise<void> {
    logger.info(
      {
        event: "lead.notification",
        leadId: payload.leadId,
        city: payload.city,
        projectType: payload.projectType,
        preferredContactMethod: payload.preferredContactMethod,
        createdAt: payload.createdAt.toISOString(),
      },
      `New enquiry received: ${payload.name} (${payload.projectType}, ${payload.city})`
    );
  }
}

export const notificationChannel: NotificationChannel = new ConsoleNotificationChannel();
