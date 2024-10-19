import { z as zod } from "zod";

/* 
{
  "userId": "609bcd12345abcdef6789013",
  "permissions": {
    "moderator": {
      "add": true,
      "remove": false
      "update": false
    },
    "post": {
      "create": true,
      "update": true,
      "delete": true,
      "hide": false,
      "show": true,
      "pin": true
    },
    "communityPost": {
      "create": true,
      "update": true,
      "delete": true,
      "hide": false,
      "show": true
    },
    "comment": {
      "create": true,
      "delete": true,
      "hide": true,
      "show": true,
      "pin": false
    },
    "channel": {}
  }
}
*/

const moderatorPermissionsSchema = zod.object({
  add: zod.boolean().optional(),
  canRemove: zod.boolean().optional(),
  update: zod.boolean().optional(),
});

const postPermissionsSchema = zod.object({
  create: zod.boolean().optional(),
  update: zod.boolean().optional(),
  delete: zod.boolean().optional(),
  hide: zod.boolean().optional(),
  show: zod.boolean().optional(),
  pin: zod.boolean().optional(),
});

const communityPostPermissionsSchema = zod.object({
  create: zod.boolean().optional(),
  update: zod.boolean().optional(),
  delete: zod.boolean().optional(),
  hide: zod.boolean().optional(),
  show: zod.boolean().optional(),
});

const commentPermissionsSchema = zod.object({
  create: zod.boolean().optional(),
  delete: zod.boolean().optional(),
  hide: zod.boolean().optional(),
  show: zod.boolean().optional(),
  pin: zod.boolean().optional(),
});

const channelPermissionsSchema = zod.object({});

const permissionsSchema = zod.object({
  moderator: moderatorPermissionsSchema,
  post: postPermissionsSchema,
  communityPost: communityPostPermissionsSchema,
  comment: commentPermissionsSchema,
  channel: channelPermissionsSchema,
});

const createModeratorSchema = zod.object({
  userId: zod
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be string",
    })
    .trim(),
  permissions: permissionsSchema,
});

const updatePermissionsSchema = zod.object({
  moderator: moderatorPermissionsSchema.optional(),
  post: postPermissionsSchema.optional(),
  communityPost: communityPostPermissionsSchema.optional(),
  comment: commentPermissionsSchema.optional(),
  channel: channelPermissionsSchema.optional(),
});

const updateModeratorSchema = zod.object({
  permissions: updatePermissionsSchema,
});

export const ModeratorValidation = {
  createModeratorSchema,
  updateModeratorSchema,
};
