<script setup>
const store = useStore();
const { isLoadingFull, openAlert } = storeToRefs(store);
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
  width: 100%;
  padding: 80px 10px 8rem 10px;
  max-width: 850px;
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
</style>
