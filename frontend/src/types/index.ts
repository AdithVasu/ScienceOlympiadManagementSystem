export type Role = 0 | 1 | 2;

export interface User {
  _id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  role: Role;
  isVerified: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRSVP {
  _id?: string;
  user: User | string;
  isAttending: boolean;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  timeBlock: string;
  rsvps: EventRSVP[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventScore {
  _id: string;
  student: User | string;
  event: Event | string;
  score: string | number;
  partners: Array<User | string>;
  status: 'Pending' | 'Approved';
  createdAt?: string;
  updatedAt?: string;
}

export interface VolunteerHours {
  _id: string;
  volunteer: User | string;
  date: string;
  hours: number;
  status: 'Pending' | 'Approved';
  approvedBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  role: Role;
}

export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  emailAddress: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface EventScoreSubmissionRequest {
  eventId: string;
  score: string | number;
  partners?: string[];
}

export interface VolunteerHoursSubmissionRequest {
  userId: string;
  date: string;
  hours: number;
  description?: string;
  category?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface AuthUser {
  id: string;
  role: Role;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
}
