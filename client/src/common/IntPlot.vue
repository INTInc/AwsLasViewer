<template>
  <canvas
    ref="plot"
    class="geotoolkit-plot"
    oncontextmenu="return false"
  />
</template>

<script>
export default {
    name: 'IntPlot',
    data () {
        return {
            native: null
        };
    },
    mounted () {
        this.native = this.$refs.plot;
    }
};
</script>

<style scoped>

</style>
