import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],
  colorMode: {
    preference: "dark",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage",
    storageKey: "nuxt-color-mode",
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  pages: true,
  nitro: {
    experimental: {
      openAPI: true,
    },
    storage: {
      uploads: {
        driver: "fs",
        base: "./public/uploads",
      },
    },
  },
});
