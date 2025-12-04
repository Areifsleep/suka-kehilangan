export interface AuthenticatedRequest extends Request {
  user: AuthUserObject;
}

export type AuthUserObject = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  jti?: string; // Optional JTI for logout purposes
};
