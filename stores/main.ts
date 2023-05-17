import { defineStore } from 'pinia';

import type Contact from '@/types/contact';
import type { InvoiceOutline } from '@/types/invoice';

export const useStore = defineStore('main', () => {
  const isLoading = ref(false);
  const isLoadingFull = ref(true);
  // const openModal = ref(false);

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
    // customModal,
    // openModal,
    modalType,
    backBtn,
  };
});
