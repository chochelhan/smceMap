<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>알림 및 맵 설정</h1>
      <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
             <span>기본설정</span> | <span>알림 및 카카오맵키 설정</span>
          </b-nav>
       </span>
      <div class="top-right-button-container">
      </div>
    </b-colxx>
    <b-colxx xxs="12" class="box-margin30 data-regist">
      <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip tooltip-label-right">
        <b-card class="mb-4   padding-top30">
          <b-row>
            <b-colxx sm="6">
              <b-row class="margin30">
                <label class="left-padding">알림 팝업</label>
                <switches v-model="popup" theme="custom" color="primary"></switches>

              </b-row>
            </b-colxx>
            <b-colxx sm="6">
              <b-row class="margin30">
                <label class="left-padding">알림 사운드</label>
                <switches v-model="sound" theme="custom" color="primary"></switches>
              </b-row>
            </b-colxx>

            <b-colxx sm="6" style="height:70px;">

              <b-row class="margin30">
                <div  style="display:flex;">
                  <label class="left-padding">내부맵 사용</label>
                  <switches v-model="inMapuse" theme="custom" color="primary"></switches>
                </div>

              </b-row>

            </b-colxx>
            <b-colxx sm="6" style="height:70px;">

              <b-row class="margin30" style="display:flex;">
                <div  style="display:flex;">
                  <label class="left-padding">외부맵 사용</label>
                  <switches v-model="mapkeyuse" theme="custom" color="primary"></switches>
                </div>
                <div  v-if="mapkeyuse" style="padding-left:15px;min-width:370px;">
                  <b-form-group label="카카오 맵키" class="has-float-label error-l-100 margin30 required">
                    <span></span>
                    <b-form-input type="text" id="mapkey" v-model="mapkey"/>
                  </b-form-group>
                </div>
              </b-row>

            </b-colxx>

          </b-row>
          <b-row>
            <b-colxx sm="12">
              <div class="button-row">
                <b-button type="button" variant="light" size="lg" @click="$router.back()" class="mt-4 cancle">취 소
                </b-button>
                <b-button type="submit" variant="primary" style="color:#fff;" size="lg" class="mt-4">저 장</b-button>
              </div>
            </b-colxx>
          </b-row>
        </b-card>
      </b-form>
    </b-colxx>
  </b-row>
</template>

<script>
  import Switches from "vue-switches";
//bd3bfc8f061ffc5ff62adc09d9a563f4
  import {
    API_URL_SETTING_ALERTINSERT,
    API_URL_SETTING_ALERTGET,
    CONFIG_HEADER_POST
  } from '../../api/urls';

  export default {
    components: {
      switches: Switches
    },
    data() {
      return {
        popup: false,
        sound: false,
        mapkeyuse: false,
        mapkey: '',
        inMapuse:true,
        no: 0,
        insertFlag: false,
      };
    },
    created() {
    	this.$http.post(API_URL_SETTING_ALERTGET,{}, {headers: CONFIG_HEADER_POST}).then(res => {
    	  if(res.data.result=='succ') {
          this.setInfo(res.data);
        }
		  });
    },
    methods: {
      setInfo(info) {
        console.log(info)
        this.no = info.no;
        this.sound = (info.sound=='yes')?true:false;
        this.popup = (info.popup=='yes')?true:false;
        this.inMapuse = (info.inMapuse=='no')?false:true;
        if(info.mapkey) {
          this.mapkeyuse = true;
          this.mapkey = info.mapkey;
        }



      },
      onValitadeFormSubmit() {
        if (this.mapkeyuse && !this.mapkey) {
          let params = {
            message: '카카오맵키를 입력하세요',
          };
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        if(!this.mapkeyuse && !this.inMapuse) {
          let params = {
            message: '내부맵과 외부맵중 둘중 하나는 사용가능으로 설정하셔야 합니다',
          };
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        if (this.insertFlag) return;
        this.insertFlag = true;
        if (this.no > 0) {
          this.updateData();
        } else this.insertData();
      },
      insertData() {

        let params = this.setSendParams();
        this.$http.post(API_URL_SETTING_ALERTINSERT, params, {headers: CONFIG_HEADER_POST}).then(res => {
          if (!this.mapkeyuse) {
            localStorage['mapkey'] = '';
          } else {
            localStorage['mapkey'] = this.mapkey;
          }
          this.insertFlag = false;
          let msg = {
            message: '정보가 저장되었습니다',
          };
          this.$eventBus.$emit('modalOpen', msg);

        })
      },
      updateData() {
        let params = this.setSendParams();
        params.no = this.no;
        console.log(params);
        this.$http.post(API_URL_SETTING_ALERTINSERT, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.insertFlag = false;
          if (!this.mapkeyuse) {
            localStorage['mapkey'] = '';
          } else {
            localStorage['mapkey'] = this.mapkey;
          }

          let msg = {
            message: '정보가 수정정되었습니다',
          };
          this.$eventBus.$emit('modalOpen', msg);
        })
      },

      setSendParams() {
        let inMapUse = (this.inMapuse)?"yes":"no";
        let params = {
          sound: (this.sound) ? 'yes' : 'no',
          popup: (this.popup) ? 'yes' : 'no',
          mapkey: (this.mapkeyuse) ? this.mapkey : '',
          inMapuse:inMapUse
        };

        return params;
      }
    }
  }
</script>
<style lang="scss" scoped="true">
  .additem-box {
    .input-box {
      text-align: left;
      list-style: none;
      width: 350px;
      padding: 0;
      li {
        display: flex;
        margin: 5px 0;
        input {
          width: 280px;
        }
        .glyph-icon {
          margin-left: 10px;
          font-size: 20pt;
          color: #f00;
          margin-top: 3px;
          cursor: pointer;
          &.simple-icon-plus {
            color: #008ECC;
          }
        }
      }
    }
  }

  .left-padding {
    padding: 3px 0 0 20px;
    width: 130px;
  }

</style>
