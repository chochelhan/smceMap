<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body style="width:700px;margin-left:350px">
        <div class="form-side" style="width:100%;">
          <span class="logo-single"/>
          <h6 class="mb-4">{{ $t('user.login-title')}}</h6>

          <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
            <b-form-group :label="'아이디'" class="has-float-label mb-4">
              <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error"/>
              <b-form-invalid-feedback v-if="!$v.form.email.required">아이디를 입력하세요</b-form-invalid-feedback>

            </b-form-group>

            <b-form-group :label="'비밀번호'" class="has-float-label mb-4">
              <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error"/>
              <b-form-invalid-feedback v-if="!$v.form.password.required">비밀번호를 입력하세요</b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <!--router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link-->
              <div></div>
              <b-button type="submit" style="color:#fff" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError===false,
                    'show-fail': !processing && loginError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>
                <span class="label">{{ $t('user.login-button') }}</span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {validationMixin} from "vuelidate";

  const {
    required,
    //maxLength,
    //minLength,
    //email
  } = require("vuelidate/lib/validators");

  import {
    CONFIG_HEADER_POST,
    CONFIG_HEADER_DEFAULT,
    CONFIG_HEADER_FORM
  } from '../../api/urls';
  export default {
    data() {
      return {
        form: {
          email: "",
          password: ""
        },
      };
    },
    mixins: [validationMixin],
    validations: {
      form: {
        password: {
          required
          //maxLength: maxLength(16),
          //minLength: minLength(4)
        },
        email: {
          required,
          //email,
          //minLength: minLength(4)
        }
      }
    },
    computed: {
      ...mapGetters(["currentUser", "processing", "loginError"])
    },
    methods: {
      ...mapActions(["login"]),
      formSubmit() {
        this.$v.$touch();
        this.$v.form.$touch();
        if (!this.$v.form.$anyError) {
          event.preventDefault();
          this.login({
            userId: this.form.email,
            password: this.form.password
          });
        }
      }
    },
    watch: {
      currentUser(val) {
        if (val && val.name && val.name.length > 0) {
          setTimeout(() => {
            CONFIG_HEADER_POST.memberkey = localStorage['memberkey'];
            CONFIG_HEADER_DEFAULT.memberkey = localStorage['memberkey'];
            CONFIG_HEADER_FORM.memberkey = localStorage['memberkey'];
            this.$router.push('/');
          }, 200);
        }
      },
      loginError(val) {
        if (val != null) {
          this.$notify("error", "알림", val, {
            duration: 3000,
            permanent: false
          });

        }
      }
    }
  };
</script>
