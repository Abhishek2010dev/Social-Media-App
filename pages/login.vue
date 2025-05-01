<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { NuxtLink } from "#components";
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
      <Card class="overflow-hidden">
        <CardContent class="grid h-full p-0 md:grid-cols-2">
          <form class="p-6 md:p-8" @submit.prevent>
            <div class="flex flex-col gap-6">
              <div class="flex flex-col items-center text-center">
                <h1 class="text-2xl font-bold">Welcome Back</h1>
                <p class="text-balance text-muted-foreground">
                  Login to your Snapverse account
                </p>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" aria-label="Email" placeholder="m@example.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <div class="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <NuxtLink
href="/forget-password"
                        class="text-sm text-muted-foreground underline-offset-2 hover:underline">
                        Forgot your password?
                      </NuxtLink>
                    </div>
                    <FormControl>
                      <Input type="password" aria-label="Password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <Button type="submit" class="w-full">Login</Button>
              <div class="relative text-center text-sm">
                <span class="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
                <div class="absolute inset-0 top-1/2 z-0 flex items-center border-t border-border" />
              </div>
              <Button variant="outline" class="w-full">
                Login with GitHub
              </Button>
              <div class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <NuxtLink href="/register" class="text-primary underline underline-offset-4">
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
