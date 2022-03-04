<template>
  <div style="width: 112px; height: 90px">
    <div class="int-loader" />
    <div v-if="label != null" style="text-align: center; padding-left: 14px;">
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
    name: 'IntLoader',
    props: {
        label: {
            type: String,
            default: null
        }
    }
};
</script>

<style scoped>
  .int-loader {
    margin: auto;
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #1c3d62; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
