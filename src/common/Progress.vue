<template>
  <div>
    <b-row v-if="progressShow">
      <div class="tscreenLayout">
        <b-colxx xxs="12">
          <div class="loading"></div>
        </b-colxx>
      </div>
    </b-row>

  </div>
</template>
<style scoped="true">
  .tscreenLayout {
    width: calc(100vw);
    height: calc(100vh);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
<script>
  export default {
    data() {
      return {
        progressShow: false,
      }
    },
    created() {
      this.$eventBus.$on('progressOpen', this.open);
      this.$eventBus.$on('progressHide', this.hide);
    },
    methods: {
      open() {
        this.progressShow = true;
      },
      hide() {
        this.progressShow = false;

      }
    }
  }
</script>
