<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ title }}</h1>
      <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
             <span>기본설정</span> | <span class="pointer" @click="goList()">직원 관리</span>
          </b-nav>
       </span>
      <div class="top-right-button-container">
        <div class="right-button">
          <b-button class="mb-2" size="lg" style="color:#fff;" variant="secondary" @click="goBack()">목록으로</b-button>
        </div>
      </div>
    </b-colxx>
    <b-colxx xxs="12" class="box-margin30 data-regist">
      <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip tooltip-label-right">
        <b-card class="mb-4   padding-top30">
          <b-row>
            <b-colxx sm="6">
              <b-form-group label="직원 ID" class="has-float-label error-l-100 margin30" v-if="no>0">
                <div class="callerIdView"> {{uid}}</div>
              </b-form-group>
              <b-form-group label="직원 ID" class="has-float-label error-l-100 margin30 required" v-else>
                <span></span>
                <b-form-input type="text" id="consultantId" v-model="$v.uid.$model"
                              :state="!$v.uid.$error"/>
                <b-form-invalid-feedback v-if="!$v.uid.required">직원 ID를 입력하세요
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.uid.checkConsultantId">4~15자의 영문으로 시작되는( 영문+숫자 + _
                  )조합만 가능합니다
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.uid.doubleConsultantId">중복된 직원 ID 입니다
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group label="직원 이름" class="has-float-label error-l-100 margin30 required">
                <span></span>
                <b-form-input type="text" id="name" v-model="$v.name.$model"
                              :state="!$v.name.$error"/>
                <b-form-invalid-feedback v-if="!$v.name.required">직원 이름을 입력하세요</b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6" class="margin30">
              <b-form-group label="직원 패스워드" class="has-float-label error-l-100  required">
                <span></span>
                <b-form-input type="password" id="upass" v-model="$v.upass.$model"
                              :state="!$v.upass.$error"/>
                <b-form-invalid-feedback v-if="!$v.upass.required">직원 패스워드를 입력하세요</b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.upass.checkPass">8~15자의 영문자와 숫자 특수문자의 조합만 가능
                </b-form-invalid-feedback>
              </b-form-group>
              <div v-if="no>0" style="padding-left:5px;color:#FF0000;font-size:9pt;margin-top:-6px;"> 패스워드 변경시에만 입력하세요</div>
            </b-colxx>
            <b-colxx sm="6" class="margin30">
              <b-form-group label="직원 패스워드 확인" class="has-float-label error-l-100 required">
                <span></span>
                <b-form-input type="password" id="repass" v-model="$v.repass.$model"
                              :state="!$v.repass.$error"/>
                <b-form-invalid-feedback v-if="!$v.repass.required">직원 패스워드 확인을 입력하세요</b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.repass.equalPass">직원패스워드와 내용이 다릅니다
                </b-form-invalid-feedback>
              </b-form-group>
              <div v-if="no>0" style="padding-left:5px;color:#FF0000;font-size:9pt;margin-top:-6px;"> 패스워드 변경시에만 입력하세요</div>

            </b-colxx>
            <b-colxx sm="6">
              <b-form-group label="직원 수신번호" class="has-float-label error-l-100 margin30 required">
                <span></span>
                <b-form-input type="text" id="pcs" v-model="$v.pcs.$model"
                              :state="!$v.pcs.$error"/>
                <b-form-invalid-feedback v-if="!$v.pcs.required">직원 수신번호를 입력하세요</b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.pcs.numeric">직원 수신번호는 숫자만 입력가능합니다
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>

          </b-row>
          <b-row>
            <b-colxx sm="12">
              <div class="button-row">
                <b-button type="button" variant="light" size="lg" @click="goBack()" class="mt-4 cancle">취 소</b-button>
                <b-button type="submit" style="color:#fff;" variant="primary" size="lg" class="mt-4">{{title}}</b-button>
              </div>
            </b-colxx>
          </b-row>
        </b-card>
      </b-form>
    </b-colxx>
  </b-row>
</template>

