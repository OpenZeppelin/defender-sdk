export type TriggerCodeInspectorAnalysisRunRequest = {
  branchName: string;
  cloneUrl: string;
  commitHash: string;
  installationId: string;
  repoName: string;
  repoOwner: string;
};

export type TriggerCodeInspectorAnalysisRunResponse = { message: string };
