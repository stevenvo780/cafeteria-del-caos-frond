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

export interface BotConfig {
  rewards: {
    messages: {
      amount: number;
      coins: number;
      allowedChannels: string[];
    };
    voiceTime: {
      minutes: number;
      coins: number;
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
    saldo: string;
  };
}

export interface XpRole {
  roleId: string;
  name: string;
  requiredXp: number;
}