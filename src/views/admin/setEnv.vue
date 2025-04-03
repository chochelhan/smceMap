<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>운영환경 설정</h1>
    </b-colxx>
    <b-colxx xxs="12" class="box-margin30  data-regist">
      <b-card class="mb-4">
        <div class="margin30"></div>
        <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip tooltip-label-right">
          <b-row>
            <b-colxx sm="6">
              <b-form-group label="현재 비밀번호" class="has-float-label error-l-100 margin30 required">
                <span></span>
                <b-form-input type="password" id="nowpass" v-model="$v.nowpass.$model"
                              :state="!$v.nowpass.$error"/>
                <b-form-invalid-feedback v-if="!$v.nowpass.required">현재 비밀번호를 입력하세요
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>

          </b-row>
          <b-row>
            <b-colxx sm="6"  style="margin-bottom:30px;">
              <div class="radio-type">
                <span class="radio-label required"><span></span>이전 콜센터 사용</span>
                <b-form-radio-group class="radio-element" v-model.trim="useFallback">
                  <b-form-radio value="yes"> 예</b-form-radio>
                  <b-form-radio value="no"> 아니오</b-form-radio>
                </b-form-radio-group>
              </div>
            </b-colxx>
          </b-row>
          <!--<b-row>-->
            <!--<b-colxx sm="6">-->
              <!--<b-form-group label="새 비밀번호" class="has-float-label error-l-200 margin30 required">-->
                <!--<span></span>-->
                <!--<b-form-input type="password" id="newpass" v-model="$v.newpass.$model"-->
                              <!--:state="!$v.newpass.$error"/>-->
                <!--<b-form-invalid-feedback v-if="!$v.newpass.required">새 비밀번호를 입력하세요</b-form-invalid-feedback>-->
                <!--<b-form-invalid-feedback v-else-if="!$v.newpass.checkNewpass">8~15자의 영문자와 숫자 특수문자의 조합-->
                <!--</b-form-invalid-feedback>-->

              <!--</b-form-group>-->
            <!--</b-colxx>-->
          <!--</b-row>-->
          <!--<b-row>-->
            <!--<b-colxx sm="6">-->
              <!--<b-form-group label="새 비밀번호 확인" class="has-float-label error-l-200 margin30 required">-->
                <!--<span></span>-->
                <!--<b-form-input type="password" id="renewpass" v-model="$v.renewpass.$model"-->
                              <!--:state="!$v.renewpass.$error"/>-->
                <!--<b-form-invalid-feedback v-if="!$v.renewpass.required">새 비밀번호 확인을 입력하세요</b-form-invalid-feedback>-->
                <!--<b-form-invalid-feedback v-else-if="!$v.renewpass.checkEqualOrg">새 비밀번호와 새 비밀번호 확인이 다릅니다-->
                <!--</b-form-invalid-feedback>-->

              <!--</b-form-group>-->
            <!--</b-colxx>-->
          <!--</b-row>-->

          <div class="button-row">
            <b-button type="button" variant="light" size="lg" @click="goBack()" class="mt-4 cancle">취 소</b-button>
            <b-button type="submit" variant="primary" size="lg" class="mt-4">운영환경 변경</b-button>
          </div>
        </b-form>

      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
  import {API_URL_ADMIN_CHAGEPASSWORD, API_URL_ADMIN_FALLBACK ,API_URL_ADMIN_GET_FALLBACK,CONFIG_HEADER_POST} from '../../api/urls';
  import {validationMixin} from "vuelidate";

  const {
    required,
  } = require("vuelidate/lib/validators");

  export default {
    data() {
      return {
        nowpass: '',
        useFallback: 'no',
        newpass: '',
        renewpass: '',
        insertFlag: false,

      };
    },
    mixins: [validationMixin],
    validations: {
      nowpass: {
        required
      }

    },
    mounted()
    {
      this.$http.post(API_URL_ADMIN_GET_FALLBACK, {}, {headers: CONFIG_HEADER_POST}).then(res =>
      {
        if (res.data.code == 2000)
        {
          this.useFallback = res.data.contents.license.fallback;
        }
      })
    },

    methods: {
      goBack() {
        this.$router.push('/');
      },
      onValitadeFormSubmit() {
        if (this.insertFlag) return;
        this.$v.$touch();
        if (!this.$v.$anyError) {
          var r = confirm("운영환경을 변경하시겠습니까?");
          if (r == true) {
            this.insertFlag = true;
            this.setEnv();
          }


        }
      },
      setEnv() {
        let params = {
          nowpass: this.nowpass,
          fallback: this.useFallback,
        };
        this.$http.post(API_URL_ADMIN_FALLBACK, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.insertFlag = false;
          if (res.data.code == 2000) {
            let params = {};
            switch (res.data.contents) {
              case 'succ':
                params = {
                  message: '운영환경이 변경되엇습니다.',
                  doAction: () => {
                    // this.goBack();
                  }
                };
                break;
              case 'notEqual':
                params = {
                  message: '현재 비밀번호가 일치하지 않습니다',
                };
                break;

              default:
                params = {
                  message: '잘못된 접근입니다',
                };
                break;
            }
            this.$eventBus.$emit('modalOpen', params);
          }
        }).catch((error) => {
          this.insertFlag = false;
         });
      }
    }

  }
</script>
<style lang="scss" scoped="true">
  .margin30 {
    margin-bottom: 30px;
  }

  .box-margin30 {
    margin: 30px 0;
  }

  .groupIdView {
    padding: 15px 0 0 10px;
    font-weight: bold;
    min-height: 30px;

  }

  .button-row {
    width: 630px;
    margin: auto;
    button {
      min-height: 50px;
      width: 280px;
      &:first-child {
        margin-right: 30px;
      }
      &.cancle {
        background: #999;
        color: #fff;
      }
    }
  }
</style>
