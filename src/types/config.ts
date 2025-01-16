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
