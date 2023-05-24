import { defineStore } from 'pinia';
// import sessionStorage from '@vueuse/nuxt'

import type Contact from '@/types/contact';
import type { InvoiceOutline, InvoiceDraft } from '@/types/invoice';
import { uid } from 'uid';

export const useStore = defineStore('main', () => {
  // const { invoices } = await useInvoices();
  // const invoices = sessionStorage.getItem('/api/invoices');
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const isLoading = ref(false);
  const isLoadingFull = ref(true);

  const invoicesLoaded = ref(false);
  const invoiceDialog = ref(false);
  const editInvoice = ref(false);
  const contactData = ref<Contact[]>([]);

  const modalType = ref('');

  const openAlert = ref(false);
  const alertMsg = ref('La cotizacion ha sido creada!');
  const alertType = ref('');

  const filterResults = ref(true);
  const filteredInvoices = reactive<InvoiceOutline[]>([]);
  const searchQuery = ref('');
  const filterQuery = ref('Todas');
  const searchDate = ref(null);

  const backBtn = ref<HTMLElement | null>(null);

  return {
    searchQuery,
    filterQuery,
    searchDate,
    filterResults,
    filteredInvoices,
    openAlert,
    alertMsg,
    alertType,
    isLoading,
    isLoadingFull,
    contactData,
    invoicesLoaded,
    invoiceDialog,
    editInvoice,
    modalType,
    backBtn,
  };
});
