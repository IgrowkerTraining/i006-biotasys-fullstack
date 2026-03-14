import { API_ENDPOINTS } from "../constants/routes";

const API_BASE = API_ENDPOINTS.BASE;

export interface AcceptInvitationPayload {
  token: string;
  fullName: string;
  password: string;
}

export interface AcceptInvitationResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    organizationId?: string;
  };
}

class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ha ocurrido un error inesperado');
    }
    return data as T;
  }

  async acceptInvitation(payload: AcceptInvitationPayload): Promise<AcceptInvitationResponse> {
    const response = await fetch(`${this.baseUrl}/auth/accept-invitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handleResponse<AcceptInvitationResponse>(response);
  }
}

export const authService = new AuthService(API_BASE);
