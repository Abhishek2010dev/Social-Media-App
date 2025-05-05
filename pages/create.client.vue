<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { FetchError } from "ofetch";
import { toast } from "vue-sonner";
import { ImagePlus, X } from "lucide-vue-next";

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

const triggerFileInput = () => {
  const fileInput = document.getElementById("image") as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

const clearImagePreview = (event: MouseEvent) => {
  event.stopPropagation();
  preview.value = null;
  const fileInput = document.getElementById("image") as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
};
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <FormField v-slot="{ handleChange, handleBlur }" name="image">
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <div
:class="[
                  'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all hover:bg-muted/50',
                  preview ? 'border-primary' : 'border-muted',
                ]" @click="triggerFileInput">
                  <input
id="image" type="file" accept="image/*" class="hidden" @change="handleChange"
                    @blur="handleBlur" >
                  <div v-if="preview">
                    <div class="relative w-full">
                      <img
:src="preview || '/placeholder.svg'" alt="Preview"
                        class="mx-auto max-h-[300px] rounded-lg object-contain" >
                      <Button
type="button" variant="destructive" size="icon" class="absolute right-2 top-2"
                        @click.stop="clearImagePreview">
                        <X class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center text-center">
                    <ImagePlus class="mb-2 h-10 w-10 text-muted-foreground" />
                    <p class="text-sm font-medium">Click to upload an image</p>
                    <p class="text-xs text-muted-foreground">
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <Separator />

        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="caption">
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea
class="min-h-[100px] resize-none" placeholder="Write a caption for your post..."
                  v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="tags">
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
:model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']">
                  <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                  <TagsInputInput placeholder="Add tags (press Enter after each tag)" />
                </TagsInput>
              </FormControl>
              <FormDescription>
                Tags help people discover your post. Enter tags without the #
                symbol.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="location">
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Add location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter class="flex justify-end">
        <Button type="submit" :disabled="pending">
          <template v-if="pending">
            <Icon name="line-md:loading-loop" class="text-2xl animate-spin" />
            Posting...
          </template>
          <template v-else>Post</template>
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
