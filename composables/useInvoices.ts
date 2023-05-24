import type { InvoiceOutline } from '@/types/invoice';

export const useInvoices = async () => {
  const invoices = ref<InvoiceOutline[] | null>([]);

  async function getInvoices() {
    const store = useStore();
    const { contactData } = storeToRefs(store);
    const data = await useFetchWithCache<InvoiceOutline[]>('/api/invoices');
    // const { data, error } = await useFetch<InvoiceOutline[]>('/api/invoices');

    invoices.value = data.value as InvoiceOutline[];

    invoices.value.forEach((invoice: InvoiceOutline) => {
      contactData.value.push({
        clientCompany: invoice.clientCompany,
        clientName: invoice.clientName,
        clientName2: invoice.clientName2,
        clientEmail: invoice.clientEmail,
        clientEmail2: invoice.clientEmail2,
      });
    });
  }

  await getInvoices();

  return {
    invoices,
    getInvoices,
  };
};
