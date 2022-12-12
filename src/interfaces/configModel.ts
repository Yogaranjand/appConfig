
export interface Store {
  token : string;
  lastinvoketime: number;
}

export interface StartConfigSession {
  InitialConfigurationToken: string;
}

export interface LatestConfig {
  NextPollConfigurationToken: string;
  NextPollIntervalInSeconds: number;
  ContentType:string;
  Configuration:ArrayBufferLike
}

export interface ConfigInformation {
  Name: string;
  "Company Name": string;
  "Coding Challenge": boolean;
}

export interface SessionConfig {
  ApplicationIdentifier: string;
  ConfigurationProfileIdentifier: string;
  EnvironmentIdentifier: string;
  RequiredMinimumPollIntervalInSeconds: number;
}

export interface StubModel {
  startConfigurationSession : number;
  getLatestConfiguration: number;
}

