<script lang="ts" setup>
// import Contact from '@/types/contact';

const { invoices } = await useInvoices();
const vendidas = computed(() => invoices.value?.filter((invoice) => invoice.status === 'Vendida'));
const pendientes = computed(() =>
  invoices.value?.filter((invoice) => invoice.status === 'Pendiente')
);
const canceladas = computed(() =>
  invoices.value?.filter((invoice) => invoice.status === 'Cancelada')
);

const totalInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === 'Vendida')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalPendingInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === 'Pendiente')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalCanceledInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === 'Cancelada')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});

const store = useStore();
const { contactData, searchQuery, isLoadingFull } = storeToRefs(store);
// const { isLoading, isLoadingFull, backBtn, modalType } = storeToRefs(store);

isLoadingFull.value = false;
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);

function clientInvoices(client) {
  searchQuery.value = client.clientCompany;
  return navigateTo('/cotizaciones');
}

useHead({
  title: 'Inicio | Suntech Cotizador',
});

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <main class="custom-container grid place-content-center pb-[8rem]">
    <h1 class="text-2xl text-primary dark:text-primary/50 lg:text-3xl">Inicio</h1>
    <div
      class="stats stats-vertical my-4 min-w-[20rem] border border-light-strong transition-all delay-200 lg:stats-horizontal dark:border-dark-medium dark:bg-dark-strong md:min-w-[30rem] lg:w-[50rem]"
    >
      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ invoices?.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Vendidas</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ vendidas?.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↗︎ 400 (22%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Pendientes</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ pendientes?.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Canceladas</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ canceladas?.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
      </div>
    </div>

    <div
      class="stats stats-vertical mb-4 border border-light-strong lg:stats-horizontal dark:border-dark-medium dark:bg-dark-strong"
    >
      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Vendido</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalInvoiceAmount as number)
          }}
        </div>
        <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Pendiente</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalPendingInvoiceAmount as number)
          }}
        </div>
        <!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Cancelado</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalCanceledInvoiceAmount as number)
          }}
        </div>
        <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
      </div>
    </div>
    <section class="mt-8 flex flex-col gap-4">
      <h2 class="text-center text-2xl text-dark-medium dark:text-light-medium">Últimos clientes</h2>
      <!-- <Bar :data="chartData" /> -->
      <div
        v-if="uniqueContacts.length"
        class="stats stats-vertical w-full border border-light-strong text-dark-medium dark:border-dark-medium dark:bg-dark-strong"
      >
        <div class="stat gap-2 md:flex" v-for="contact in uniqueContacts">
          <div class="w-1/3 lg:w-3/6">
            <div class="stat-title text-base text-primary">Empresa</div>
            <div class="stat-value text-lg dark:text-light-medium">
              {{ contact?.clientCompany }}
            </div>
          </div>
          <div class="w-1/3 lg:w-2/6">
            <div class="stat-title text-base text-primary">Contacto</div>
            <div class="stat-value text-lg text-dark-medium dark:text-light-medium">
              {{ contact?.clientName }}
            </div>
          </div>
          <div class="w-full lg:w-1/6">
            <button
              class="btn w-full border-primary bg-primary text-xs text-light-medium hover:border-primary hover:bg-primary/50"
              @click="clientInvoices(contact)"
            >
              Ver cotizaciones
            </button>
          </div>
        </div>
      </div>
      <div
        class="stats min-h-16 stats-vertical grid w-full min-w-full max-w-2xl place-items-center border border-light-strong text-primary dark:border-dark-medium dark:bg-dark-strong dark:text-primary/50"
        v-else
      >
        No hay clientes
      </div>
    </section>
  </main>
</template>

<style scoped>
.table :where(tbody th, tbody td) {
  @apply bg-base-100 text-dark-medium dark:bg-dark-strong dark:text-light-medium;
}
</style>
