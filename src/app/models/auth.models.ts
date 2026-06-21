export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    id: number;
    email: string;
    login?: string;
    active?: boolean;
    userType: 'AGENT' | 'CLIENT';
    displayName?: string;
    clientId?: number;
    clientNom?: string;
    clientPrenom?: string;
    clientRaisonSociale?: string;
    clientNumero?: string;
    agentId?: number;
    agentNom?: string;
    agentPrenom?: string;
    agenceId?: number;
    agenceNom?: string;
    profilCode?: string;
    profilName?: string;
    portee?: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number; // timestamp ms
    user: UserSession;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserSession;
}
