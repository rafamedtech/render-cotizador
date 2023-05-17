<script setup>
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';

const user = useSupabaseUser();
const { userLogin } = useAuthStore();

const store = useStore();
const { isLoading, isLoadingFull } = storeToRefs(store);
onBeforeMount(() => {
  isLoadingFull.value = false;
});

const formData = reactive({
  email: '',
  password: '',
});

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Este campo es requerido', required),
      email: helpers.withMessage('Formato inválido', email),
    },
    password: {
      required: helpers.withMessage('Este campo es requerido', required),
      minLength: helpers.withMessage(
        'La contraseña debe tener al menos 6 caracteres',
        minLength(6)
      ),
    },
  };
});
const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
  v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  isLoading.value = true;
  await userLogin(formData);
};

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/', { replace: true });
  }
});

useHead({
  title: 'Iniciar sesión | Suntech Cotizador',
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <Transition name="slide" appear>
    <main class="min-h-screen overflow-x-hidden bg-light-medium dark:bg-dark-medium">
      <section
        class="container mx-auto flex flex-col flex-wrap items-center justify-center px-5 py-24 text-gray-400 lg:gap-8"
      >
        <figure class="rounded-xl bg-dark-medium p-4">
          <img src="@/assets/images/Suntech-logo-cropped.png" alt="" class="w-48" />
        </figure>
        <form
          @submit.prevent="submitForm"
          class="bg-opacity-50 mt-10 flex w-full flex-col rounded-[20px] border border-light-strong bg-white p-8 dark:border-dark-medium dark:bg-dark-strong md:mt-0 md:w-1/2 lg:w-2/6"
        >
          <h2
            class="mb-5 w-fit border-b-2 border-primary text-lg font-medium text-dark-medium dark:border-primary/50 dark:text-light-strong"
          >
            Iniciar sesión
          </h2>
          <div class="relative mb-4">
            <label for="full-name" class="text-xs leading-7 text-gray-400">Email</label>
            <div class="relative">
              <input
                v-model="formData.email"
                type="text"
                id="email"
                name="email"
                placeholder="Ej. correo@ejemplo.com"
                class="input-primary input w-full bg-light-medium px-3 py-1 text-base leading-8 text-dark-medium outline-none transition-all duration-500 focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                :class="{
                  ' border border-red-500 focus:border-red-500': v$.email.$error,
                  'border border-[#42d392] ': !v$.email.$invalid,
                }"
                @change="v$.email.$touch"
                autocomplete="off"
              />
              <Icon
                v-if="!v$.email.$invalid"
                class="absolute right-2 h-full text-xl text-green-500"
                name="heroicons-solid:check-circle"
              />
              <Icon
                v-if="v$.email.$error"
                class="absolute right-2 h-full text-xl text-red-500"
                name="heroicons-solid:x-circle"
              />
            </div>
            <span class="text-xs text-red-500" v-if="v$.email.$error">{{
              v$.email.$errors[0].$message
            }}</span>
          </div>

          <div class="relative mb-4">
            <label for="password" class="text-xs leading-7 text-gray-400">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                name="password"
                type="password"
                class="input-primary input w-full bg-light-medium px-3 py-1 text-base leading-8 text-dark-medium outline-none transition-all duration-500 focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                :class="{
                  ' border-red-500 focus:border-red-500': v$.password.$error,
                  'border-[#42d392]': !v$.password.$invalid,
                }"
                @change="v$.password.$touch"
              />
              <Icon
                v-if="!v$.password.$invalid"
                class="absolute right-2 h-full text-xl text-green-500"
                name="heroicons-solid:check-circle"
              />
              <Icon
                v-if="v$.password.$error"
                class="absolute right-2 h-full text-xl text-red-500"
                name="heroicons-solid:x-circle"
              />
            </div>
            <span class="text-xs text-red-500" v-if="v$.password.$error">{{
              v$.password.$errors[0].$message
            }}</span>
          </div>

          <!-- <BaseInput label="Email" @change="v$.email.$touch" v-model="formData.email">
          <span class="text-xs text-red-500" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </BaseInput>

        <BaseInput label="Contraseña" v-model="formData.password">
          <span class="text-xs text-red-500" v-if="v$.password.$error">{{
            v$.password.$errors[0].$message
          }}</span>
        </BaseInput> -->

          <button
            class="btn rounded-lg border-0 bg-primary px-8 py-2 font-sans font-bold text-white hover:bg-secondary focus:outline-white"
          >
            <span v-if="!isLoading">Enviar</span>
            <LoadingSpinner v-else />
          </button>
        </form>
      </section>
    </main>
  </Transition>
</template>
