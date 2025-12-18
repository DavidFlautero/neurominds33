import { z } from "zod";

export const ProjectConfigSchema = z.object({
  projectId: z.string().min(1),
  siteUrl: z.string().url(),
  goals: z.object({
    primary: z.string().min(1),
    secondary: z.array(z.string()).optional(),
  }),
  competitors: z.array(z.object({ name: z.string().min(1), url: z.string().url() })).default([]),
  guardrails: z.object({
    monthlyBudgetUsd: z.number(),
    dailyBudgetUsd: z.number(),
    maxCACUsd: z.number(),
    requiresApprovalAboveUsd: z.number(),
  }),
  integrations: z
    .object({
      ga4: z.object({ propertyId: z.string().min(1) }).optional(),
      searchConsole: z.object({ siteUrl: z.string().min(1) }).optional(),
      clarity: z.object({ projectId: z.string().min(1) }).optional(),
      ads: z
        .object({
          google: z.object({ customerId: z.string().min(1) }).optional(),
          meta: z.object({ adAccountId: z.string().min(1) }).optional(),
          tiktok: z.object({ advertiserId: z.string().min(1) }).optional(),
        })
        .optional(),
    })
    .optional(),
  preferences: z
    .object({
      noPopups: z.boolean().optional(),
      noPricingChanges: z.boolean().optional(),
      tone: z.enum(["aggressive", "balanced", "conservative"]).optional(),
    })
    .optional(),
});

export const IdSchema = z.object({
  projectId: z.string().min(1),
  id: z.string().min(1),
});

export const RecommendationIdsSchema = z.object({
  projectId: z.string().min(1),
  recommendationIds: z.array(z.string().min(1)).min(1),
});

export const TaskDeliverSchema = z.object({
  projectId: z.string().min(1),
  taskId: z.string().min(1),
  cfg: ProjectConfigSchema, // needed to re-scan and validate
});
