import Vue from "vue";
import VueRouter from "vue-router";
import {adminRoot} from "./constants/config";
import Auth from './api/auth'
import userStore from './store/modules/user'

// import PerfectScrollbar from 'vue2-perfect-scrollbar'
// import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
//
//
// Vue.use(PerfectScrollbar);
Vue.use(VueRouter);

const SYSTEM_ADMIN = 'SYSTEM_ADMIN';
const REPRESENTATIVE_USER = 'REPRESENTATIVE_USER';
const NORMAL_USER = 'USER';


const requireAuth = (grants) => (to, from, next) => {
  
  if (localStorage['windowReloadTime'] != null) {
    let nowTime = new Date();
    let timeTerm = nowTime.getTime() - localStorage['windowReloadTime'];
    timeTerm = (timeTerm / 1000);
    if (timeTerm > 10) {
      localStorage.removeItem('uid');
      localStorage.removeItem('memberkey');
      localStorage.removeItem('authName');
      localStorage.removeItem('authId');
      localStorage.removeItem('userName');
      localStorage.removeItem('mapkey');
    }
    localStorage.removeItem('windowReloadTime');
  
  }
  if (!localStorage['memberkey'] || localStorage['memberkey'] == null || localStorage['memberkey'] == '') {
    next('/user/login')
  } else if (localStorage['memberkey'] && localStorage['memberkey'] != null) {
    next()
    /*
    Auth.validateToken(localStorage.authToken)
      .then(function (res) {
        if (res.data.code !== 2000) {
          next('/user/login')
        } else {

          let session = res.data.contents.tokenInfo;
          localStorage['userName'] = session.userName;
          localStorage['authName'] = session.authName;

          if (!grants || grants.includes(session.authName)) {
            userStore.mutations.setUser(userStore.state, session.userName);
            next()
          }
        }
      }).catch(function () {
      console.log("Promise Rejected");
    });
    */
  }
};


const loginPageCheck = () => (to, from, next) => {
  /*
  if (localStorage.memberkey !== 'null') {
    if (localStorage.authName === 'SYSTEM_ADMIN') {
      next('/user')
    } else if (localStorage.authName === 'REPRESENTATIVE_USER') {
      next('/dashboard')
    }
    else if (localStorage.authName === 'USER') {
      next('/journal')
    }
  } else {
    next()
  }
  */
};
//test
const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: `${adminRoot}/mornitering`,
    beforeEnter: requireAuth([SYSTEM_ADMIN]),
    children: [
      {
        path: "admin",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/admin/index"),
        redirect: `${adminRoot}/admin/changePass`,
        children: [
          {
            path: "changePass",
            component: () =>
              import("./views/admin/passChange")
            
          },
        ]
      },
      {
        path: "mornitering",
        component: () =>
          import("./views/mornitering/index"),
        redirect: `${adminRoot}/mornitering/mornitering`,
        children: [
          {
            path: "mornitering",
            name: "mornitering",
            component: () =>
              import("./views/mornitering/default"),
            
          },
        ]
      },
      {
        path: "member",
        component: () =>
          import("./views/member/index"),
        redirect: `${adminRoot}/member/list/api`,
        children: [
          {
            path: "list/:mode",
            name: "userList",
            component: () =>
              import("./views/member/userList"),
          },
          {
            path: "regist/:id",
            name: "userRegist",
            component: () =>
              import("./views/member/userRegist"),
          },
  
        ]
      },
      {
        path: "setting",
        component: () =>
          import("./views/setting/index"),
        redirect: `${adminRoot}/setting/building`,
        children: [
          {
            path: "building",
            component: () =>
              import("./views/setting/building")
            
          },
          {
            path: "sendnumber",
            component: () =>
              import("./views/setting/sendnumber/index"),
            redirect: `${adminRoot}/setting/sendnumber/list/api`,
            children: [
              {
                path: "list/:mode",
                name: "sendnumberList",
                component: () =>
                  import("./views/setting/sendnumber/sendnumberList"),
              },
              {
                path: "regist/:id",
                name: "sendnumberRegist",
                component: () =>
                  import("./views/setting/sendnumber/sendnumberRegist"),
              },
            
            ]
          },
          {
            path: "bellset",
            component: () =>
              import("./views/setting/bellset")
            
          },
          {
            path: "mapset",
            component: () =>
              import("./views/setting/map/regist")
    
          },
        ]
      },
      {
        path: "alarmbellList",
        component: () =>
          import("./views/alarmbell/index"),
        redirect: `${adminRoot}/alarmbellList/list`,
        children: [
          {
            path: "list",
            name: "alarmbellList",
            component: () =>
              import("./views/alarmbell/list"),
      
          },
        ]
      },
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        name: 'login',
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },
    
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
