<template>
  <div
    ref="host"
    class="geotoolkit-plot-host"
    :style="{height: height ? height : plotHostHeight()}"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>

<script>
import PlotHostHeightUtil from 'utils/PlotHostHeightUtil';
export default {
    name: 'IntPlotHost',
    props: {
        height: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            native: null
        };
    },
    mounted () {
        this.native = this.$refs.host;
    },
    methods: {
        plotHostHeight () {
            return new PlotHostHeightUtil().plotHostHeight;
        }
    }
};
</script>

<style scoped>

</style>
