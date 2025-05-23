<script setup lang="ts">
import z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

useHead({
  title: "Login - Snapverse",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

definePageMeta({
  layout: "auth",
});

const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  }),
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: loginSchema,
});

const { signIn } = useAuthClient();

const pending = ref(false);

const onSubmit = handleSubmit((v) => {
  signIn.email({
    email: v.email,
    password: v.password,
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
        toast.success("Welcome back! You're now logged in.");
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
      <Card class="overflow-hidden">
        <CardContent class="grid h-full p-0 md:grid-cols-2">
          <form class="p-6 md:p-8" novalidate @submit.prevent="onSubmit">
            <div class="flex flex-col gap-6">
              <div class="flex flex-col items-center text-center">
                <h1 class="text-2xl font-bold">Welcome Back</h1>
                <p class="text-balance text-muted-foreground">
                  Login to your Snapverse account
                </p>
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
                  Logging in...
                </template>
                <template v-else> Login </template>
              </Button>
              <div class="relative text-center text-sm">
                <span class="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
                <div class="absolute inset-0 top-1/2 z-0 flex items-center border-t border-border" />
              </div>
              <Button variant="outline" class="w-full" @click="handleGithubAuth">
                <Icon name="uil:github" class="text-3xl" />
                Login with GitHub
              </Button>
              <div class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <NuxtLink href="/auth/register" class="text-primary underline underline-offset-4">
                  Sign up
                </NuxtLink>
              </div>
            </div>
          </form>
          <div class="relative hidden bg-muted md:flex md:items-stretch">
            <NuxtImg src="/images/login.jpg" alt="Login illustration" class="h-full w-full object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
