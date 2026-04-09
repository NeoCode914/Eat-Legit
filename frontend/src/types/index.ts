// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface FoodPartner {
  foodPartnerId: string;
  name: string;
  email: string;
}

export type AuthEntity =
  | { type: "user"; data: User }
  | { type: "partner"; data: FoodPartner };

// ─── Auth API Response Types ──────────────────────────────────────────────────

export interface UserAuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PartnerAuthResponse {
  message: string;
  token: string;
  user: FoodPartner;
}

// ─── Reel Types ───────────────────────────────────────────────────────────────

export interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  partnerName: string;
  createdAt: string;
}

// ─── Upload Types ─────────────────────────────────────────────────────────────

export interface PresignResponse {
  signedUrl: string;
  key: string;
  publicUrl: string;
}

export interface UploadVideoPayload {
  fileName: string;
  fileType: string;
}

// ─── Form Input Types ─────────────────────────────────────────────────────────

export interface UserSignupInput {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface PartnerSignupInput {
  name: string;
  email: string;
  password: string;
}

export interface PartnerLoginInput {
  email: string;
  password: string;
}

// ─── Local Storage Keys ───────────────────────────────────────────────────────

export const LS_TOKEN_KEY = "eat_legit_token" as const;
export const LS_AUTH_KEY = "eat_legit_auth" as const;
