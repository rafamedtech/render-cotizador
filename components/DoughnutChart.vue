<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const { invoices } = await useInvoices();
const vendidas = computed(() => invoices.value.filter((invoice) => invoice.status === 'Vendida'));
const pendientes = computed(() =>
  invoices.value.filter((invoice) => invoice.status === 'Pendiente')
);
const canceladas = computed(() =>
  invoices.value.filter((invoice) => invoice.status === 'Cancelada')
);

const data = {
  labels: ['Vendidas', 'Pendientes', 'Canceladas', 'Borrador'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [vendidas.value.length, pendientes.value.length, canceladas.value.length, 10],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div>
    <Doughnut :data="data" :options="options" />
  </div>
</template>
