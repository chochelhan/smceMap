<template>
  <div class="h-100">
    <router-view />
    <app-modal></app-modal>
    <app-progress></app-progress>

  </div>
</template>

<script>
  import Modal from './common/Modal'
  import Progress from './common/Progress'
  import jsonRpc from 'kurento-jsonrpc'
  export default {
    components: {
      'app-modal': Modal,
      'app-progress': Progress
    },
    data() {
      return {
        jsonRpcClientWs:null,
         ws_uri:'',
        connected:false,
        socketInitCall:null,
      }
    },
    watch: {
      '$route' (to, from) {

      }
    },
    created() {
      var hostName = location.hostname;
      var port = location.port;

      this.ws_uri = 'ws://'+hostName+':'+port+'/echo';
      this.setJsonRpc();

    },
    methods: {
      setJsonRpc() {

        var configuration = {
          hearbeat: 5000,
          sendCloseMessage : false,
          ws : {
            uri :this.ws_uri,
            useSockJS: false,
            onconnected :this.connectCallback,
            ondisconnect : this.disconnectCallback,
            onreconnecting : this.disconnectCallback,
            onreconnected : this.connectReCallback
          },
          rpc : {
            requestTimeout : 15000,
            sendResponse:this.callMessage,
          }
        };
        this.jsonRpcClientWs = new jsonRpc.clients.JsonRpcClient(configuration);


      },
      connectCallback() {
        console.log('connect')
        this.connected = true;
        this. socketInit();
      },
      connectReCallback() {
        console.log('rec')
      },
      disconnectCallback() {
        this.connected = false;
      },
      callMessage(params) {
        console.log('params')
        if(localStorage['memberkey']) {
          if(localStorage['isadmin'] == 'yes') {
            if(this.$route.name == 'mornitering') {
              this.$eventBus.$emit('showCallMessage',params);
            } else {
              sessionStorage.setObject('callMessage',params)
              this.$router.push({path:'/mornitering/mornitering'});
            }
          } else {
            var receiver = params.receiver;
            if(localStorage['pcs'] == receiver) {
              if(this.$route.name == 'mornitering') {
                this.$eventBus.$emit('showCallMessage',params);
              } else {
                sessionStorage.setObject('callMessage',params)
                this.$router.push({path:'/mornitering/mornitering'});
              }
            }
          }

        }
      },
      socketInit() {
        var params = {
          interval: 5000,
          operation: "connect",

        };
        this.jsonRpcClientWs.send("invoke", params , function(error, response){
          if(error) {
            console.log(error);
          } else {
            console.log("--succ--");
            console.log(response);
          }
        });

      },

    }
  };
</script>
