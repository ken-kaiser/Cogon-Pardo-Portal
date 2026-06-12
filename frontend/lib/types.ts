// ── User & Auth ──────────────────────────────────────────────────
export type Role = "admin" | "staff" | "resident";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  phone_number: string;
  purok_sitio?: string;
  is_verified: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}

// ── Resident ─────────────────────────────────────────────────────
export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Resident {
  id: string;
  user: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string;
  civil_status: string;
  purok_sitio: string;
  address: string;
  contact_number: string;
  email: string;
  photo: string | null;
  verification_status: VerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Certificate Request ──────────────────────────────────────────
export type RequestStatus =
  | "pending"
  | "under_review"
  | "for_verification"
  | "approved"
  | "rejected"
  | "ready_printing"
  | "ready_pickup"
  | "completed"
  | "archived";

export type CertificateType =
  | "barangay_clearance"
  | "residency"
  | "indigency"
  | "business_permit"
  | "cedula"
  | "low_income"
  | "no_income"
  | "identification"
  | "attestation"
  | "jail_entrance"
  | "solo_parent";


export interface CertificateRequest {
  id: string;
  request_id: string;
  resident: string;
  resident_name: string;
  resident_purok_sitio?: string;
  resident_contact_number?: string;
  certificate_type: CertificateType;
  certificate_type_display: string;
  purpose: string;
  status: RequestStatus;
  status_display: string;
  requested_by: string;
  assigned_staff: string | null;
  notes: string;
  rejection_reason: string;
  extra_fields: Record<string, string | number | null>;
  qr_token: string;
  qr_code_image: string | null;
  created_at: string;
  updated_at: string;
}

// ── Notification ─────────────────────────────────────────────────
export interface Notification {
  id: string;
  recipient: string;
  title: string;
  message: string;
  channel: "in_app" | "email" | "sms";
  status: "pending" | "sent" | "failed" | "read";
  related_request: string | null;
  is_read: boolean;
  created_at: string;
}

// ── Audit Log ────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  user: string;
  action: string;
  model_name: string;
  object_id: string;
  object_repr: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  timestamp: string;
}

// ── Certificate Template ─────────────────────────────────────────
export interface CertificateTemplate {
  id: string;
  certificate_type: string;
  name: string;
  html_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Paginated Response ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Staff Applicant & Supporting Documents ──────────────────────────
export type ApplicationStatus = "pending" | "interview_scheduled" | "approved" | "rejected" | "hired";
export type EducationLevel = "high_school" | "college_undergrad" | "college_graduate" | "post_graduate" | "vocational";
export type DocumentType = "resume" | "nbi_clearance" | "police_clearance" | "government_id" | "other";

export interface ApplicantDocument {
  id: string;
  document_type: DocumentType;
  document_type_display: string;
  file: string;
  file_url: string | null;
  uploaded_at: string;
}

export interface Applicant {
  id: string;
  user: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  sitio: string;
  highest_education: EducationLevel;
  education_level_display: string;
  school_institution: string;
  year_graduated: number;
  has_criminal_record: boolean;
  background_details: string;
  status: ApplicationStatus;
  status_display: string;
  consent_checkbox: boolean;
  documents: ApplicantDocument[];
  created_at: string;
  updated_at: string;
}
