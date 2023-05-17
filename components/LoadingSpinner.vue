<template>
  <div class="loading">
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  top: 0;
  left: 0;
  z-index: 101;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  span {
    display: block;
    margin: 0 auto;
    border: 3px solid transparent;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
    @apply h-6 w-6 border-t-dark-medium border-b-dark-medium dark:border-t-light-medium dark:border-b-light-medium;
  }
}
</style>
