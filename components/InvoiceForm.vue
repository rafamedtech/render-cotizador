<script lang="ts" setup>
// Depencency imports
import useVuelidate from '@vuelidate/core';
import { required, email, maxLength, minValue, helpers } from '@vuelidate/validators';
import VueDatepickerUi from 'vue-datepicker-ui';
import colors from 'tailwindcss/colors';
import 'vue-datepicker-ui/lib/vuedatepickerui.css';
import { uid } from 'uid';

// Type imports
import type Contact from '@/types/contact';
import { InvoiceDraft, InvoiceItems } from '@/types/invoice';
import { Modal } from '@/types/modal';

interface Props {
  edit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  edit: false,
});

const store = useStore();
const router = useRouter();
const { invoices } = await useInvoices();
// const invoiceObject = store.invoiceObject;

const { params } = useRoute();
const { id }: any = params;

const invoiceTitle = computed(() => {
  return props.edit ? 'Editar Cotización' : 'Nueva Cotización';
});

const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const lastInvoice = ref(invoices.value?.[0]);

const lastInvoiceId = lastInvoice.value?.invId;
const newId = computed(() => {
  return Number(lastInvoiceId) + 1;
});

const invoiceObject = reactive<InvoiceDraft>({
  invId: newId.value.toString(),
  clientCompany: '',
  clientName: '',
  clientName2: '',
  clientEmail: '',
  clientEmail2: '',
  currencyType: 'MX',
  exchangeCost: 0,
  eta: 'Inmediata',
  notes: '',
  invoiceDate: new Date().toLocaleString('es-MX', dateOptions),
  paymentDueDate: '',
  paymentType: 'Contado',
  invoiceItems: [
    {
      itemId: uid(2),
      itemName: '',
      itemDescription: '',
      condition: 'N/A',
      qty: 1,
      partNo: '',
      price: 0,
      total: 0,
    },
  ],
  status: 'Borrador',
});

if (props.edit) {
  const { currentInvoice } = await useInvoice(id);
  if (currentInvoice.value) {
    invoiceObject.id = currentInvoice.value?.id;
    invoiceObject.invId = currentInvoice.value?.invId;
    invoiceObject.clientCompany = currentInvoice.value?.clientCompany;
    invoiceObject.clientName = currentInvoice.value?.clientName;
    invoiceObject.clientName2 = currentInvoice.value?.clientName2;
    invoiceObject.clientEmail = currentInvoice.value?.clientEmail;
    invoiceObject.clientEmail2 = currentInvoice.value?.clientEmail2;
    invoiceObject.currencyType = currentInvoice.value?.currencyType;
    invoiceObject.exchangeCost = currentInvoice.value?.exchangeCost;
    invoiceObject.eta = currentInvoice.value?.eta;
    invoiceObject.notes = currentInvoice.value?.notes;
    invoiceObject.paymentDueDate = currentInvoice.value?.paymentDueDate;
    invoiceObject.paymentType = currentInvoice.value?.paymentType;
    invoiceObject.invoiceItems = currentInvoice.value?.invoiceItems as InvoiceItems[];
    invoiceObject.status = currentInvoice.value?.status;
  }
}

// Saved contacts menu
const contactsModal = ref(false);
const { contactData, backBtn, isLoading, modalType, filterResults } = storeToRefs(store);
const filteredContacts = ref<Contact[]>([]);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filterContacts = () => {
  if (invoiceObject.clientCompany.length === 0) {
    filteredContacts.value = uniqueContacts.value as Contact[];
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact?.clientCompany
      .toLowerCase()
      .startsWith(invoiceObject.clientCompany.toLowerCase());
  }) as Contact[];
};

function clearSearch() {
  invoiceObject.clientCompany = '';
  invoiceObject.clientName = '';
  invoiceObject.clientEmail = '';
  invoiceObject.clientName2 = '';
  invoiceObject.clientEmail2 = '';
}

const setContact = (contact: Contact) => {
  invoiceObject.clientCompany = contact.clientCompany;
  invoiceObject.clientName = contact.clientName;
  invoiceObject.clientEmail = contact.clientEmail;
  invoiceObject.clientName2 = contact.clientName2;
  invoiceObject.clientEmail2 = contact.clientEmail2;
  contactsModal.value = false;
};

onMounted(() => {
  filterContacts();
});

