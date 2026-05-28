export type TJob = {
  name: string;
  cronExpression: string;
  handler: () => Promise<void>;
};
