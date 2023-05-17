import { defineStore } from 'pinia';

interface Credentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const { auth } = useSupabaseAuthClient();
  const user = useSupabaseUser();

  const store = useStore();
  const { openAlert, alertType, alertMsg, isLoading } = storeToRefs(store);

  async function userLogin({ email, password }: Credentials) {
    try {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      isLoading.value = false;

      setTimeout(() => {
        openAlert.value = true;
        alertType.value = 'success';
        alertMsg.value = 'Bienvenido';
      }, 1000);

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 3000);

      if (error) throw error;
    } catch (error) {
      console.error(error);
      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'fail';
      alertMsg.value = 'No se pudo iniciar sesión, por favor revisa el usuario y contraseña';

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 3000);
    }
  }

  async function userLogout() {
    try {
      const { error } = await auth.signOut();

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    try {
      await $fetch('/api/_supabase/session', {
        method: 'POST',
        body: { event: 'SIGNED_OUT', session: null },
      });
      user.value = null;
    } catch (error) {
      console.error(error);
    }

    await navigateTo('/login');
  }

  return {
    userLogin,
    userLogout,
  };
});
