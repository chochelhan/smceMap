import axios from 'axios'
import {currentUser, isAuthActive} from '../../constants/config'
import {getCurrentUser} from '../../utils'
import {API_URL_AUTH, API_URL_LOGOUT, CONFIG_HEADER} from '../../api/urls';

const qs = require('querystring');

export default {
  state: {
    item: {},
    currentUser: isAuthActive ? currentUser : getCurrentUser(),
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    
    setUserInfo(state, item) {
      state.item = item
    },
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess = true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    setUser({commit}, payload) {
      commit('setUser', {name: payload})
    },
    login({commit}, payload) {
      let data = {
        uid: payload.userId,
        upass: payload.password
      };
      axios.post(API_URL_AUTH, data, {headers: CONFIG_HEADER}).then(res => {
        console.log(res)
        if (res.data.memberkey) {
          commit('setUserInfo', res.data.memberInfo);
          let token = res.data.memberkey;
          let authName = res.data.memberInfo.name;
          let authId = res.data.memberInfo.uid;
          localStorage['uid'] = authId;
          localStorage['memberkey'] = token;
          localStorage['authName'] = authName;
          localStorage['authId'] = authId;
          localStorage['mapkey'] = res.data.mapkey;
          localStorage['isadmin'] = res.data.memberInfo.isadmin;
          localStorage['pcs'] = res.data.memberInfo.pcs;
         // axios.defaults.headers.common['memberkey'] = token;
          commit('setUser', {name: authName})
          
        } else {
          commit('setError', '잘못된 아이디 또는 비밀번호 입니다');
          setTimeout(() => {
            commit('clearError')
          }, 3000)
        }
      }).catch(function () {
        console.log("Promise Rejected");
      });
      
    },
    forgotPassword({commit}, payload) {
      commit('clearError');
      commit('setProcessing', true)
      
      
    },
    resetPassword({commit}, payload) {
      commit('clearError');
      commit('setProcessing', true)
      
    },
    
    signOut({commit}) {
      localStorage.removeItem('uid');
      localStorage.removeItem('memberkey');
      localStorage.removeItem('authName');
      localStorage.removeItem('authId');
      localStorage.removeItem('userName');
      localStorage.removeItem('windowReloadTime');
      localStorage.removeItem('mapkey');
      
    }
  }
}
