<script lang="ts" setup>
import type { InvoiceOutline } from '@/types/invoice';

const props = defineProps<{
  invoice: InvoiceOutline;
}>();

const store = useStore();
const { isLoadingFull } = storeToRefs(store);

const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const dateFormatted = computed(() =>
  props.invoice.invoiceDate.toLocaleString('es-MX', dateOptions)
);
</script>

<template>
  <NuxtLink
    :to="{ path: `/cotizacion/${invoice.invId}` }"
    class="card w-full max-w-md border border-light-strong bg-white transition-transform dark:border-dark-medium dark:bg-dark-strong lg:max-w-6xl"
    @click="isLoadingFull = true"
  >
    <div class="card-body lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      <span class="text-xs text-dark-medium dark:text-light-medium lg:w-[10%]"
        ># <span class="text-primary">{{ invoice.invId }}</span></span
      >
      <span class="text-xs text-dark-medium dark:text-light-medium lg:w-[20%]">
        <span class="font-bold lg:hidden">Fecha:</span> {{ invoice.invoiceDate }}</span
      >
      <h2 class="card-title text-primary lg:w-[25%]">{{ invoice.clientCompany }}</h2>
      <p class="card-title text-dark-medium dark:text-light-medium lg:w-[25%]">
        <span class="font-bold text-primary lg:hidden">Total:</span>
        {{
          new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(invoice.invoiceTotal)
        }}
      </p>
      <div class="card-actions items-center justify-end lg:w-[20%]">
        <button class="lg:w-full"><StatusButton :status="invoice.status" /></button>
      </div>
    </div>
  </NuxtLink>
</template>
