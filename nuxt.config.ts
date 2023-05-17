// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //   css: ['@/assets/css/tailwind.css'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
    },
    // pageTransition: { name: 'slide', mode: 'out-in' },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@kevinmarrec/nuxt-pwa',
  ],

  pinia: {
    autoImports: ['storeToRefs'],
  },

  imports: {
    dirs: ['stores'],
  },

  pwa: {
    manifest: {
      name: 'Cotizador',
      short_name: 'Cotizador',
      theme_color: '#ffffff',
      lang: 'es',
    },
  },
});
