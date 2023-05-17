<script lang="ts" setup>
// Imports
import emailjs from '@emailjs/browser';
import { Modal } from '@/types/modal';
import type { InvoiceWithItems, InvoiceItems } from '@/types/invoice';

// Definitions
const { params } = useRoute();
const store = useStore();

const { id }: any = params;
const { updateStatusOnDb } = await useInvoice();
// const { currentInvoice, updateStatusOnDb } = await useInvoice(id);
const currentInvoice = ref<InvoiceWithItems | null>(null);

// const invoiceItemList = currentInvoice.value?.invoiceItems;
const invoiceItemList = ref<InvoiceItems[] | null>(null);

const { isLoading, isLoadingFull, backBtn, modalType } = storeToRefs(store);
const user = useSupabaseUser();

// onBeforeMount(() => {
// });
// isLoadingFull.value = false;

// watchEffect(() => {
//   if (currentInvoice.value) {
//     isLoadingFull.value = false;
//   }
// });

onMounted(async () => {
  // const { params } = useRoute();
  // const { id }: any = params;
  const { currentInvoice: invoiceCurrent, getCurrentInvoice } = await useInvoice(id);
  await getCurrentInvoice(id);
  currentInvoice.value = invoiceCurrent.value as InvoiceWithItems;
  invoiceItemList.value = currentInvoice.value?.invoiceItems;
  isLoadingFull.value = false;
});

const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

function toggleModal() {
  const html: HTMLHtmlElement | null = document.querySelector('html');
  if (html) html.style.overflowY = 'hidden';
  backBtn.value?.click();
}

function deleteInvoice() {
  store.$patch({ modalType: Modal.Delete });
  toggleModal();
}

function generatePDF() {
  store.$patch({ modalType: Modal.Pdf });
  toggleModal();
}

async function sendEmail() {
  isLoading.value = true;

  try {
    const response = await emailjs.send(
      'service_iao05ok',
      'template_u9jm6y3',
      {
        customer_name: currentInvoice.value?.clientName.split(' ')[0],
        customer_name2: currentInvoice.value?.clientName2
          ? `/${currentInvoice.value?.clientName2.split(' ')[0]}`
          : '',
        customer_email: currentInvoice.value?.clientEmail,
        customer_email2: currentInvoice.value?.clientEmail2,
        message: location.toString(),
      },
      'QyWKNAO42Ukv7v_0T'
    );

    console.log(response.status);

    if (response.status !== 200) throw response;
  } catch (error: any) {
    console.error(error.text);
  }
  setTimeout(() => {
    isLoading.value = false;
    store.$patch({
      modalType: Modal.Email,
    });
    toggleModal();
  }, 1000);
}

const statusModal = ref(false);

function changeStatusModal() {
  statusModal.value = true;
}

async function changeStatus(status: string) {
  if (currentInvoice.value) {
    if (currentInvoice.value.status === status) {
      return;
    }
    currentInvoice.value.status = status;
  }

  statusModal.value = false;
  await updateStatusOnDb(currentInvoice.value);
}

// const invoiceBtn = ref<HTMLInputElement | null>(null);

useHead({
  title: `Cotización #${id} | Render Cotizador`,
});

// definePageMeta({
// middleware: async function ({ params }, from) {
//   const { currentInvoice, getCurrentInvoice } = await useInvoice(params.id as any);
//   await getCurrentInvoice(params.id as any);
//   if (!currentInvoice.value) {
//     return abortNavigation(
//       createError({
//         statusCode: 404,
//         message: 'No se encontro la cotizacion',
//       })
//     );
//   }
// },

// });
</script>

