import {
  UnipileAccount,
  UnipileHostedAuthResponse,
  UnipileProfile,
  UnipileCredentialsAuthResponse,
  UnipileLinkedInAuthParams,
  UnipileSolveCheckpointResponse,
} from './types';

export class UnipileClient {
  private dsn: string;
  private apiKey: string;

  constructor(dsn?: string, apiKey?: string) {
    let rawDsn = (dsn || process.env.UNIPILE_DSN || '').trim().replace(/\/$/, '');
    if (rawDsn && !rawDsn.startsWith('http://') && !rawDsn.startsWith('https://')) {
      rawDsn = `https://${rawDsn}`;
    }
    this.dsn = rawDsn;
    this.apiKey = (apiKey || process.env.UNIPILE_API_KEY || '').trim();
  }

  public getDsn(): string {
    let rawDsn = (this.dsn || process.env.UNIPILE_DSN || '').trim().replace(/\/$/, '');
    if (rawDsn && !rawDsn.startsWith('http://') && !rawDsn.startsWith('https://')) {
      rawDsn = `https://${rawDsn}`;
    }
    return rawDsn;
  }

  public getApiKey(): string {
    return (this.apiKey || process.env.UNIPILE_API_KEY || '').trim();
  }

  public isConfigured(): boolean {
    return Boolean(this.getDsn() && this.getApiKey());
  }

  private getHeaders(includeJsonContentType = true): Record<string, string> {
    return {
      'X-API-KEY': this.getApiKey(),
      'Accept': 'application/json',
      ...(includeJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error(
        'El motor de conexion de LinkedIn (Unipile) no esta configurado. Revisa las variables UNIPILE_DSN y UNIPILE_API_KEY.'
      );
    }

    const dsn = this.getDsn();
    const url = `${dsn}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorBody = '';
      try {
        errorBody = await res.text();
      } catch {
        // ignore
      }
      const error = new Error(
        `Error del motor de LinkedIn [${res.status} ${res.statusText}]: ${errorBody || 'Sin detalle'}`
      ) as Error & { status?: number; body?: string; endpoint?: string };
      error.status = res.status;
      error.body = errorBody;
      error.endpoint = endpoint;
      throw error;
    }

    return (await res.json()) as T;
  }

  /**
   * Genera un enlace seguro de autenticación Hosted para conectar la cuenta de LinkedIn
   */
  async getHostedAuthLink(params: {
    type?: 'create' | 'reconnect';
    reconnect_account?: string;
    providers?: string[];
    success_redirect_url?: string;
    failure_redirect_url?: string;
    notify_url?: string;
    name?: string;
  } = {}): Promise<UnipileHostedAuthResponse> {
    const type = params.type || 'create';
    const payload = {
      type,
      ...(type === 'reconnect'
        ? { reconnect_account: params.reconnect_account }
        : { providers: params.providers || ['LINKEDIN'] }),
      api_url: this.getDsn(),
      expiresOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      ...(params.success_redirect_url ? { success_redirect_url: params.success_redirect_url } : {}),
      ...(params.failure_redirect_url ? { failure_redirect_url: params.failure_redirect_url } : {}),
      ...(params.notify_url ? { notify_url: params.notify_url } : {}),
      ...(params.name ? { name: params.name } : {}),
    };

    return this.request<UnipileHostedAuthResponse>('/api/v1/hosted/accounts/link', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Conecta una cuenta de LinkedIn usando credenciales o cookie de sesion li_at (Native Auth)
   */
  async startCredentialsAuth(params: UnipileLinkedInAuthParams): Promise<UnipileCredentialsAuthResponse> {
    const payload: Record<string, unknown> = {
      provider: 'LINKEDIN',
      ...(params.name ? { name: params.name } : {}),
      ...(params.country?.trim() ? { country: params.country.trim().toUpperCase() } : {}),
      ...(params.proxy ? { proxy: params.proxy } : {}),
    };

    if (params.accessToken?.trim()) {
      payload.access_token = params.accessToken.trim();
      if (params.premiumToken?.trim()) payload.premium_token = params.premiumToken.trim();
      if (params.userAgent?.trim()) payload.user_agent = params.userAgent.trim();
    } else if (params.username && params.password) {
      payload.username = params.username.trim();
      payload.password = params.password;
    }

    return this.request<UnipileCredentialsAuthResponse>('/api/v1/accounts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Resuelve el checkpoint de verificacion (2FA / SMS) para una cuenta de LinkedIn
   */
  async solveCheckpoint(params: {
    accountId: string;
    code: string;
  }): Promise<UnipileSolveCheckpointResponse> {
    const payload = {
      provider: 'LINKEDIN',
      account_id: params.accountId,
      code: params.code.trim(),
    };

    return this.request<UnipileSolveCheckpointResponse>('/api/v1/accounts/checkpoint', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Lista todas las cuentas conectadas a Unipile
   */
  async listAccounts(): Promise<{ items: UnipileAccount[] }> {
    return this.request<{ items: UnipileAccount[] }>('/api/v1/accounts');
  }

  /**
   * Obtiene los detalles de una cuenta especifica
   */
  async getAccount(accountId: string): Promise<UnipileAccount> {
    return this.request<UnipileAccount>(`/api/v1/accounts/${accountId}`);
  }

  /**
   * Elimina / desconecta una cuenta de Unipile
   */
  async deleteAccount(accountId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/v1/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtiene el perfil propio de la cuenta de LinkedIn conectada
   */
  async getOwnProfile(accountId: string): Promise<UnipileProfile> {
    return this.request<UnipileProfile>(
      `/api/v1/users/me?account_id=${encodeURIComponent(accountId)}`
    );
  }

  /**
   * Resuelve el perfil público de LinkedIn
   */
  async resolveProfile(identifier: string, accountId: string): Promise<UnipileProfile> {
    const rawIdentifier = identifier.trim();
    let cleanId = rawIdentifier;
    try {
      const url = new URL(rawIdentifier);
      const match = url.pathname.match(/\/in\/([^/]+)/i);
      cleanId = match?.[1] || url.pathname.split("/").filter(Boolean).pop() || rawIdentifier;
    } catch {
      cleanId = rawIdentifier
        .replace(/^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\//i, '')
        .split(/[/?#]/)[0];
    }
    cleanId = decodeURIComponent(cleanId).trim();
    if (!cleanId) throw new Error('La URL o identificador de LinkedIn no es valido');

    const query = new URLSearchParams({
      account_id: accountId,
      linkedin_sections: '*',
    });
    return this.request<UnipileProfile>(
      `/api/v1/users/${encodeURIComponent(cleanId)}?${query.toString()}`
    );
  }
}

export const unipile = new UnipileClient();
