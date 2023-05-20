<script setup>
import VueDatepickerUi from 'vue-datepicker-ui';
import 'vue-datepicker-ui/lib/vuedatepickerui.css';

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const store = useStore();
const { invoiceDialog, searchQuery, filterQuery, searchDate } = storeToRefs(store);

const emit = defineEmits(['@search', '@clear']);

const searchBarRef = ref(null);
function onSearch() {
  invoiceDialog.value = false;
  contactsModal.value = false;
  emit('@search');
}

// Contacts autocomplete

const { contactData } = storeToRefs(store);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);
const contactsModal = ref(false);

const filterContacts = () => {
  if (searchQuery.value.length === 0) {
    filteredContacts.value = uniqueContacts.value;
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact.clientCompany.toLowerCase().startsWith(searchQuery.value.toLowerCase());
  });
};

function setContact(contact) {
  searchQuery.value = contact;
  contactsModal.value = false;
}

onMounted(() => {
  filterContacts();
});

watch(searchQuery, () => {
  filterContacts();
});

// Filter contacts end

function clearSearch() {
  contactsModal.value = false;
  if (searchQuery.value === '' && filterQuery.value === 'Todas' && !searchDate.value) {
    return;
  }
  searchQuery.value = '';
  filterQuery.value = 'Todas';
  searchDate.value = null;
  emit('@search', searchQuery.value);
  emit('@clear');
}

const filterDetails = ref(false);

const search = ref(null);
function toggleSearch() {
  filterDetails.value = !filterDetails.value;
  // search.value.focus();
}
</script>

<template>
  <form
    @submit.prevent="onSearch(filterQuery)"
    ref="searchBarRef"
    class="card relative flex w-full flex-col gap-2 border border-light-strong bg-white p-4 dark:border-dark-medium dark:bg-dark-strong lg:mx-auto lg:w-2/3 lg:flex-row lg:items-center"
  >
    <Icon
      :name="filterDetails ? 'mdi:chevron-up' : 'material-symbols:display-settings-outline-rounded'"
      size="32"
      class="absolute right-4 top-4 cursor-pointer text-dark-medium dark:text-light-medium"
      @click="toggleSearch"
    />
    <div class="flex w-full flex-col">
      <label class="label">
        <span class="label-text text-primary dark:text-dark-primary">Buscar por cliente</span>
      </label>
      <div class="dropdown-bottom dropdown-end form-control dropdown relative w-full">
        <div class="relative">
          <input
            ref="search"
            v-model="searchQuery"
            @focus="contactsModal = true"
            @input="filterContacts"
            @keydown.esc="clearSearch"
            autocomplete="off"
            type="text"
            placeholder="Escribe nombre del cliente..."
            class="input-primary input w-full rounded-tl-2xl bg-light-medium focus:bg-transparent dark:bg-dark-medium"
          />
          <Icon
            v-if="searchQuery || searchDate"
            name="heroicons-solid:x-mark"
            class="absolute right-2 top-4 cursor-pointer text-primary"
            @click="clearSearch"
          />
          <!-- @click="setContact('')" -->
        </div>

        <div v-if="filteredContacts.length > 0 && contactsModal" class="relative w-full">
          <ul
            class="dropdown-content menu min-h-12 top-0 mt-2 flex max-h-[250px] w-full rounded-[10px] border border-light-strong bg-white p-2 shadow-lg dark:border-dark-medium dark:bg-dark-medium dark:text-light-strong"
          >
            <span class="py-2 pl-2 italic text-primary">Clientes disponibles</span>
            <li
              class="cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium"
              v-for="filteredContact in filteredContacts"
              :key="filteredContact.id"
            >
              <button type="button" @click="setContact(filteredContact.clientCompany)">
                {{ filteredContact.clientCompany }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!-- Search Details -->
      <Transition name="slide">
        <div v-if="filterDetails" class="mt-2 w-full flex-col gap-x-4 lg:grid lg:grid-cols-2">
          <div class="form-control mb-2 w-full flex-col justify-center gap-1 lg:mb-0">
            <label class="label m-0">
              <span class="label-text text-primary dark:text-dark-primary">Filtrar etapa</span>
            </label>
            <select
              v-model="filterQuery"
              class="input select-bordered select w-full items-center rounded-xl bg-light-medium font-normal text-dark-medium dark:bg-dark-medium dark:text-light-medium"
              @focus="contactsModal = false"
            >
              <!-- <option disabled selected>Filtrar etapa</option> -->
              <option>Todas</option>
              <option>Vendida</option>
              <option>Pendiente</option>
              <option>Cancelada</option>
              <option>Borrador</option>
              {{
                filterQuery
              }}
            </select>
          </div>
          <div class="form-control w-full flex-col justify-center gap-1">
            <!-- <label for="paymentDueDate" class="dark:text-light-strong">Fecha</label> -->
            <label class="label m-0">
              <span class="label-text text-primary dark:text-dark-primary">Fecha</span>
            </label>
            <ClientOnly>
              <VueDatepickerUi
                v-model="searchDate"
                lang="es"
                placeholder="Elige fecha"
                position="right"
                :date-format="dateOptions"
              />
            </ClientOnly>
          </div>
        </div>
      </Transition>
      <!--  -->
      <section
        class="mt-4 flex w-full justify-start gap-2 lg:w-1/2 lg:items-end lg:self-end lg:pl-2"
      >
        <button
          type="submit"
          class="btn-secondary btn w-full text-light-medium dark:border-dark-secondary dark:bg-dark-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar
        </button>
      </section>
    </div>
  </form>
</template>
