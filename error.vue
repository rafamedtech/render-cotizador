<script setup>
import notFound from '@/assets/images/not-found.png';
const error = useError();
</script>

<template>
  <NuxtLayout>
    <div
      v-if="error.statusCode === '404'"
      class="prose ml-40 grid w-full place-content-center text-dark-medium"
    >
      <h1>404</h1>
      <p>Lo sentimos, esta pagina no existe</p>
      <p>
        <strong>{{ error.message }}</strong>
      </p>
    </div>
    <div v-else class="prose ml-40 grid w-full place-content-center text-dark-medium">
      <img :src="notFound" alt="" class="mx-auto max-w-md" />
      <p>Al parecer esta pagina no existe, lo sentimos mucho!</p>
      <br />
      <p>
        Revisa el enlace con el que intentaste abrir esta cotizacion <br />
        o contacta a la persona que te la envio.
      </p>
      <p class="mt-4">
        <strong>{{ error.message }}</strong>
      </p>
    </div>
  </NuxtLayout>
</template>
