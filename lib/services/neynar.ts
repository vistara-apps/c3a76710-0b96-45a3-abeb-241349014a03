import axios from 'axios';

const NEYNAR_API_BASE = 'https://api.neynar.com/v2';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
}

export interface FarcasterAuthResponse {
  user: FarcasterUser;
  token: string;
}

class NeynarService {
  private apiKey: string;

  constructor() {
    if (!NEYNAR_API_KEY) {
      throw new Error('NEYNAR_API_KEY is required');
    }
    this.apiKey = NEYNAR_API_KEY;
  }

  private getHeaders() {
    return {
      'accept': 'application/json',
      'api_key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get user information by FID (Farcaster ID)
   */
  async getUserByFid(fid: number): Promise<FarcasterUser> {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/farcaster/user/bulk?fids=${fid}`,
        { headers: this.getHeaders() }
      );

      if (response.data.users && response.data.users.length > 0) {
        return response.data.users[0];
      }

      throw new Error('User not found');
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }
  }

  /**
   * Get user information by username
   */
  async getUserByUsername(username: string): Promise<FarcasterUser> {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/farcaster/user/by_username?username=${username}`,
        { headers: this.getHeaders() }
      );

      return response.data.user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  /**
   * Verify a Farcaster signature for authentication
   */
  async verifySignature(
    message: string,
    signature: string,
    fid: number
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${NEYNAR_API_BASE}/farcaster/frame/validate`,
        {
          message_bytes_in_hex: message,
          signature: signature,
          fid: fid,
        },
        { headers: this.getHeaders() }
      );

      return response.data.valid === true;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Get user's casts (posts)
   */
  async getUserCasts(fid: number, limit: number = 25): Promise<any[]> {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`,
        { headers: this.getHeaders() }
      );

      return response.data.casts || [];
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw error;
    }
  }

  /**
   * Post a cast (for notifications or updates)
   */
  async postCast(
    signerUuid: string,
    text: string,
    embeds?: Array<{ url: string }>
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${NEYNAR_API_BASE}/farcaster/cast`,
        {
          signer_uuid: signerUuid,
          text: text,
          embeds: embeds || [],
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error posting cast:', error);
      throw error;
    }
  }

  /**
   * Get user's followers
   */
  async getUserFollowers(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/farcaster/followers?fid=${fid}&limit=${limit}`,
        { headers: this.getHeaders() }
      );

      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching user followers:', error);
      throw error;
    }
  }

  /**
   * Get user's following
   */
  async getUserFollowing(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/farcaster/following?fid=${fid}&limit=${limit}`,
        { headers: this.getHeaders() }
      );

      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching user following:', error);
      throw error;
    }
  }
}

export const neynarService = new NeynarService();