// Invoice validation

const rules = computed(() => {
  return {
    paymentDueDate: {
      required: helpers.withMessage('Es necesario ingresar una fecha', required),
      // minValue: helpers.withMessage('La fecha mínima es al día siguiente', (value) => {
      //   return (
      //     new Date(value as Date).toLocaleString('es-MX', dateOptions) >
      //     new Date().toLocaleString('es-MX', dateOptions)
      //   );
      // }),
    },
    clientCompany: { required: helpers.withMessage('Este campo es obligatorio', required) },
    clientName: { required: helpers.withMessage('Este campo es obligatorio', required) },
    clientEmail: {
      required: helpers.withMessage('Este campo es obligatorio', required),
      email: helpers.withMessage('Formato inválido', email),
    },
    clientEmail2: {
      email: helpers.withMessage('Formato inválido', email),
    },
    paymentTerms: { minValue: helpers.withMessage('Este campo es obligatorio', minValue(1)) },
    paymentType: { required: helpers.withMessage('Este campo es obligatorio', required) },
    notes: {
      maxLength: helpers.withMessage('Solo se permite hasta 2500 caracteres', maxLength(2500)),
    },
  };
});
const v$ = useVuelidate(rules, invoiceObject as any);

// Status button
const statusModal = ref(false);
function changeStatusModal() {
  statusModal.value = true;
}

function changeStatus(status: string) {
  invoiceObject.status = status;
  statusModal.value = false;
}

function addNewInvoiceItem() {
  invoiceObject.invoiceItems.push({
    itemId: uid(2),
    itemName: '',
    itemDescription: '',
    condition: 'N/A',
    qty: 1,
    partNo: '',
    price: 0,
    total: 0,
  });
}

const deleteInvoiceItem = (id: string) => {
  invoiceObject.invoiceItems = invoiceObject.invoiceItems.filter((item) => item.itemId !== id);
};

// Totals processing

const invoiceSubtotal = computed(() => {
  let sum = 0;
  for (let i = 0; i < invoiceObject.invoiceItems.length; i++) {
    sum += Number(invoiceObject.invoiceItems[i].price * invoiceObject.invoiceItems[i].qty);
  }
  return sum;
});

const invoiceTax = computed(() => {
  return invoiceSubtotal.value * 0.16;
});

const invoiceTotal = computed(() => {
  return invoiceSubtotal.value + invoiceTax.value;
});

function toggleModal() {
  const html = document.querySelector('html');
  if (html) html.style.overflowY = 'hidden';
  backBtn.value?.click();
}

async function uploadInvoice() {
  const { newInvoice } = await useInvoice();
  await newInvoice({
    ...invoiceObject,
    invId: invoiceObject.invId.toString(),
    invoiceSubtotal: invoiceSubtotal.value,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
  });
}

