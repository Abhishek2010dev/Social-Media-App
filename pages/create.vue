<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const PostSchema = toTypedSchema(
  z.object({
    caption: z
      .string({
        required_error: "Please enter a caption",
        invalid_type_error: "Caption must be a text string",
      })
      .min(1, "Caption cannot be empty"),

    tags: z
      .string({
        required_error: "Please enter at least one tag",
        invalid_type_error: "Tags must be a comma-separated string",
      })
      .min(1, "Tags cannot be empty"),

    location: z
      .string({
        required_error: "Please enter a location",
        invalid_type_error: "Location must be a text string",
      })
      .min(1, "Location cannot be empty"),

    file: z
      .custom<File>((file) => file instanceof File, "You must upload an image")
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only JPEG, PNG, or GIF images are allowed",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Image must be 2MB or smaller",
      }),
  }),
);
</script>

<template>
  <div>H</div>
</template>
