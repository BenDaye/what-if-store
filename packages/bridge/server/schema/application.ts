import z from 'zod';

export const installedAppsInputSchema = z
  .object({
    appName: z.string(),
    appIdentifier: z.string(),
    appInstallDate: z.string().nullable().optional(),
    appVersion: z.string().nullable().optional(),
  })
  .passthrough()
  .array();
export type InstalledAppsInputSchema = z.infer<typeof installedAppsInputSchema>;