async function onSubmit() {
  v$.value.$validate();
  if (!v$.value.$error) {
    if (props.edit) {
      const { updateInvoiceOnDb } = await useInvoice();
      // updateInvoice
      await updateInvoiceOnDb({
        ...invoiceObject,
        invoiceSubtotal: invoiceSubtotal.value,
        invoiceTax: invoiceTax.value,
        invoiceTotal: invoiceTotal.value,
      });
      // router.back();
      return navigateTo(`/cotizacion/${invoiceObject.invId}`);
    }

    await uploadInvoice();
    await navigateTo('/cotizaciones');
  } else {
    isLoading.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function discardInvoice() {
  modalType.value = Modal.Discard;
  // store.$patch({
  //   modalType: Modal.Discard,
  // });
  backBtn.value?.click();
}
</script>

<template>
  <div
    class="container card relative h-full border border-light-strong bg-white p-4 transition-all dark:border-dark-medium dark:bg-dark-strong lg:w-full lg:max-w-4xl"
  >
    <form @submit.prevent="onSubmit" class="scrollbar-form relative w-full">
      <h1
        class="w-fit border-b-2 border-primary text-2xl text-dark-medium dark:border-dark-primary dark:text-light-medium"
      >
        {{ invoiceTitle }}
      </h1>

      <div class="mt-8 flex flex-col">
        <h4
          class="mb-2 w-fit border-b border-dark-medium text-lg font-bold text-primary dark:border-light-medium dark:text-dark-primary"
        >
          Datos generales
        </h4>

        <div class="flex w-full gap-8">
          <!-- Empresa -->
          <div class="dropdown-bottom dropdown-end form-control dropdown relative mb-4 w-1/2">
            <label class="label">
              <span class="label-text text-dark-strong dark:text-light-medium"
                >Empresa<span class="text-red-500">*</span></span
              >
            </label>
            <div class="form-control relative w-full">
              <input
                v-model="invoiceObject.clientCompany"
                @focus="contactsModal = true"
                @input="filterContacts"
                @keydown.esc="clearSearch"
                autocomplete="off"
                type="text"
                placeholder="Escribe aqui..."
                class="input-primary input w-full bg-light-medium capitalize disabled:border-light-strong disabled:bg-light-medium dark:disabled:border-dark-medium dark:disabled:bg-dark-medium"
              />
              <Icon
                v-if="invoiceObject.clientCompany && !edit"
                @click="clearSearch"
                name="heroicons-solid:x-mark"
                class="absolute right-2 top-4 cursor-pointer text-primary"
              />
              <label class="label">
                <span v-if="v$.clientCompany.$error" class="label-text-alt text-red-500">{{
                  v$.clientCompany.$errors[0].$message
                }}</span>
              </label>
            </div>

            <div v-if="filteredContacts.length > 0 && contactsModal" class="w-full lg:w-1/2">
              <ul
                class="dropdown-content menu min-h-12 flex w-full flex-col overflow-y-scroll rounded-[10px] border border-light-strong bg-white p-2 shadow-lg dark:border dark:border-dark-medium dark:bg-dark-strong dark:text-light-strong lg:max-h-[250px]"
              >
                <span class="py-2 pl-2 italic text-primary">Contactos disponibles</span>
                <li
                  class="cursor-pointer overflow-x-hidden text-dark-medium hover:text-primary dark:text-light-medium dark:hover:text-primary"
                  v-for="filteredContact in filteredContacts"
                  :key="filteredContact.clientCompany"
                >
                  <button class="text-left" @click="setContact(filteredContact)">
                    {{ filteredContact.clientCompany }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="form-control relative mb-4 h-full w-fit items-end text-xs">
            <label class="label w-full text-left">
              <span class="label-text text-dark-strong dark:text-light-medium">Etapa</span>
            </label>
            <div class="flex">
              <StatusButton :status="invoiceObject.status" />
              <div class="dropdown-end dropdown relative w-8">
                <label tabindex="0" class="cursor-pointer">
                  <Icon
                    name="material-symbols:arrow-drop-down-circle-outline-rounded"
                    size="32"
                    @click="changeStatusModal"
                    class="text-secondary dark:text-dark-secondary"
                /></label>
                <ul
                  v-if="statusModal"
                  class="dropdown-content menu min-h-12 mt-2 flex max-h-[250px] w-40 rounded-lg border border-light-strong bg-white shadow-lg transition-all dark:border dark:border-dark-strong dark:bg-dark-strong dark:text-light-strong"
                >
                  <li
                    class="cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium dark:hover:text-dark-primary"
                  >
                    <button type="button" @click="changeStatus('Borrador')">
                      <Icon
                        name="ri:draft-line"
                        class="text-base text-dark-medium dark:text-light-medium"
                      />
                      Borrador
                    </button>
                  </li>
                  <li
                    class="cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium dark:hover:text-dark-primary"
                  >
                    <button type="button" @click="changeStatus('Pendiente')">
                      <Icon name="icon-park-outline:caution" class="text-base text-orange-500" />
                      Pendiente
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <BaseInput label="Fecha" :model-value="invoiceObject.invoiceDate" disabled />

          <div class="form-control flex w-full flex-col">
            <label for="paymentDueDate" class="dark:text-light-strong"
              >Fecha de vencimiento<span class="text-red-500">*</span></label
            >
            <ClientOnly>
              <VueDatepickerUi
                v-model="invoiceObject.paymentDueDate"
                lang="es"
                placeholder="Elige fecha"
                position="right"
                :date-format="dateOptions"
              />
            </ClientOnly>
            <label class="label">
              <span class="label-text-alt text-red-500" v-if="v$.paymentDueDate.$error">{{
                v$.paymentDueDate.$errors[0].$message
              }}</span>
            </label>
          </div>

          <BaseInput label="Tiempo de entrega" v-model="invoiceObject.eta"></BaseInput>
        </div>

        <!-- Currency -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div class="flex flex-col">
            <label for="currencyType" class="dark:text-light-strong">Moneda</label>
            <select
              class="input-primary input w-full bg-light-medium"
              name="currencyType"
              v-model="invoiceObject.currencyType"
              id="currencyType"
            >
              <option value="MX">MX</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label for="exchangeCost" class="dark:text-light-strong">Tipo de cambio</label>
            <input
              class="input-primary input w-full bg-light-medium disabled:border-light-strong disabled:bg-light-strong dark:disabled:border-dark-medium dark:disabled:bg-dark-medium"
              type="number"
              id="exchangeCost"
              v-model="invoiceObject.exchangeCost"
              :disabled="invoiceObject.currencyType === 'MX'"
              :title="
                invoiceObject.currencyType === 'MX'
                  ? 'Este campo se habilita cuando el tipo de moneda es USD'
                  : ''
              "
            />
          </div>
          <div class="form-control">
            <label for="paymentType" class="dark:text-light-strong"
              >Forma de pago<span class="text-red-500">*</span></label
            >
            <select
              v-model="invoiceObject.paymentType"
              class="input-primary input w-full bg-light-medium"
              name="paymentType"
              id="paymentType"
            >
              <option value="Contado" class="dark:text-light-strong">Contado</option>
              <option value="Crédito" class="dark:text-light-strong">Crédito</option>
            </select>
            <label class="label">
              <span v-if="v$.paymentType.$error" class="label-text-alt text-red-500">{{
                v$.paymentType.$errors[0].$message
              }}</span>
            </label>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Contactos -->
        <h4
          class="mb-4 w-fit border-b border-dark-medium text-lg font-bold text-primary dark:border-light-medium dark:text-dark-primary"
        >
          Contactos
        </h4>
        <div class="mb-4 flex w-full gap-4 lg:gap-8">
          <div class="mb-2 w-1/2">
            <h5 class="mb-2 w-fit text-primary dark:text-dark-primary">Contacto 1</h5>

            <BaseInput
              label="Nombre"
              placeholder="Escribe aqui..."
              v-model="invoiceObject.clientName"
              class="capitalize"
              isrequired
            >
              <span v-if="v$.clientName.$error" class="label-text-alt text-red-500">{{
                v$.clientName.$errors[0].$message
              }}</span>
            </BaseInput>

            <BaseInput
              label="Correo electrónico"
              placeholder="Ej. correo@ejemplo.com"
              v-model="invoiceObject.clientEmail"
              @change="v$.clientEmail.$touch"
              isrequired
            >
              <span v-if="v$.clientEmail.$error" class="label-text-alt text-red-500">{{
                v$.clientEmail.$errors[0].$message
              }}</span>
            </BaseInput>
          </div>
          <div class="mb-2 w-1/2">
            <h5 class="mb-2 w-fit text-primary dark:text-dark-primary">Contacto 2</h5>

            <BaseInput
              label="Nombre"
              placeholder="Escribe aqui..."
              class="capitalize"
              v-model="invoiceObject.clientName2"
            >
              <span v-if="v$.clientName.$error" class="label-text-alt text-transparent">.</span>
            </BaseInput>

            <BaseInput
              label="Correo electrónico"
              placeholder="Ej. correo@ejemplo.com"
              v-model="invoiceObject.clientEmail2"
              @change="v$.clientEmail2.$touch"
            >
              <span v-if="v$.clientEmail2.$error" class="label-text-alt text-red-500">{{
                v$.clientEmail2.$errors[0].$message
              }}</span>
            </BaseInput>
          </div>
        </div>

        <div class="divider"></div>

        <div class="flex flex-col">
          <div class="mt-8 hidden lg:block">
            <h3
              class="mb-4 w-fit border-b border-dark-medium text-lg font-bold text-primary dark:border-light-medium dark:text-dark-primary"
            >
              Artículos
            </h3>
            <table class="w-full">
              <thead>
                <tr
                  class="mb-4 flex w-full gap-4 text-left text-dark-medium dark:text-light-medium"
                >
                  <th class="item-name w-3/12">Nombre</th>
                  <th class="w-4/12">Descripción</th>
                  <th class="qty w-1/12">Ctd</th>
                  <th class="price w-2/12">Precio</th>
                  <th class="total w-2/12 text-center">Total</th>
                </tr>
              </thead>
              <TransitionGroup
                name="list"
                tag="tbody"
                class="mb-4 flex w-full flex-col gap-4"
                appear
              >
                <tr
                  class="table-items relative flex items-start gap-2 lg:gap-4"
                  v-for="item in invoiceObject.invoiceItems"
                  :key="item.itemId"
                >
                  <td class="w-3/12">
                    <div class="form-control">
                      <input
                        class="input w-full bg-light-medium focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                        type="text"
                        v-model.trim="item.itemName"
                        placeholder="Escribe aqui..."
                      />
                    </div>
                  </td>
                  <td class="relative w-4/12">
                    <div class="form-control relative">
                      <input
                        class="input w-full overflow-y-hidden bg-light-medium pr-20 focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                        type="text"
                        placeholder="Escribe aqui..."
                        :style="{ paddingRight: '2rem' }"
                        v-model="item.itemDescription"
                      />
                      <label
                        for="my-modal-3"
                        class="absolute bottom-0 right-1 top-0 flex cursor-pointer items-center"
                        ><Icon name="material-symbols:expand-content" size="30"
                      /></label>
                    </div>
                    <div>
                      <input type="checkbox" id="my-modal-3" class="modal-toggle" />
                      <div class="modal backdrop-blur-sm">
                        <div class="modal-box relative dark:bg-dark-strong">
                          <label
                            for="my-modal-3"
                            class="btn-secondary btn-sm btn-circle btn absolute right-2 top-2 dark:border-dark-secondary dark:bg-dark-secondary"
                            >✕</label
                          >
                          <h3 class="mb-4 text-lg font-bold text-primary dark:text-dark-primary">
                            Descripción del artículo
                          </h3>
                          <textarea
                            placeholder="Escribe aqui..."
                            class="input h-32 min-h-[4rem] w-full rounded-[12px] bg-light-medium py-4"
                            v-model.trim="item.itemDescription"
                          >
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="w-1/12">
                    <input
                      class="input w-full bg-light-medium text-center focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="number"
                      v-model="item.qty"
                    />
                  </td>
                  <td class="relative w-2/12">
                    <input
                      class="input w-full bg-light-medium text-right focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="number"
                      v-model="item.price"
                    />
                    <span class="absolute left-2 top-3 text-dark-medium dark:text-light-medium"
                      >$</span
                    >
                  </td>
                  <td
                    class="flex h-10 w-2/12 items-center justify-end pr-4 text-dark-medium dark:text-light-medium"
                  >
                    {{
                      new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format((item.total = item.qty * item.price))
                    }}
                  </td>
                  <td class="absolute -top-5 right-0" v-if="invoiceObject.invoiceItems.length > 1">
                    <Icon
                      @click="deleteInvoiceItem(item.itemId)"
                      class="m-auto cursor-pointer text-base text-primary"
                      title="Borrar artículo"
                      name="icon-park-outline:delete"
                    />
                  </td>
                </tr>
              </TransitionGroup>
            </table>

            <div class="divider"></div>

            <section
              @click="addNewInvoiceItem"
              class="btn-secondary btn mx-auto flex w-fit gap-2 text-white dark:border-dark-secondary dark:bg-dark-secondary"
            >
              <i class="fa-solid fa-plus"></i>
              Agregar artículo
            </section>

            <!-- </div> -->
          </div>
          <section class="mt-4 print:hidden lg:hidden">
            <h3
              class="mb-4 w-fit border-b border-dark-medium text-lg font-bold text-primary dark:border-light-medium dark:text-primary/50"
            >
              Artículos
            </h3>
            <div class="rounded-box flex max-w-md flex-col">
              <div class="flex flex-col gap-4">
                <TransitionGroup
                  tag="section"
                  class="mb-4 flex w-full flex-col gap-4"
                  name="list"
                  appear
                >
                  <div
                    class="card relative border border-light-strong bg-base-100 shadow-pinterest dark:border-dark-medium dark:bg-dark-strong"
                    v-for="item in invoiceObject.invoiceItems"
                    :key="item.itemId"
                  >
                    <div class="card-body p-4 text-sm">
                      <div class="form-control">
                        <label class="input-group">
                          <span
                            class="w-36 bg-light-strong text-dark-medium dark:bg-dark-medium dark:text-light-medium"
                            >Nombre</span
                          >
                          <input
                            type="text"
                            placeholder="Descripción del artículo"
                            class="input-bordered input w-full dark:border-dark-strong"
                            v-model.trim="item.itemName"
                          />
                        </label>
                      </div>
                      <div class="form-control">
                        <label class="input-group">
                          <span
                            class="w-36 bg-light-strong text-dark-medium dark:bg-dark-medium dark:text-light-medium"
                            >Descripción</span
                          >
                          <input
                            type="text"
                            placeholder="Descripción del artículo"
                            class="input-bordered input w-full dark:border-dark-strong"
                            v-model.trim="item.itemDescription"
                          />
                        </label>
                      </div>

                      <div class="form-control">
                        <label class="input-group">
                          <span
                            class="w-36 bg-light-strong text-dark-medium dark:bg-dark-medium dark:text-light-medium"
                            >Cantidad</span
                          >
                          <input
                            type="text"
                            class="input-bordered input w-full dark:border-dark-strong"
                            v-model.trim="item.qty"
                          />
                        </label>
                      </div>
                      <div class="form-control">
                        <label class="input-group">
                          <span
                            class="w-36 bg-light-strong text-dark-medium dark:bg-dark-medium dark:text-light-medium"
                            >Precio $</span
                          >
                          <input
                            type="text"
                            class="input-bordered input w-full dark:border-dark-strong"
                            v-model.trim="item.price"
                          />
                        </label>
                      </div>

                      <div class="card-actions w-full items-center">
                        <button
                          class="btn flex w-full gap-2 border-light-strong bg-white text-primary dark:border-dark-medium dark:bg-dark-strong"
                        >
                          <span class="text-dark-medium dark:text-light-medium">Importe: </span>
                          <span>
                            {{
                              new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                              }).format((item.total = item.qty * item.price))
                            }}</span
                          >
                        </button>
                        <div
                          class="absolute -top-2 right-0"
                          v-if="invoiceObject.invoiceItems.length > 1"
                        >
                          <Icon
                            @click="deleteInvoiceItem(item.itemId)"
                            class="m-auto cursor-pointer text-primary"
                            title="Borrar artículo"
                            size="32"
                            name="icon-park-outline:delete"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </div>

            <button
              type="button"
              @click="addNewInvoiceItem"
              class="btn-secondary btn mx-auto mt-4 flex w-fit gap-2 text-white dark:border-dark-secondary dark:bg-dark-secondary"
            >
              <i class="fa-solid fa-plus"></i>
              Agregar artículo
            </button>
          </section>

          <section class="form-control mb-4 mt-8 flex flex-col">
            <label for="notes" class="">Notas</label>
            <textarea
              id="notes"
              class="input-bordered input-primary input h-60 resize-none bg-light-medium focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
              v-model="invoiceObject.notes"
              @input="v$.notes.$touch"
              maxlength="2500"
            ></textarea>
            <label class="label">
              <span v-if="v$.notes.$error" class="label-text-alt text-red-500">{{
                v$.notes.$errors[0].$message
              }}</span>
            </label>
          </section>

          <section class="mb-4 flex flex-col gap-2">
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Subtotal:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(invoiceSubtotal)
                }}
              </p>
            </div>
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Impuestos:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(invoiceTax)
                }}
              </p>
            </div>
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Total:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(invoiceTotal)
                }}
              </p>
            </div>
          </section>

          <div class="flex flex-col gap-2 lg:flex-row lg:justify-end">
            <button
              type="button"
              @click="discardInvoice"
              class="btn border-none hover:text-primary focus:outline-primary dark:bg-dark-medium dark:hover:text-primary lg:w-56"
            >
              <span>Cancelar</span>
            </button>
            <button
              class="btn-secondary btn text-light-medium dark:border-dark-secondary dark:bg-dark-secondary lg:w-56"
            >
              <LoadingSpinner v-if="isLoading" />
              <span v-else>{{ edit ? 'Actualizar Cotización' : 'Crear Cotización' }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.v-calendar .input-field svg.datepicker {
  @apply fill-secondary dark:fill-dark-secondary;
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
  width: 2rem !important;
}

input[type='time'] {
  max-width: 100%;
}
</style>
