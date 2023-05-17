<script lang="ts" setup>
interface Props {
  label: string;
  placeholder?: string;
  isrequired?: boolean;
  modelValue?: string | number | Date | null | undefined;
}

defineProps<Props>();

const handleInputChange = (event: Event) => (event.target as HTMLInputElement).value;
</script>

<template>
  <div class="form-control relative">
    <label :for="label" class=""
      >{{ label }}<span v-if="isrequired" class="text-red-500">*</span></label
    >
    <input
      v-bind="$attrs"
      :value="modelValue"
      class="input-primary input w-full bg-light-medium disabled:input-bordered placeholder:italic disabled:bg-light-medium dark:bg-dark-medium"
      :id="label"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', handleInputChange($event))"
    />

    <label class="label">
      <slot></slot>
    </label>
  </div>
</template>
