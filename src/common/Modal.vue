<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-modal id="modalbackdrop" ref="modalbackdrop" :title="title"
                 :hide-backdrop="selectedBackdrop=='false'"
                 :no-close-on-backdrop="selectedBackdrop=='false' || selectedBackdrop=='static'">
          <div v-html="message"></div>
          <template slot="modal-footer">
            <b-button variant="primary" style="color:#fff;" @click="somethingModal()" class="mr-1">확인</b-button>
            <b-button variant="secondary" style="color:#fff;" v-if="action" @click="hideModal()">취소</b-button>
          </template>
        </b-modal>

      </b-colxx>
    </b-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selectedBackdrop: 'true',
        message: '',
        title: '알림',
        action: false,
        doAction: '',
      }
    },
    created() {
      this.$eventBus.$on('modalOpen', this.openModal);
    },
    methods: {
      openModal(params) {
        if (params.title) this.title = params.title;
        else this.title = '알림';

        if (params.message) this.message = params.message;
        if (params.type == 'confirm') {
          this.action = true;
        } else this.action = false;
        if (params.doAction) {
          this.doAction = params.doAction;
        } else this.doAction = '';

        this.$refs['modalbackdrop'].show();
      },
      hideModal() {
        this.$refs['modalbackdrop'].hide()


      },
      somethingModal() {
        if (this.doAction) {
          this.doAction();
        }
        this.$refs['modalbackdrop'].hide()


      }
    }
  }
</script>
