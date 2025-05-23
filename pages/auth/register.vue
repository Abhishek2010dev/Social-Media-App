<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toast } from "vue-sonner";

useHead({
  title: "Register - Snapverse",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

definePageMeta({
  layout: "auth",
});

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string({ required_error: "First name is required" }),
    lastName: z.string({ required_error: "Last name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  }),
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const { signUp, signIn } = useAuthClient();

const pending = ref(false);

const onSubmit = handleSubmit(async (v) => {
  await signUp.email({
    email: v.email,
    password: v.password,
    name: `${v.firstName} ${v.lastName}`,
    callbackURL: "/",
    fetchOptions: {
      onRequest() {
        pending.value = true;
      },
      onResponse() {
        pending.value = false;
      },
      onError(context) {
        toast.error("Error", {
          description: context.error.message,
        });
      },
      onSuccess() {
        toast.success(
          "Registration complete. Check your email to verify your account",
        );
        navigateTo("/");
      },
    },
  });
});

const handleGithubAuth = async () => {
  await signIn.social({
    provider: "github",
  });
};
</script>
<template>
  <div class="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form novalidate @submit.prevent="onSubmit">
            <div class="grid gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <FormField v-slot="{ componentField }" name="firstName" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Max" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-2">
                  <FormField v-slot="{ componentField }" name="lastName" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Robinson" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" aria-label="Email" placeholder="max@example.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" aria-label="Password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <Button type="submit" class="w-full" :disabled="pending">
                <template v-if="pending">
                  <Icon name="line-md:loading-loop" class="text-3xl" />
                  Creating account...
                </template>
                <template v-else> Create an account </template>
              </Button>

              <Button variant="outline" class="w-full" :disabled="pending" @click="handleGithubAuth">
                <Icon name="uil:github" class="text-3xl" />
                Sign up with GitHub
              </Button>
            </div>
            <div class="mt-4 text-center text-sm">
              Already have an account?
              <NuxtLink href="/auth/login" class="underline">
                Sign in
              </NuxtLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
