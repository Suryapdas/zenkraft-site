const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export interface HomeContent {
  brand: { displayName: string; tagline: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    supportingCopy: string;
    primaryCta: string;
    secondaryCta: string;
  };
  selectedProjects: ProjectSummary[];
  services: ServiceSummary[];
  projectTypes: string[];
  budgetRanges: string[];
  timelineOptions: string[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
  coverImage: { storageKey: string; altText: string | null } | null;
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  scope: string;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  gallery: { storageKey: string; altText: string | null }[];
  seo: SeoMeta;
}

export interface ServiceSummary {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImageStorageKey: string | null;
}

export interface ServiceDetail extends ServiceSummary {
  body: string;
  deliverables: string[] | null;
  process: { step: string; description: string }[] | null;
  cta: { label: string; url: string | null } | null;
  seo: Pick<SeoMeta, "title" | "description" | "canonicalUrl">;
}

export interface SeoMeta {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  ogImageUrl?: string | null;
  structuredData?: unknown;
}

export interface ContactConfig {
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  latitude: number;
  longitude: number;
  mapUrl: string;
  businessHours: Record<string, string>;
  verified: {
    address: boolean;
    phone: boolean;
    email: boolean;
    mapPin: boolean;
    socialProfiles: boolean;
  };
  actions: {
    whatsappEnabled: boolean;
    phoneCallEnabled: boolean;
    emailEnabled: boolean;
  };
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly fieldErrors?: { field: string; code: string; message: string }[]
  ) {
    super(message);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    next: init?.cache ? undefined : { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ code: "UNKNOWN_ERROR", message: res.statusText }));
    throw new ApiRequestError(body.message ?? "Request failed", res.status, body.code ?? "UNKNOWN_ERROR", body.fieldErrors);
  }

  return res.json() as Promise<T>;
}

export function mediaUrl(storageKey: string): string {
  return `${API_BASE_URL}/media/${storageKey}`;
}

export const api = {
  getHomeContent: () => apiFetch<HomeContent>("/content/home"),
  getContact: () => apiFetch<ContactConfig>("/contact"),
  listServices: () => apiFetch<ServiceSummary[]>("/services"),
  getService: (slug: string) => apiFetch<ServiceDetail>(`/services/${encodeURIComponent(slug)}`),
  listProjects: () => apiFetch<ProjectSummary[]>("/projects"),
  getProject: (slug: string) => apiFetch<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`),
};

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  description: string;
  preferredContactMethod: "PHONE" | "WHATSAPP" | "EMAIL";
  consent: boolean;
  preferredConsultationAt?: string;
}

export interface LeadCreateResponse {
  leadId: string;
  status: string;
  message: string;
}

export async function submitLead(
  values: LeadFormValues,
  idempotencyKey: string,
  attachment?: File | null
): Promise<LeadCreateResponse> {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    cache: "no-store",
    headers: attachment ? { "Idempotency-Key": idempotencyKey } : {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: attachment ? toFormData(values, attachment) : JSON.stringify({ ...values, source: "WEBSITE" }),
  });

  const body = await res.json().catch(() => ({ code: "UNKNOWN_ERROR", message: res.statusText }));

  if (!res.ok) {
    throw new ApiRequestError(body.message ?? "Submission failed", res.status, body.code ?? "UNKNOWN_ERROR", body.fieldErrors);
  }

  return body as LeadCreateResponse;
}

function toFormData(values: LeadFormValues, attachment: File): FormData {
  const formData = new FormData();
  Object.entries({ ...values, source: "WEBSITE" }).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  formData.append("attachment", attachment);
  return formData;
}