<script>

  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";
  import {
    API_URL_MEMBER_MEMBER_CHECKID,
    API_URL_MEMBER_MEMBER_INFO,
    API_URL_MEMBER_MEMBER_UPDATE,
    API_URL_MEMBER_MEMBER_INSERT,
    CONFIG_HEADER_POST
  } from '../../api/urls';
  import {validationMixin} from "vuelidate";

  const {
    numeric,
    required,
  } = require("vuelidate/lib/validators");

  export default {
    components: {
      "v-select": vSelect,
    },
    data() {
      return {
        title: '직원 등록',
        no: 0,
        uid: '',
        name: '',
        pcs: '',
        upass: '',
        repass: '',
        insertFlag: false,
      };
    },
    mixins: [validationMixin],
    validations: {
      uid: {
        required,
        async checkConsultantId(id) {
          if (this.no > 0) return true;
          if (id.length < 4 || id.length > 15) return false;
          let checkSpc = /[~!@#$%^&\-\+=*()+|<>?:{}]/; // 특수문자
          let checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
          let checkEng = /^[a-zA-Z]/;

          if (checkKor.test(id)) {
            return false;
          } else if (checkSpc.test(id)) {
            return false;
          } else if (!checkEng.test(id)) {
            return false;
          }
          return true;
        },
        async doubleConsultantId(id) {
          if (this.no > 0) return true;
          if (this.$v.uid.required && this.$v.uid.checkConsultantId) {
            let params = {uid: id}
            let {data} = await this.$http.post(API_URL_MEMBER_MEMBER_CHECKID, params, {headers: CONFIG_HEADER_POST});
            console.log(data)
            return (data.result == 'succ') ? true : false;
          }
        }
      },
      name: {
        required
      },
      pcs: {
        numeric,
        required
      },
      upass: {
        async required(value) {
          if(this.no>0) {
            return true;
          } else {
            let result = (value)?true:false;
            return result;
          }
        },
        async checkPass(pass) {
          if(this.no>0 && !pass)return true;
          if (pass.length < 8 || pass.length > 15) return false;
          let pattern = /([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~,-])|([!,@,#,$,%,^,&,*,?,_,~,-].*[a-zA-Z0-9])/
          let result = (pattern.test(pass)) ? true : false;
          return result;
        }
      },
      repass: {
        async required(value) {
          if(this.no>0) {
            return true;
          } else {
            let result = (value)?true:false;
            return result;
          }
        },
        async equalPass(pass) {
          if(this.no>0 && !pass)return true;
          if(this.upass != pass) return false;
          else return true;


        }
      },

    },
    created() {
      if (this.$route.params.id != 'new') this.no = this.$route.params.id;

      if(this.no>0) {
        this.title = '직원 수정';

        this.$http.post(API_URL_MEMBER_MEMBER_INFO,{no:this.no},{headers: CONFIG_HEADER_POST}).then(res => {
          this.setInfo(res.data.result);
        });

      }
    },
    methods: {
      setInfo(info) {
        console.log(info);
        this.pcs = info.pcs;
        this.name = info.name;
        this.uid = info.uid;
      },
      goList() {
        this.$router.push('/member/list/api');
      },
      goBack() {
        this.$router.push('/member/list/keep');
      },
      goListUpdate() {
        this.$router.push('/member/list/update');
      },
      onValitadeFormSubmit() {
        if (this.insertFlag) return;
        this.$v.$touch();
        if (!this.$v.$anyError) {
          this.insertFlag = true;
          if (this.no > 0) {
            this.updateData();
          } else this.insertData();
        } else {

          for (let id in this.$v.$params) {
            if (!this.$v[id].required || this.$v[id].$error) {
              switch (id) {

                case 'upass':
                  if (this.no < 1) {
                    document.getElementById(id).focus();
                  }
                  break;
                case 'uid':
                  if (this.no < 1) {
                    document.getElementById(id).focus();
                  }
                  break;
                default:
                  document.getElementById(id).focus();
                  break;
              }
              return;
            }
          }
        }
      },
      insertData() {

        let params = this.setSendParams();
        params.uid = this.uid,
        params.upass = this.upass;
        this.$http.post(API_URL_MEMBER_MEMBER_INSERT, params, {headers: CONFIG_HEADER_POST}).then(res => {
            this.insertFlag = false;
            let params = {};
            console.log(res.data);
            switch (res.data.result) {
              case 'isUid':
                params = {
                  message: '중복된 직원ID가 존재합니다',
                  doAction: () => {
                    document.getElementById('uid').value = '';
                    document.getElementById('uid').focus();
                  }
                };
                break;
              case 'isPcs':
                params = {
                  message: '중복된 직원 수신번호가 존재합니다',
                  doAction: () => {
                    document.getElementById('pcs').value = '';
                    document.getElementById('pcs').focus();
                  }
                };
                break;
              case 'succ':
                params = {
                  message: '직원 정보를 등록하였습니다',
                  doAction: () => {
                    this.goList();
                  }
                };
                break;
              default:
                params = {
                  message: '잘못된 접근입니다',
                };
                break;
            }
            this.$eventBus.$emit('modalOpen', params);

        })
      },
      updateData() {
        let params = this.setSendParams();
        params.upass = (this.upass) ? this.upass : '';
        params.no = this.no;
        console.log(params);
        this.$http.post(API_URL_MEMBER_MEMBER_UPDATE, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.insertFlag = false;
            let params = {};
            switch (res.data.result) {
              case 'succ':
                params = {
                  message: '직원 정보를 수정하였습니다',
                  doAction: () => {
                    this.goListUpdate();
                  }
                };
                break;
              case 'isPcs':
                params = {
                  message: '중복된 직원 수신번호가 존재합니다',
                  doAction: () => {
                    document.getElementById('pcs').value = '';
                    document.getElementById('pcs').focus();
                  }
                };
                break;
              default:
                params = {
                  message: '잘못된 접근입니다',
                };
                break;
            }
            this.$eventBus.$emit('modalOpen', params);
       });

      },
      setSendParams() {

        let params = {
          name:this.name,
          pcs:this.pcs
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

</style>
