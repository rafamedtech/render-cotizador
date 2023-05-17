<template>
  <section class="empty flex flex-col text-dark-medium dark:text-light-strong">
    <img src="@/assets/images/illustration-empty.svg" alt="" />
    <h3>No hay cotizaciones</h3>
    <p>
      Crea una nueva cotización haciendo click en el botón
      <span class="text-primary dark:text-primary/50">+Cotización</span>
    </p>
  </section>
</template>

<style lang="scss" scoped>
.empty {
  margin-top: 60px;
  align-items: center;

  img {
    width: 214px;
    height: 200px;
  }

  h3 {
    font-size: 20px;
    margin-top: 40px;
  }

  p {
    text-align: center;
    max-width: 224px;
    font-size: 12px;
    font-weight: 300;
    margin-top: 16px;
  }
}
</style>
