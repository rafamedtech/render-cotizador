<script setup>
// Imports
import noResults from '@/assets/images/no-results.svg';

// import VueDatepickerUi from 'vue-datepicker-ui';
// import 'vue-datepicker-ui/lib/vuedatepickerui.css';

const store = useStore();
const {
  isLoading,
  isLoadingFull,
  invoicesLoaded,
  searchQuery,
  filterQuery,
  filterResults,
  searchDate,
} = storeToRefs(store);

const { getInvoices } = await useInvoices();
const invoices = ref([]);
const filterMenu = ref(true);
const filteredInvoices = ref([]);

filteredInvoices.value = invoices.value;

onBeforeMount(() => {
  isLoadingFull.value = false;
});

onMounted(async () => {
  const { invoices: invoiceData } = await useInvoices();
  invoices.value = invoiceData.value;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 1000);
  if (filterQuery.value) {
    searchInvoices();
  }
});

// watchEffect(() => {
//   console.log(new Date(searchDate.value).toLocaleString('es-MX', dateOptions));
// });

// const dateSearch = computed(() => new Date(searchDate.value).toLocaleString('es-MX', dateOptions));

const searchSubmit = ref(false);
const filterStatus = ref('Todas');
function searchInvoices() {
  searchSubmit.value = true;
  filterMenu.value = false;
  invoicesLoaded.value = false;
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 1000);

  if (filterQuery.value === 'Todas' && !searchDate.value) {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  } else if (filterQuery.value === 'Todas') {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.invoiceDate === new Date(searchDate.value).toLocaleString('es-MX', dateOptions) &&
        invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  } else if (!searchDate.value) {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        invoice.status === filterQuery.value
      );
    });
  } else {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        invoice.status === filterQuery.value &&
        invoice.invoiceDate === new Date(searchDate.value).toLocaleString('es-MX', dateOptions)
      );
    });
  }

  if (filteredInvoices.value.length === 0) {
    return (filterResults.value = false);
  } else {
    return (filterResults.value = true);
  }
}

function searchCleared() {
  filterMenu.value = true;
  filterStatus.value = 'Todas';
}

const invoiceBtn = ref(null);

const newInvoice = () => {
  return navigateTo('nueva-cotizacion');
};

const beforeEnter = (el) => {
  console.log('beforeEnter');
  el.style.transform = 'translateY(100px)';
  el.style.opacity = 0;
};

const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    onComplete: done,
    delay: el.dataset.index * 0.2,
  });
};

const toggleMenu = ref(false);
const filterMenuRef = ref(null);
function toggleFilter() {
  filterMenuRef.value.click();
  toggleMenu.value = true;
}

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const loadInvoices = ref(false);
function refreshInvoices() {
  loadInvoices.value = true;
  isLoading.value = true;
  invoicesLoaded.value = false;
  sessionStorage.clear();
  // sessionStorage.setItem('/api/invoices', JSON.stringify(null));

  setTimeout(async () => {
    await getInvoices();
    loadInvoices.value = false;
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 2000);
}

useHead({
  title: 'Cotizaciones | Render Cotizador',
});

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div class="custom-container" :style="{ 'padding-top': '40px' }">
    <div>
      <transition appear @before-enter="beforeEnter" @enter="enter">
        <div class="mb-8 flex justify-between">
          <div class="left flex flex-col">
            <h1 class="text-2xl text-primary dark:text-dark-primary lg:text-3xl">Cotizaciones</h1>
            <span class="text-sm text-dark-strong dark:text-light-strong"
              >Tienes (<span class="text-primary dark:text-dark-primary">{{ invoices.length }}</span
              >) en total</span
            >
          </div>
          <div class="right flex flex-col-reverse items-end gap-4 lg:flex-row lg:items-center">
            <label ref="invoiceBtn" for="my-modal-3" class="hidden"> </label>
            <button
              class="btn-secondary btn-square btn w-fit px-2 text-light-medium dark:border-dark-secondary dark:bg-dark-secondary"
              @click="newInvoice"
            >
              <Icon name="icon-park-outline:plus" class="text-2xl" />

              <span>Cotización</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Invoices -->

      <div class="w-full">
        <!-- Search box -->
        <section class="flex w-full items-center justify-between">
          <SearchBar @@search="searchInvoices($event)" @@clear="searchCleared" />
        </section>

        <section
          class="relative mt-8 hidden w-full items-center justify-between rounded-2xl px-4 py-7 text-primary transition-all duration-300 focus:outline-primary dark:text-dark-primary lg:flex lg:px-8"
        >
          <p class="hidden w-[5%] lg:block lg:w-[10%]">ID</p>
          <p class="hidden w-[20%] lg:block">Fecha</p>
          <p class="hidden w-[30%] lg:block lg:w-[25%]">Empresa</p>
          <p class="hidden w-[25%] lg:block">Total</p>
          <p class="hidden w-[20%] lg:block">Status</p>
          <Icon
            class="absolute right-2 cursor-pointer text-2xl text-secondary dark:text-dark-secondary"
            :class="{ 'animate-spin': loadInvoices }"
            name="ri:refresh-line"
            @click="refreshInvoices"
          />
        </section>

        <section class="mt-4 flex justify-center lg:hidden">
          <Icon
            class="cursor-pointer text-4xl text-accent"
            :class="{ 'animate-spin': loadInvoices }"
            name="ri:refresh-line"
            @click="refreshInvoices"
          />
        </section>

        <TransitionGroup
          v-if="invoicesLoaded && filterResults && invoices"
          tag="section"
          class="mt-4 flex flex-col items-center gap-10 lg:mt-0 lg:gap-4"
          appear
          name="slide-up"
        >
          <MyInvoiceMobile
            v-for="(invoice, index) in filteredInvoices"
            :style="{ transitionDelay: `${index * 200}ms` }"
            :data-index="index"
            :invoice="invoice"
            :key="invoice.invId"
          />
        </TransitionGroup>

        <!-- No filter results -->
        <div
          v-if="
            filteredInvoices.length === 0 && invoices.length > 0 && !isLoading && !filterResults
          "
          class="mt-16 w-full text-center"
        >
          <img :src="noResults" class="mx-auto mb-8 w-32" alt="" />
          <span class="text-dark-medium dark:text-light-medium">No se encontraron resultados</span>
        </div>

        <LoadingSpinner class="pt-16" v-if="isLoading" />
      </div>

      <!-- If no invoices -->
      <NoInvoices v-if="invoices.length === 0 && invoicesLoaded && !isLoading" />
    </div>
  </div>
</template>

<style>
.v-calendar .input-field svg.datepicker {
  @apply fill-primary dark:fill-primary/50;
}

.v-calendar .calendar .selected-field,
.v-calendar .content {
  @apply dark:bg-dark-medium;
}

.v-calendar .calendar .days .day.selectedDate .number {
  @apply bg-primary dark:bg-primary/50;
}

.v-calendar .calendar .days .day.name {
  @apply text-primary dark:text-primary/50;
}

label {
  @apply mb-1 text-xs text-dark-medium dark:text-light-medium;
}

.v-calendar,
.v-calendar .input-field {
  min-width: 100%;
}

.v-calendar .input-field input {
  @apply input-bordered input w-full border-light-strong bg-light-medium text-[0.9rem] text-dark-medium dark:bg-dark-medium dark:text-light-strong;
  padding-left: 2rem;
  padding-right: 0;
  /* width: 2rem !important; */
}

input[type='time'] {
  max-width: 100%;
}
</style>
