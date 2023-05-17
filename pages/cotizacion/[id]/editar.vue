<script lang="ts" setup>
import { Modal } from '@/types/modal';

const store = useStore();

const { backBtn } = storeToRefs(store);
function discardInvoice() {
  store.$patch({
    modalType: Modal.DiscardEdit,
  });
  backBtn.value?.click();
}

definePageMeta({
  middleware: ['auth'],
  pageTransition: {
    name: 'slide',
    mode: 'out-in',
  },
});
</script>

<template>
  <main>
    <section
      class="container mt-4 flex flex-col items-center gap-8 p-2 pb-24 lg:min-w-min lg:max-w-3xl"
    >
      <button
        type="button"
        @click="discardInvoice"
        class="z-50 flex items-center gap-2 self-start text-light-medium"
      >
        <label ref="backBtn" for="my-modal-6" class="hidden"></label>
        <Icon class="text-2xl text-primary" name="heroicons-solid:arrow-left" />
        <span class="text-xs text-dark-medium dark:text-light-strong">Regresar</span>
      </button>

      <InvoiceForm edit />
    </section>
  </main>
</template>
