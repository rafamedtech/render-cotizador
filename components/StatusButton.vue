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
  <div class="form-control relative flex w-full flex-row">
    <button
      type="button"
      @click="openModal"
      class="flex w-32 items-center justify-center gap-1 rounded-md p-2 text-white"
      :class="{
        'bg-orange-500  dark:bg-orange-500/50': status === 'Pendiente',
        'bg-green-500  dark:bg-green-500/50': status === 'Vendida',
        'bg-red-500  dark:bg-red-500/50': status === 'Cancelada',
        'bg-gray-400  dark:bg-gray-600': status === 'Borrador',
      }"
    >
      <Icon :name="iconName" class="text-base" />
      {{ status }}
    </button>
  </div>
</template>