<template>
  <main
    class="custom-container relative mx-auto min-h-screen w-full max-w-screen-lg px-4 pb-24 pt-2 print:px-10 lg:px-10 lg:pb-6"
  >
    <div v-if="currentInvoice && user" class="invoice-view my-container mb-4 print:hidden">
      <NuxtLink
        class="nav-link absolute top-2 flex gap-2 md:relative lg:absolute lg:top-2"
        :to="{ name: 'cotizaciones' }"
      >
        <Icon class="text-2xl text-primary" name="heroicons-solid:arrow-left" />
        <span class="text-dark-medium dark:text-light-strong">Regresar</span>
      </NuxtLink>
      <!-- Header -->
      <div
        class="header rounded-box flex flex-col gap-4 border border-light-strong bg-white dark:border-dark-medium dark:bg-dark-strong lg:flex-row"
      >
        <div class="dropdown-bottom form-control dropdown relative mb-4 h-full w-1/2 items-end">
          <label class="label w-full text-center">
            <span class="label-text text-dark-strong dark:text-light-medium">Etapa</span>
          </label>
          <StatusButton :status="currentInvoice.status" @@modal="changeStatusModal" />
          <div class="w-full">
            <ul
              v-if="statusModal"
              class="dropdown-content menu min-h-12 mt-2 flex max-h-[250px] w-fit rounded-lg border border-light-strong bg-white shadow-lg transition-all dark:border dark:border-dark-strong dark:bg-dark-strong dark:text-light-strong"
            >
              <li
                v-if="currentInvoice.status === 'Borrador'"
                class="cursor-pointer text-dark-medium dark:text-light-medium dark:hover:text-primary"
              >
                <button type="button" @click="changeStatus('Pendiente')">
                  <Icon name="icon-park-outline:caution" class="text-base text-secondary" />
                  Pendiente
                </button>
              </li>
              <li
                class="cursor-pointer text-dark-medium dark:text-light-medium dark:hover:text-primary"
              >
                <button type="button" @click="changeStatus('Vendida')">
                  <Icon name="icon-park-outline:check-one" class="text-base text-green-500" />
                  Vendida
                </button>
              </li>
              <li
                v-if="currentInvoice.status === 'Vendida'"
                class="cursor-pointer text-dark-medium dark:text-light-medium dark:hover:text-primary"
              >
                <button type="button" @click="changeStatus('Cancelada')">
                  <Icon name="material-symbols:cancel-outline" class="text-base text-red-500" />
                  Cancelada
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Status bar -->
        <div class="right flex items-center justify-center gap-3">
          <NuxtLink
            v-if="currentInvoice.status === 'Borrador' || currentInvoice.status === 'Pendiente'"
            :to="`/cotizacion/${currentInvoice.invId}/editar`"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-lg border border-light-strong bg-light-medium p-4 text-xs text-dark-medium transition-all hover:border-primary dark:border-dark-strong dark:bg-dark-medium dark:hover:border-primary/50 lg:text-[10px]"
          >
            <!-- @click="toggleEditInvoice" -->
            <Icon
              name="icon-park-outline:edit"
              class="text-xl text-dark-medium dark:text-light-strong"
            />
            <span class="text-dark-medium dark:text-light-strong">Editar</span>
          </NuxtLink>
          <label ref="backBtn" for="my-modal-6" class="hidden"></label>
          <button
            @click="deleteInvoice"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-lg border border-light-strong bg-light-medium p-4 text-xs text-dark-medium transition-all hover:border-primary dark:border-dark-strong dark:bg-dark-medium dark:hover:border-primary/50 lg:text-[10px]"
          >
            <Icon class="text-xl text-primary" name="icon-park-outline:delete" />

            <span class="text-dark-medium dark:text-light-strong">Eliminar</span>
          </button>

          <button
            @click="generatePDF"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-lg border border-light-strong bg-light-medium p-4 text-xs text-dark-medium transition-all hover:border-primary dark:border-dark-strong dark:bg-dark-medium dark:text-light-strong dark:hover:border-primary/50 lg:text-[10px]"
          >
            <Icon name="icon-park-outline:doc-detail" class="text-xl" />
            PDF
          </button>
          <button
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-lg border border-light-strong bg-light-medium p-4 text-xs text-dark-medium transition-all hover:border-primary dark:border-dark-strong dark:bg-dark-medium dark:text-light-strong dark:hover:border-primary/50 lg:text-[10px]"
            @click="sendEmail"
          >
            <!-- <LoadingSpinner v-if="isLoading && modalType === Modal.Email" /> -->
            <Icon name="icon-park-outline:envelope-one" class="text-xl text-blue-500" />
            Enviar
            <!-- <div v-else>
            </div> -->
          </button>
        </div>
      </div>
    </div>

    <!-- Cover -->

    <div
      class="relative mb-8 h-[235px] rounded-[20px] bg-white shadow-lg lg:print:h-[235px] lg:print:w-screen"
      :class="{ hidden: user }"
    >
      <picture>
        <source media="(max-width: 767px)" srcset="@/assets/images/portada.jpg" />
        <img
          src="@/assets/images/portada.jpg"
          srcset="@/assets/images/portada.jpg"
          alt=""
          class="h-full w-full rounded-[20px] object-cover"
        />
      </picture>
    </div>
    <div
      class="relative mb-8 hidden h-fit bg-white print:h-[700px] print:items-center print:justify-center"
    >
      <figure class="h-full">
        <img
          class="h-auto w-full rounded-[20px]"
          src="@/assets/images/portada.jpg"
          alt="cover image"
        />
      </figure>
    </div>

    <!-- Invoice body -->
    <div id="pdf-content" class="w-full">
      <section
        class="rounded-box border border-light-strong bg-white pt-4 dark:border-dark-medium dark:bg-dark-strong print:border print:border-light-strong print:shadow-none"
      >
        <section class="relative flex h-full justify-between px-4 lg:px-8">
          <div class="mb-4 h-full w-1/2">
            <img class="mb-2 h-24 lg:my-4" src="@/assets/images/logo-rosa-cropped.png" />
            <!-- <span class="block text-xs font-bold text-primary dark:text-primary/50"
              >Render <span class="dark:text-light text-secondary">MX</span>
            </span> -->
            <!-- <p
              class="w-[40ch] text-[6px] text-dark-strong dark:text-light-strong print:w-[80ch] lg:w-[70ch]"
            ></p> -->
            <!-- <a
              class="text-[10px] text-dark-strong dark:text-light-strong"
              href="https://www.gcosoluciones.com"
              >www.suntechelectronics.com</a
            > -->
          </div>
          <h1
            class="absolute inset-0 top-2 hidden h-fit text-center text-xl font-bold uppercase italic text-primary dark:text-dark-primary lg:block"
          >
            Cotización
          </h1>
          <div class="flex flex-col items-end">
            <p class="dark:text-light font-bold uppercase text-dark-medium dark:text-light-strong">
              #{{ id }}
            </p>

            <h3 class="text-xs text-primary dark:text-dark-primary lg:text-base">Fecha</h3>

            <p class="dark:text-light-strongm text-[10px] text-dark-medium dark:text-light-strong">
              {{ currentInvoice?.invoiceDate }}
            </p>

            <h3 class="text-xs text-primary dark:text-dark-primary lg:text-base">Vigencia</h3>

            <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              {{
                new Date(currentInvoice?.paymentDueDate as Date).toLocaleDateString(
                  'es-MX',
                  dateOptions
                )
              }}
            </p>

            <h3 class="text-xs text-primary dark:text-dark-primary lg:text-base">Entrega</h3>

            <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              {{ currentInvoice?.eta }}
            </p>
          </div>
        </section>

        <!-- Customer information section -->
        <section class="pb-4">
          <h2
            class="text-md mx-auto mb-4 w-fit border-b-2 border-primary text-dark-strong dark:border-dark-primary dark:text-light-strong lg:text-base"
          >
            Información del cliente
          </h2>

          <ul class="grid grid-cols-3 gap-4 px-4 text-xs print:grid-cols-5 lg:grid-cols-5 lg:px-8">
            <li class="text-center">
              <h3 class="mb-2 text-xs text-primary dark:text-dark-primary lg:text-base">Nombre</h3>
              <p
                class="text-[10px] capitalize text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Nombre -->
                {{ currentInvoice?.clientName }}
              </p>
              <p
                class="text-[10px] capitalize text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Nombre 2 -->
                {{ currentInvoice?.clientName2 }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-dark-strong text-xs text-primary dark:border-light-strong dark:text-dark-primary lg:text-base"
              >
                Empresa
              </h3>
              <p
                class="text-[10px] text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Empresa -->
                {{ currentInvoice?.clientCompany }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-dark-strong text-xs text-primary dark:border-light-strong dark:text-dark-primary lg:text-base"
              >
                Forma de pago
              </h3>
              <p
                class="text-[10px] text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Forma de pago -->
                {{ currentInvoice?.paymentType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-dark-strong text-xs text-primary dark:border-light-strong dark:text-dark-primary lg:text-base"
              >
                Moneda
              </h3>
              <p
                class="text-[10px] text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Moneda -->
                {{ currentInvoice?.currencyType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-dark-strong text-xs text-primary dark:border-light-strong dark:text-dark-primary lg:text-base"
              >
                Tipo de cambio
              </h3>
              <p
                class="text-[10px] text-dark-strong dark:text-light-strong print:text-[10px] lg:text-xs"
              >
                <!-- Exchange -->
                {{ currentInvoice?.exchangeCost ? '$' : ''
                }}{{ currentInvoice?.exchangeCost ? currentInvoice?.exchangeCost : 'N/A' }}
              </p>
            </li>
          </ul>
        </section>
      </section>

      <!-- Items table -->
      <section
        class="rounded-box relative mt-4 hidden max-h-[240px] min-h-[220px] overflow-x-auto border border-light-strong bg-white dark:border-dark-medium dark:bg-dark-strong print:block print:border print:border-light-strong print:shadow-none lg:block"
      >
        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
        >
          <div class="w-72 print:w-7/12 lg:basis-5/12">
            <h5 class="w-full py-2 font-bold text-primary dark:text-dark-primary">Descripción</h5>
          </div>
          <!-- <h5
            class="py-2 text-center font-bold text-primary dark:text-dark-primary print:w-1/12 print:basis-1/12 lg:basis-[10%]"
          >
            Condición
          </h5> -->
          <h5
            class="py-2 text-center font-bold text-primary dark:text-dark-primary print:w-1/12 lg:basis-1/12"
          >
            Cantidad
          </h5>
          <h5
            class="py-2 text-center font-bold text-primary dark:text-dark-primary print:basis-2/12 lg:basis-2/12"
          >
            Precio unitario
          </h5>
          <h5
            class="w-12 py-2 text-right font-bold text-primary dark:text-dark-primary print:w-1/12"
          >
            Importe
          </h5>
        </div>

        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
          v-for="(item, index) in invoiceItemList"
          :key="index"
        >
          <div class="w-72 print:w-7/12 lg:basis-5/12">
            <p
              class="w-full overflow-x-hidden pt-2 text-left text-dark-strong dark:text-light-strong print:text-[10px]"
            >
              <!-- Nombre del item -->
              {{ item.itemName || 'Artículo sin descripcion' }}
            </p>
            <p
              class="w-full overflow-x-hidden pb-2 text-left italic text-dark-primary dark:text-light-primary print:text-[10px]"
            >
              <!-- Nombre del item -->
              {{ item.itemDescription || 'Artículo sin descripcin' }}
            </p>
          </div>
          <!-- <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:w-1/12 print:basis-1/12 print:text-[10px] lg:basis-[10%]"
          >
            
            {{ item.condition }}
          </p> -->
          <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:w-1/12 lg:basis-1/12"
          >
            <!-- Cantidad -->
            {{ item.qty }}
          </p>
          <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:basis-2/12 lg:basis-2/12"
          >
            {{
              new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(item.price)
            }}
          </p>
          <p class="w-12 py-2 text-right text-dark-strong dark:text-light-strong print:w-1/12">
            {{
              new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(item.total)
            }}
          </p>
        </div>
      </section>

      <!-- Items mobile -->
      <section class="mt-4 print:hidden lg:hidden">
        <h3
          class="mx-auto mb-4 w-fit border-b-2 border-primary text-center text-base text-dark-medium dark:text-light-medium"
        >
          Artículos
        </h3>
        <div
          class="carousel-center carousel rounded-box max-w-md space-x-4 bg-light-strong p-4 dark:bg-dark-strong"
        >
          <div class="carousel-item" v-for="(item, index) in invoiceItemList" :key="index">
            <div class="card bg-base-100 shadow-xl dark:bg-dark-medium">
              <div class="card-body text-xs">
                <h2 class="card-title w-52 text-[12px] text-dark-medium dark:text-light-medium">
                  {{ item.itemName || 'Articulo sin descripcion' }}
                </h2>
                <p class="text-dark-medium dark:text-light-medium">
                  <span class="font-bold text-primary dark:text-primary/50">Condición:</span>
                  {{ item.condition }}
                </p>
                <p class="text-dark-medium dark:text-light-medium">
                  <span class="font-bold text-primary dark:text-primary/50">Cantidad:</span>
                  {{ item.qty }}
                </p>
                <p class="text-dark-medium dark:text-light-medium">
                  <span class="font-bold text-primary dark:text-primary/50">Precio unitario:</span>
                  {{
                    new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(item.price)
                  }}
                </p>
                <div class="card-actions items-center">
                  <button
                    class="btn flex gap-2 border-light-strong bg-white text-xs text-primary hover:border-light-strong hover:bg-transparent dark:border-dark-medium dark:bg-dark-strong"
                  >
                    <span class="text-dark-medium dark:text-light-medium">Importe: </span>
                    <span>
                      {{
                        new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        }).format(item.total)
                      }}</span
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Terms and total sections -->
      <section
        class="flex w-full flex-col-reverse gap-4 overflow-y-hidden py-4 print:flex-row lg:flex-row"
      >
        <section
          class="rounded-box flex w-full flex-col gap-4 overflow-y-hidden border border-light-strong bg-white px-6 py-4 dark:border-dark-medium dark:bg-dark-strong print:w-3/5 print:basis-4/5 print:flex-row print:border print:border-light-strong print:pr-0 print:shadow-none lg:w-4/5 lg:flex-row"
        >
          <div class="overflow-y-hidden print:w-2/5 lg:w-1/2">
            <h3 class="mb-2 w-fit text-primary dark:text-dark-primary print:text-xs">
              Condiciones del servicio
            </h3>
            <p
              class="w-[50ch] text-[8px] italic text-dark-strong dark:text-light-strong print:w-full print:text-[6px]"
            >
              AGRADECIENDO SU AMABLE PREFERENCIA NOS ES GRATO SOMETER A SU CONSIDERACION NUESTRA
              COTIZACION DE ACUERDO A SU REQUERIMIENTO, ESPERANDO SEA SATISFACTORIA A SUS
              NECESIDADES, LOS PRECIOS MENCIONADOS ESTAN SUJETOS A ALTERACIONES. POR LO ANTERIOR,
              QUEDAMOS A SUS ORDENES PARA CUALQUIER DUDA O ACLARACION AL RESPECTO.
            </p>
          </div>
          <div class="w-1/2 print:w-2/5">
            <h3 class="mb-2 w-fit text-primary dark:text-dark-primary print:text-xs">Notas:</h3>
            <p
              class="h-12 w-[50ch] overflow-hidden text-[8px] uppercase italic text-dark-strong dark:text-light-strong print:w-full print:text-[6px]"
            >
              <!-- Notas -->
              {{ currentInvoice?.notes }}
            </p>
          </div>
        </section>
        <section
          class="rounded-box flex w-full basis-[30%] flex-col justify-center border border-light-strong bg-white px-6 py-4 dark:border-dark-medium dark:bg-dark-strong print:basis-[30%] print:border print:border-light-strong print:px-4 print:text-xs print:shadow-none lg:w-1/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <p class="text-xs text-primary dark:text-dark-primary">Subtotal</p>
              <p class="text-xs text-primary dark:text-dark-primary">IVA 16%</p>
            </div>
            <div class="flex flex-col items-end gap-2 text-xs">
              <p class="text-dark-strong dark:text-light-strong">
                <!-- Subtotal -->
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(currentInvoice?.invoiceSubtotal as number)
                }}
              </p>
              <p class="text-dark-strong dark:text-light-strong">
                <!-- Tax -->
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(currentInvoice?.invoiceTax as number)
                }}
              </p>
            </div>
          </div>
          <div class="divide divider my-0 w-full"></div>
          <div class="flex w-full justify-between font-bold">
            <p class="text-primary dark:text-dark-primary">Total</p>
            <p class="text-primary">
              <!-- Total -->
              {{
                new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(currentInvoice?.invoiceTotal as number)
              }}
            </p>
          </div>
        </section>
      </section>
    </div>
    <!-- :class="{ hidden: user }" -->
    <section class="mt-8 hidden lg:print:h-screen lg:print:w-screen">
      <!-- <img src="../assets/logo-bgremoved.png" class="mb-2 h-24" alt="" /> -->
      <div
        class="relative flex w-full flex-col items-center rounded-[20px] bg-white px-8 py-8 text-xs shadow-lg dark:bg-dark-strong print:h-[500px] print:max-h-[500px] lg:h-[70vh] lg:text-base"
      >
        <h2
          class="inset-0 top-4 h-fit text-center text-xl font-bold uppercase italic text-primary dark:text-primary/50 print:block lg:block"
        >
          Ficha Técnica
        </h2>
        <section class="h-full overflow-hidden">
          <div class="container mx-auto h-full px-5 py-8">
            <div
              class="mx-auto flex h-full flex-col items-center justify-center gap-8 print:w-full print:flex-row print:flex-nowrap lg:flex-row"
            >
              <!-- <figure
                v-if="currentInvoice.features.image"
                class="h-full rounded"
                :class="{
                  'print:h-auto print:w-1/2 lg:w-auto': currentInvoice.features.text,
                  'mx-auto print:h-auto print:w-1/2 lg:h-full lg:w-full':
                    !currentInvoice.features.text,
                }"
              >
                <img class="h-full w-full" alt="ecommerce" :src="currentInvoice.features.image" />
              </figure> -->
              <!-- <div
                v-if="currentInvoice.features.text"
                class="w-full basis-1/2 leading-tight lg:mt-0 lg:w-1/2"
              >
                <p class="mx-auto h-full w-full basis-1/2 text-[10px]">
                  {{ currentInvoice.features.text }}
                </p>
              </div> -->
            </div>
          </div>
        </section>
      </div>
      <!-- <section class="mt-4 flex justify-end">
        <ul class="mr-0 flex gap-8">
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'nuevo'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Nuevo
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'usado'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Usado
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'refurbished'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Refurbished
          </li>
        </ul>
      </section> -->
    </section>

    <!-- Crear PDF usuario -->
    <div class="pdf flex justify-center print:hidden" v-if="!user">
      <button
        @click="generatePDF"
        class="mt-8 flex h-14 w-40 flex-row items-center justify-center gap-2 rounded-lg border border-light-strong bg-primary px-10 py-6 text-xs text-white transition-all dark:border-dark-strong dark:bg-primary/50"
      >
        <i class="fa-solid fa-file-pdf text-lg"></i>
        Crear PDF
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.pdf {
  @media print {
    display: none;
  }
}
.invoice-view {
  .nav-link {
    margin-top: 16px;
    margin-bottom: 32px;
    align-items: center;
    // color: #1a1a1a;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    // background-color: #fff;
    @apply rounded-box;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        // color: #1a1a1a;
        // color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      // button {
      //   color: #fff;
      // }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          // font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
