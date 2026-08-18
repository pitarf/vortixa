export interface AISubmitPayload {
  jobId: string;
  modelTechnicalName: string;
  inputs: Record<string, any>;
  webhookUrl: string;
}

export interface IAIProvider {
  submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }>;
  cancelJob(providerJobId: string): Promise<boolean>;
}
