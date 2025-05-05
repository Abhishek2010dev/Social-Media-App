<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { FetchError } from "ofetch";
import { toast } from "vue-sonner";

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
      .array(z.string().min(1, "Tag cannot be empty"), {
        required_error: "Please enter at least one tag",
        invalid_type_error: "Tags must be an array of strings",
      })
      .min(1, "You must add at least one tag")
      .transform((v) => v.join(",")),

    location: z
      .string({
        required_error: "Please enter a location",
        invalid_type_error: "Location must be a text string",
      })
      .min(1, "Location cannot be empty"),

    image: z
      .custom<File>((file) => file instanceof File, "You must upload an image")
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only JPEG, PNG, or GIF images are allowed",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Image must be 2MB or smaller",
      }),
  }),
);

const preview = ref<string | null>(null);
const pending = ref(false);

const { handleSubmit } = useForm({
  validationSchema: PostSchema,
});

const { value: image } = useField<File>("image");

watch(image, (newFile) => {
  if (newFile && newFile instanceof File && newFile.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.value = reader.result as string;
    };
    reader.readAsDataURL(newFile);
  } else {
    preview.value = null;
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    pending.value = true;
    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("location", values.location);
    formData.append("tags", values.tags);
    formData.append("image", values.image);

    await $fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    toast.success("Post created!");
    navigateTo("/");
  } catch (err) {
    if (err instanceof FetchError) {
      showError({
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
      });
    } else {
      console.error(err);
      showError({
        statusCode: 500,
        statusMessage: "An unknown error occurred",
      });
    }
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <form class="w-full space-y-6" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="caption">
      <FormItem>
        <FormLabel class="text-white">Add Caption</FormLabel>
        <FormControl>
          <Textarea
v-bind="componentField" rows="3" placeholder="Write your caption..."
            class="bg-[#1a1a1d] text-white border border-[#333] placeholder-gray-500 focus:border-blue-500 focus:ring-0 rounded-lg" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ handleChange, handleBlur }" name="image">
      <FormItem>
        <FormLabel class="text-white">Add Photo</FormLabel>
        <FormControl>
          <Card class="w-full h-72 p-4 bg-[#1a1a1d] border border-[#333] rounded-lg">
            <label
for="file-upload"
              class="w-full h-full flex items-center justify-center rounded-lg cursor-pointer border-2 border-dashed border-[#444] hover:border-blue-500 hover:bg-[#2a2a2d] transition-all">
              <template v-if="!preview">
                <div class="text-gray-500 flex flex-col items-center">
                  <svg
xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4" />
                  </svg>
                  <span class="text-sm">Click to upload</span>
                </div>
              </template>
              <template v-else>
                <div class="relative w-full h-full group">
                  <img
:src="preview" alt="Preview"
                    class="w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90" >
                  <div
                    class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium rounded-lg transition">
                    Change Image
                  </div>
                </div>
              </template>
            </label>
            <input
id="file-upload" type="file" accept="image/*" class="hidden" @change="handleChange"
              @blur="handleBlur" >
          </Card>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="location">
      <FormItem>
        <FormLabel class="text-white">Add Location</FormLabel>
        <FormControl>
          <Input
v-bind="componentField" placeholder="Enter location"
            class="bg-[#1a1a1d] text-white border border-[#333] placeholder-gray-500 focus:border-blue-500 focus:ring-0 rounded-lg" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="tags">
      <FormItem>
        <FormLabel class="text-white">Add Tags</FormLabel>
        <FormControl>
          <TagsInput
class="bg-[#1a1a1d] border border-[#333] rounded-lg" :model-value="componentField.modelValue"
            @update:model-value="componentField['onUpdate:modelValue']">
            <TagsInputItem
v-for="item in componentField.modelValue" :key="item"
              class="bg-[#2c2c2f] text-white border border-[#444]" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="#india" class="bg-transparent text-white placeholder-gray-500" />
          </TagsInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="pt-4">
      <Button
type="submit"
        class="w-full font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        :disabled="pending">
        <template v-if="pending">
          <Icon name="line-md:loading-loop" class="text-2xl animate-spin" />
          Posting...
        </template>
        <template v-else>Post</template>
      </Button>
    </div>
  </form>
</template>
