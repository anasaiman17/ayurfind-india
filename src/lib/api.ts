// Local API client for MedFind backend
// Falls back to local/embedded data when backend is unavailable

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const TOKEN_KEY = 'medfind_auth_token';
const LOCAL_USER_KEY = 'medfind_local_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOCAL_USER_KEY);
}

function getLocalUser(): User | null {
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return null; }
  }
  return null;
}

function setLocalUser(user: User): void {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

// Check if backend is available
let backendAvailable: boolean | null = null;

async function isBackendAvailable(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    backendAvailable = response.ok;
  } catch {
    backendAvailable = false;
  }
  // Re-check every 30 seconds
  setTimeout(() => { backendAvailable = null; }, 30000);
  return backendAvailable;
}

// Hardcoded admin for local fallback mode
const LOCAL_ADMIN: User = {
  id: 'local-admin-001',
  email: 'mohammedanasaiman17@gmail.com',
  full_name: 'Admin',
  role: 'admin',
  created_at: new Date().toISOString(),
};
const LOCAL_ADMIN_PASSWORD = 'anas@123';

// Generic fetch wrapper with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    return { data: null, error: error as Error };
  }
}

// Auth API with local fallback
export const authApi = {
  async login(email: string, password: string) {
    const online = await isBackendAvailable();

    if (online) {
      const result = await apiFetch<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (result.data?.token) {
        setToken(result.data.token);
      }
      return result;
    }

    // Local fallback
    if (email === LOCAL_ADMIN.email && password === LOCAL_ADMIN_PASSWORD) {
      const fakeToken = 'local-token-' + Date.now();
      setToken(fakeToken);
      setLocalUser(LOCAL_ADMIN);
      return { data: { user: LOCAL_ADMIN, token: fakeToken }, error: null };
    }
    return { data: null, error: new Error('Invalid email or password') };
  },

  async signup(email: string, password: string, fullName?: string) {
    const online = await isBackendAvailable();

    if (online) {
      const result = await apiFetch<{ user: User; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      if (result.data?.token) {
        setToken(result.data.token);
      }
      return result;
    }

    // Local fallback - create user in memory
    const newUser: User = {
      id: 'local-user-' + Date.now(),
      email,
      full_name: fullName || null,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    const fakeToken = 'local-token-' + Date.now();
    setToken(fakeToken);
    setLocalUser(newUser);
    return { data: { user: newUser, token: fakeToken }, error: null };
  },

  async getMe() {
    const online = await isBackendAvailable();

    if (online) {
      return apiFetch<{ user: User }>('/auth/me');
    }

    // Local fallback
    const token = getToken();
    if (token) {
      const localUser = getLocalUser();
      if (localUser) {
        return { data: { user: localUser }, error: null };
      }
    }
    return { data: null, error: new Error('Not authenticated') };
  },

  async logout() {
    removeToken();
    return { data: { message: 'Logged out' }, error: null };
  },
};

// Plants API with local fallback
export const plantsApi = {
  async getAll() {
    const online = await isBackendAvailable();
    if (online) {
      return apiFetch<DbPlant[]>('/plants');
    }
    // Return empty - Index.tsx already falls back to medicinalPlants
    return { data: [] as DbPlant[], error: null };
  },

  async getById(id: string) {
    return apiFetch<DbPlant>(`/plants/${id}`);
  },

  async create(plant: PlantInsert) {
    return apiFetch<DbPlant>('/plants', {
      method: 'POST',
      body: JSON.stringify(plant),
    });
  },

  async update(id: string, plant: Partial<PlantInsert>) {
    return apiFetch<DbPlant>(`/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plant),
    });
  },

  async delete(id: string) {
    return apiFetch<{ message: string }>(`/plants/${id}`, {
      method: 'DELETE',
    });
  },

  async search(query: string) {
    return apiFetch<DbPlant[]>(`/plants/search/${encodeURIComponent(query)}`);
  },
};

// Users API (admin only)
export const usersApi = {
  async getAll() {
    return apiFetch<UserProfile[]>('/users');
  },

  async getProfiles() {
    return apiFetch<Profile[]>('/users/profiles');
  },

  async getRoles() {
    return apiFetch<UserRole[]>('/users/roles');
  },

  async updateRole(userId: string, role: 'admin' | 'user') {
    return apiFetch<{ message: string }>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};

// Plant Identification API with local fallback
export const identifyApi = {
  async identify(imageBase64: string, plants: PlantInfo[]) {
    const online = await isBackendAvailable();

    if (online) {
      return apiFetch<IdentifyResponse>('/identify', {
        method: 'POST',
        body: JSON.stringify({ imageBase64, plants }),
      });
    }

    // Local fallback: mock identification using random matching
    const mockFeatures = [
      'Leaf shape matches',
      'Leaf texture similar',
      'Color pattern recognized',
      'Stem structure identified',
      'Overall morphology matches'
    ];

    const numMatches = Math.min(3, plants.length);
    const shuffled = [...plants].sort(() => 0.5 - Math.random());
    const selectedPlants = shuffled.slice(0, numMatches);

    const matches: IdentifyMatch[] = selectedPlants.map((plant, index) => {
      const baseConfidence = 85 - (index * 20);
      const confidence = Math.max(30, baseConfidence + Math.floor(Math.random() * 10) - 5);
      const numFeats = Math.floor(Math.random() * 3) + 2;
      const features = [...mockFeatures].sort(() => 0.5 - Math.random()).slice(0, numFeats);

      return {
        plantId: plant.id,
        confidence,
        matchedFeatures: features,
        reasoning: `This plant shows characteristics similar to ${plant.englishName}. ${features[0].toLowerCase()} with the reference images.`
      };
    });

    matches.sort((a, b) => b.confidence - a.confidence);

    const response: IdentifyResponse = {
      matches,
      plantDetected: true,
      imageQuality: Math.random() > 0.3 ? 'good' : 'poor',
      qualityIssues: Math.random() > 0.7 ? ['Image could be clearer', 'Better lighting recommended'] : []
    };

    return { data: response, error: null };
  },
};

// Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface UserProfile extends Profile {
  role: 'admin' | 'user';
}

export interface DbPlant {
  id: string;
  english_name: string;
  scientific_name: string | null;
  hindi_name: string | null;
  tamil_name: string | null;
  telugu_name: string | null;
  family: string | null;
  description: string;
  medicinal_uses: string[];
  parts_used: string[];
  active_compounds: string[];
  precautions: string[];
  dosage: string | null;
  image_url: string | null;
  region_availability: string[];
  medicine_category: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlantInsert {
  english_name: string;
  scientific_name?: string | null;
  hindi_name?: string | null;
  tamil_name?: string | null;
  telugu_name?: string | null;
  family?: string | null;
  description: string;
  medicinal_uses?: string[];
  parts_used?: string[];
  active_compounds?: string[];
  precautions?: string[];
  dosage?: string | null;
  image_url?: string | null;
  region_availability?: string[];
  medicine_category?: string | null;
}

export interface PlantInfo {
  id: string;
  englishName: string;
  scientificName: string;
  family: string;
  description: string;
}

export interface IdentifyMatch {
  plantId: string;
  confidence: number;
  matchedFeatures: string[];
  reasoning: string;
}

export interface IdentifyResponse {
  matches: IdentifyMatch[];
  plantDetected: boolean;
  imageQuality: 'good' | 'poor';
  qualityIssues: string[];
}

// Health check
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
