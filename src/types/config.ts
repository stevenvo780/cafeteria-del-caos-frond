/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InfractionDto {
  name: string;
  value: string;
  points: number;
  emoji: string;
  description: string;
}

export interface Config {
  id: number;
  generalNormative: string;
  staffNormative: string;
  projectInfo: string;
  privacyPolicies: string;
  privacyNotice: string;
  watchedChannels: string[];
  watchedForums: string[];
  infractions: InfractionDto[];
}

export enum LibraryVisibility {
  GENERAL = 'general',
  USERS = 'users',
  ADMIN = 'admin',
}

export interface LibraryConfig {
  defaultFolder: string;
  defaultVisibility: LibraryVisibility;
  forumConfig: {
    enabled: boolean;
    autoCreate: boolean;
    defaultFolder: string;
  };
}

export interface BotConfig {
  rewards: {
    messages: {
      amount: number;
      coins: number;
      excludedChannels: string[];
    };
    specialChannels: {
      channels: string[];
      amount: number;
      coins: number;
    };
    voiceTime: {
      minutes: number;
      coins: number;
      excludedChannels: string[];
    };
    forums: {
      coins: number;
      allowedForums: string[];
    };
  };
  channels: {
    rewardChannelId: string;
  };
  messages: {
    recompensa: string;
    error: string;
  };
  library: LibraryConfig;
}

export interface XpRole {
  roleId: string;
  name: string;
  requiredXp: number;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

export interface UserDiscord {
  id: string;
  username: string;
  roles: DiscordRole[];
  points: number;
  experience: number;
  discordData: any;
}
