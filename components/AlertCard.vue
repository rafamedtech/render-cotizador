<script lang="ts" setup>
const store = useStore();
const { alertType, alertMsg } = storeToRefs(store);

const iconName = computed((): string => {
  if (alertType.value === 'success') {
    return 'icon-park-outline:check-one';
  }
  if (alertType.value === 'warning') {
    return 'icon-park-outline:caution';
  }
  if (alertType.value === 'fail') {
    return 'material-symbols:cancel-outline';
  }

  return '';
});
</script>

<template>
  <div
    class="alert absolute inset-x-0 top-4 z-[9999] mx-auto w-fit text-white shadow-lg"
    :class="{ 'bg-red-500': alertType === 'fail', 'bg-green-500': alertType === 'success' }"
  >
    <div>
      <Icon :name="iconName" size="24" />
      <span>{{ alertMsg }}</span>
    </div>
  </div>
</template>
