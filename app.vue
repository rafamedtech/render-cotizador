<script setup>
const store = useStore();
const { isLoadingFull, openAlert } = storeToRefs(store);

useHead({
  title: 'Render Cotizador',
  meta: [
    {
      name: 'description',
      content: 'Haz recibido una cotización de Render',
    },
  ],
});
</script>

<template>
  <main class="relative transition-all">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ScreenLoader v-if="isLoadingFull" />
    <AppModal />
    <Transition name="alert">
      <AlertCard v-if="openAlert" />
    </Transition>
  </main>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.app {
  min-height: 100vh;
  @media (min-width: 900px) {
    flex-direction: row !important;
  }
}

// utility classes

.custom-container {
  max-width: 850px;
  width: 100%;

  padding: 80px 10px 8rem 10px;
  margin: 0 auto;

  @media (min-width: 768px) {
    // padding-left: 228px;
    padding-left: calc(8rem + 100px);
    padding-right: 100px;
  }

  @media (min-width: 900px) {
    padding: 72px 10px 40px 10px;
  }
}

// .custom-container {
//   @apply md:pl-[calc(8rem + 100px)] mx-auto w-full max-w-[850px] pb-[8rem] pl-[10px] pr-[10px] pt-[80px] md:pr-[100px] lg:pb-[40px] lg:pl-[10px] lg:pr-[10px] lg:pt-[72px];
// }
</style>
