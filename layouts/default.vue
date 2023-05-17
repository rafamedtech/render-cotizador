<script setup>
const user = useSupabaseUser();
</script>

<template>
  <section class="app flex flex-col overflow-x-hidden">
    <NavBar v-if="user" />
    <div
      class="relative flex flex-[1] flex-col overflow-x-auto bg-light-medium p-0 transition-all dark:bg-dark-medium"
    >
      <slot></slot>
    </div>
  </section>
</template>

<style>
.page-left-enter-active,
.page-right-enter-active,
.page-left-leave-active,
.page-right-leave-active {
  position: fixed;
  /* top: 0; */
  left: 0;
  right: 0;
  transition: all 0.3s linear;
}

.page-left-enter-from,
.page-right-leave-to {
  /* transform: translateX(100%); */
  opacity: 0;
  transform: translateX(20px);
}

.page-left-leave-to,
.page-right-enter-from {
  transform: translateX(-20px);
  opacity: 0;
  /* transform: translateX(-100%); */
}

.page-left-enter-to,
.page-right-enter-to {
  transform: translateX(0);
}
</style>
