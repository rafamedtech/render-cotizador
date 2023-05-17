<script lang="ts" setup>
import { Modal } from '@/types/modal';

const store = useStore();
const { modalType, backBtn, isLoading } = storeToRefs(store);
const { userLogout } = useAuthStore();

const modalText = computed(() => {
  switch (modalType.value) {
    case Modal.Discard:
      return '¿Seguro que quieres salir? Los cambios no serán guardados!';
    case Modal.DiscardEdit:
      return '¿Seguro que quieres salir? Los cambios no serán guardados!';
    case Modal.Logout:
      return '¿Seguro que deseas cerrar sesión?';
    case Modal.Delete:
      return '¿Seguro que deseas eliminar la cotización?';
    case Modal.Email:
      return 'La cotización fue enviada exitósamente';
    case Modal.Pdf:
      return 'Asegúrate de elegir "Guardar como PDF" en el destino.';

    default:
      '';
  }
});

// Action Button
// const backBtn = ref<HTMLElement | null>(null);
const { deleteInvoiceOnDb } = await useInvoice();

function toggleModal() {
  backBtn.value?.click();
  setTimeout(() => {
    const html: HTMLHtmlElement | null = document.querySelector('html');
    if (html) html.style.overflowY = 'scroll';
  }, 100);
}
async function onAction() {
  switch (modalType.value) {
    case Modal.Discard:
      backBtn.value?.click();
      await navigateTo('/cotizaciones');
      break;
    case Modal.DiscardEdit:
      const router = useRouter();
      backBtn.value?.click();
      router.back();
      break;
    case Modal.Logout:
      toggleModal();
      await userLogout();
      break;
    case Modal.Delete:
      const route = useRoute();
      const { id }: any = route.params;
      const { currentInvoice } = await useInvoice(id.toString());
      await deleteInvoiceOnDb(currentInvoice.value?.id);
      toggleModal();
      await navigateTo('/cotizaciones');
      break;
    case Modal.Email:
      toggleModal();
      break;
    case Modal.Pdf:
      toggleModal();
      window.print();
      break;

    default:
      return;
  }
}

const actionBtnText = computed(() => {
  switch (modalType.value) {
    case Modal.Logout:
      return 'Salir';
    case Modal.Delete:
      return 'Eliminar';
    default:
      return 'Aceptar';
  }
});
</script>

<template>
  <div>
    <input type="checkbox" id="my-modal-6" class="modal-toggle" />

    <div class="modal modal-bottom sm:modal-middle print:hidden">
      <div class="modal-box dark:bg-dark-medium">
        <h3 class="text-lg font-bold text-primary dark:text-primary/50">{{ modalType }}</h3>
        <p class="py-4 text-dark-medium dark:text-light-medium">{{ modalText }}</p>
        <div class="modal-action">
          <label ref="backBtn" for="my-modal-6" class="hidden"></label>
          <button
            v-if="modalType !== Modal.Email"
            @click="toggleModal"
            class="btn bg-dark-strong hover:bg-dark-medium hover:text-primary lg:w-32"
          >
            Regresar
          </button>
          <button
            class="btn-primary btn cursor-pointer bg-primary text-light-medium hover:bg-primary/50 dark:bg-primary/50 dark:hover:bg-primary lg:w-32"
            @click="onAction"
          >
            <label for="my-modal-6" class="hidden"></label>
            <LoadingSpinner v-if="isLoading" />
            <span v-else>{{ actionBtnText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
