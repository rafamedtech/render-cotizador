<script lang="ts" setup>
interface Props {
  status: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['@modal']);

const openModal = () => {
  emit('@modal');
};

const iconName = computed((): string => {
  if (props.status === 'Vendida') {
    return 'icon-park-outline:check-one';
  }

  if (props.status === 'Borrador') {
    return 'ri:draft-line';
  }

  if (props.status === 'Pendiente') {
    return 'icon-park-outline:caution';
  }
  if (props.status === 'Cancelada') {
    return 'material-symbols:cancel-outline';
  }

  return '';
});
</script>

<template>
  <div class="form-control relative flex w-full flex-row text-[12px]">
    <button
      type="button"
      @click="openModal"
      class="flex w-32 items-center justify-center gap-1 rounded-md border bg-white p-2 text-dark-medium dark:bg-dark-medium dark:text-light-medium"
      :class="{
        'border-orange-500  dark:border-orange-500/50': status === 'Pendiente',
        'border-green-500  dark:border-green-500/50': status === 'Vendida',
        'border-red-500  dark:border-red-500/50': status === 'Cancelada',
        'border-gray-400  dark:border-gray-600': status === 'Borrador',
      }"
    >
      <Icon
        :name="iconName"
        class="text-base"
        :class="{
          'text-orange-500  dark:border-orange-500/50': status === 'Pendiente',
          'text-green-500  dark:border-green-500/50': status === 'Vendida',
          'text-red-500  dark:border-red-500/50': status === 'Cancelada',
          'text-gray-400  dark:border-gray-600': status === 'Borrador',
        }"
      />
      {{ status }}
    </button>
  </div>
</template>
