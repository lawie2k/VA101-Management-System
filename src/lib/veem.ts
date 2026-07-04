export class VeemClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.VEEM_CLIENT_ID || "test_client_id";
    this.clientSecret = process.env.VEEM_CLIENT_SECRET || "test_client_secret";
    // Defaults to sandbox environment unless VEEM_ENV is set to "production"
    this.baseUrl = process.env.VEEM_ENV === "production" 
      ? "https://api.veem.com" 
      : "https://sandbox-api.veem.com";
  }

  async authenticate() {
    // Implement Veem OAuth 2.0 Client Credentials flow
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({ grant_type: "client_credentials" })
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with Veem");
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  async getHeaders() {
    if (!this.accessToken) {
      await this.authenticate();
    }
    return {
      "Authorization": `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      "X-REQUEST-ID": crypto.randomUUID()
    };
  }

  async exchangeCodeForToken(code: string, redirectUri: string) {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({ 
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Veem token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // contains access_token, refresh_token, etc.
  }

  async createPayment(payload: any) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/veem/v1.1/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Failed to create payment");
    return response.json();
  }

  async getPaymentStatus(paymentId: string) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/veem/v1.1/payments/${paymentId}`, {
      method: "GET",
      headers
    });
    if (!response.ok) throw new Error("Failed to get payment status");
    return response.json();
  }
}

export const veem = new VeemClient();
