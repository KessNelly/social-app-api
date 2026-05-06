const { z } = require("zod");

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
});

const publishPostSchema = z.object({
  state: z.literal("published"),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  publishPostSchema,
};
