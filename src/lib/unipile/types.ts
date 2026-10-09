export interface UnipileAccountSource {
  id?: string;
  status?: 'OK' | 'STOPPED' | 'ERROR' | 'CREDENTIALS' | 'PERMISSIONS' | 'CONNECTING' | string;
}

export interface UnipileAccount {
  id: string;
  type?: 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'MESSENGER' | 'TELEGRAM' | 'GOOGLE' | 'MICROSOFT' | 'IMAP' | string;
  provider?: 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'MESSENGER' | 'TELEGRAM' | 'GOOGLE' | 'MICROSOFT' | 'IMAP' | string;
  status?: string;
  sources?: UnipileAccountSource[];
  name?: string;
  created_at?: string;
  connection_params?: Record<string, unknown>;
}

export interface UnipileHostedAuthResponse {
  object: 'HostedAuthLink' | 'HostedAuthURL' | string;
  url: string;
}

export interface UnipileHostedAuthCallback {
  status: 'CREATION_SUCCESS' | 'RECONNECTED' | string;
  account_id: string;
  name?: string;
}

export interface UnipileCredentialsAuthResponse {
  object?: 'Account' | 'Checkpoint' | string;
  id?: string;
  account_id?: string;
  checkpoint?: {
    type?: '2FA' | string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface UnipileProxyConfig {
  host: string;
  port: number;
  protocol?: 'http' | 'https' | 'socks5';
  username?: string;
  password?: string;
}

export interface UnipileLinkedInAuthParams {
  username?: string;
  password?: string;
  accessToken?: string;
  premiumToken?: string;
  country?: string;
  proxy?: UnipileProxyConfig;
  userAgent?: string;
  name?: string;
}

export interface UnipileSolveCheckpointResponse {
  object?: string;
  id?: string;
  account_id?: string;
  [key: string]: unknown;
}

export interface UnipileProfile {
  object: 'UserProfile' | string;
  provider: string;
  provider_id: string;
  public_identifier?: string | null;
  public_profile_url?: string | null;
  profile_url?: string | null;
  member_urn?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  headline?: string | null;
  summary?: string | null;
  picture_url?: string | null;
  profile_picture_url?: string | null;
  profile_picture_url_large?: string | null;
  location?: string | null;
  network_distance?: 'FIRST_DEGREE' | 'SECOND_DEGREE' | 'THIRD_DEGREE' | 'OUT_OF_NETWORK' | string;
  is_relationship?: boolean;
  connected_at?: number | string | null;
}

export interface ConnectedLinkedInAccount {
  id: string;
  unipileAccountId: string;
  name: string;
  email?: string;
  headline?: string;
  profilePictureUrl?: string;
  publicProfileUrl?: string;
  status: 'OK' | 'CHECKPOINT' | 'ERROR' | 'CONNECTING' | 'CREDENTIALS';
  authMode: 'hosted' | 'credentials' | 'cookie';
  connectedAt: string;
  lastSyncAt: string;
  ownerId?: string;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  dailyActionsCount?: {
    invitationsSent: number;
    messagesSent: number;
    profilesVisited: number;
  };
}
