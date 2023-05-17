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
    class="relative flex h-32 w-full items-center justify-between gap-0 rounded-xl border border-light-strong bg-white py-7 px-4 text-dark-medium transition-all duration-300 focus:outline-primary dark:border-dark-medium dark:bg-dark-strong dark:text-light-medium lg:h-full lg:overflow-y-hidden lg:px-8"
    @click="isLoadingFull = true"
  >
    <p class="w-[5%] text-xs lg:w-[10%]">#{{ invoice.invId }}</p>
    <p class="w-[20%] text-xs lg:text-base">
      {{ invoice.invoiceDate.toLocaleString('es-MX', dateOptions) }}
    </p>
    <p class="w-[30%] overflow-hidden text-xs lg:w-[25%] lg:text-base">
      {{ invoice.clientCompany }}
    </p>
    <Transition name="slide-in" appear>
      <div
        class="absolute right-0 bottom-0 lg:static lg:w-[25%]"
        :style="{ transitionDelay: '300ms' }"
      >
        <StatusButton :status="invoice.status" />
      </div>
    </Transition>

    <p class="w-[20%] text-xs font-bold lg:text-base">
      {{
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(invoice.invoiceTotal)
      }}
    </p>
  </NuxtLink>
</template>
