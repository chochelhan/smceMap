<template>
  <div>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent.stop="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})"
      >
        <i style="color:#000;font-size:16pt;" class="fas fa-list"></i>
      </a>
      <a
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>
      <!--div
        :class="{'search':true, 'mobile-view':isMobileSearch}"
        ref="searchContainer"
        @mouseenter="isSearchOver=true"
        @mouseleave="isSearchOver=false"
      >
      </div-->
      <div class="d-inline-block">
      </div>
      <div class="position-relative d-none d-none d-lg-inline-block">
      </div>
    </div>
    <router-link class="navbar-logo" tag="a" :to="'/'">
      <span class="logo d-none d-xs-block"></span>
      <span class="logo-mobile d-block d-xs-none"></span>
    </router-link>

    <div class="navbar-right">
      <div class="header-icons d-inline-block align-middle">
        <div class="position-relative d-none d-sm-inline-block">
        </div>

        <div class="position-relative d-inline-block">
          <div style="width:100%;position:relative;">
            <div class="notice-list">
              <div class="show-box"><i class="fas fa-bell" :style="{'color':noticeColor}" @click="showNoticeList()"></i>
              </div>
              <div class="list-table-layout">
                <b-button variant="secondary" style="width:100px;color:#fff;" type="button" class="md-button"
                          @click="noticeClear()">전체확인
                </b-button>
                <div class="list-table-box">
                  <table class="list-table" cellpadding=0 cellspacing=0>
                    <thead>
                    <tr>
                      <th style='width:80px;'>발신번호</th>
                      <th style='width:150px;'>위치명</th>
                      <th style='width:100px;'>등록일</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item,index in noticeList" @click="showPopup(index)">
                      <td>{{item.msgcode}}</td>
                      <td>{{item.name}}</td>
                      <td>{{item.rdate}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="position-relative d-none d-sm-inline-block">
          <div class="btn-group">
            <b-button variant="empty" class="header-icon btn-sm" @click="toggleFullScreen">
              <i style="color:#000;font-size:15pt;margin-top:7px;"
                 :class="{'d-inline-block':true,'fas fa-compress-arrows-alt':fullScreen,'fas fa-expand-arrows-alt':!fullScreen }"
              />

            </b-button>
          </div>
        </div>
      </div>
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <i class="fas fa-user-lock"></i>

          </template>
          <b-dropdown-item @click="changePass()">비밀번호 변경</b-dropdown-item>
          <b-dropdown-item @click="logout()">로그아웃</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
    <div class="screen-layout" v-if="screenShow">
      <div class="screen-content">
        <div class="modal-header" style="background:#B30B00;">
          <h5 style="margin:auto;font-size:17pt;width:150px;color:#fff;"> 비상벨 알림</h5>
        </div>
        <div class="data-contents">
          <div class="msg-title">
            {{msgName}} <span>({{msgTel}})</span>
          </div>
          <div class="msg-date">
            {{msgDate}} <span v-if="msgReceive">({{msgReceive}})</span>
          </div>

          <div class="msg-content" v-html="msgContent">
          </div>
          <div style="height:20px"></div>

          <b-form-group label="메세지" class="has-float-label margin30">
            <b-form-textarea rows="5" max-rows="7" v-model="callMessage" placeholder="현재 상황을 입력하세요"></b-form-textarea>

          </b-form-group>
          <div class="button-row" style="text-align:center;width:100%">
            <b-button variant="primary" size="lg" style="margin:auto;width:220px;color:#fff;" @click="regsitCall()"
                      type="button">확 인
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped="true">
  .fa-user-lock {
    cursor: pointer;
    margin: 0;
    font-size: 15pt;
    position: relative;
    top: 3px;
    color: #000;

  }
  .notice-list {
    position:absolute;
    .show-box {
      top:-14px;
      left:-40px;
      position:relative;
      i {
        font-size: 18pt;
        cursor: pointer;
      }
    }
    .list-table-layout {
      width: 500px;
      position:absolute;
      z-index: 1000;
      display: none;
      padding: 20px;
      border-radius: 10px;
      right:-50px;
      background: #fff;
      -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
      -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
      text-align: right;
      .md-button {
        margin: 0 0 4px 0;
        width: 130px;

      }
      .list-table-box {
        max-height: 600px;
        overflow-y: auto;
        .list-table {
          width: 100%;
          thead {
            th {
              height: 40px;
              font-size: 10pt;
              font-weight: bold;
              background: #fff;
              border-top: solid 1px #000;
              border-bottom: solid 1px #000;
              text-align: center;

            }
          }
          tbody {
            td {
              padding: 5px 0;
              border-bottom: solid 1px #ccc;
              text-align: center;
              cursor: pointer;
              button {
                min-width: 50px;
                margin: 0;
                height: 30px;

              }
              img {
                max-width: 200px;
              }
              p {
                line-height: 100%;

              }
              div {
                line-height: 100%;
              }
            }
          }
        }
      }
    }
  }
  .screen-layout {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1029;
    background: rgba(255, 255, 255, 0.1);
    width: calc(100vw);
    max-width: 100%;
    overflow: hidden;
    height: calc(100vh);
    .screen-content {
      width: 500px;
      max-height: 470px;
      -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
      -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
      box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
      border-radius: 10px;
      height: auto;
      background: #fff;
      margin:0 0 0 -250px;
      padding: 0;
      position: absolute;
      left:50%;
      top:70px;
      .data-contents {
        padding:20px;
        .msg-title {
          padding-top: 0;
          font-weight: bold;
          font-size: 16pt;
          color: #000;
          span {
            color: #333;
            font-size: 12pt;
            font-weight: normal;
            padding-left: 15px;
          }
          .volume {
            font-size: 17pt;
            color: #999;
            cursor: pointer;
            padding: 2px 0 0 25px;
          }
        }

        .msg-date {
          padding:15px 0;
          color: #666;
          font-size: 11pt;
          font-weight: normal;

        }

        .msg-content {
          line-height: 140%;
          p {
            line-height: 140%;
          }
          max-width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          word-break: break-all;
          height:50px;
        }
      }
    }

  }
</style>
<script>
  import Switches from "vue-switches";
  import notifications from "../../data/notifications";
  import * as $ from 'jquery';
  import {mapActions, mapGetters, mapMutations} from "vuex";
  import {MenuIcon, MobileMenuIcon} from "../../components/Svg";
  import {adminRoot, buyUrl, localeOptions, menuHiddenBreakpoint, searchPath} from "../../constants/config";
  import {getDirection, getThemeColor, setDirection, setThemeColor} from "../../utils";
  import {
    CONFIG_HEADER_POST,
    CONFIG_HEADER_DEFAULT,
    API_URL_NOTICE_GET,
    API_URL_ALERTMAP_REGISTCALL,
    API_URL_ALERTMAP_REGISTALLCALL,
    CONFIG_HEADER_FORM
  } from '../../api/urls';
  export default {
    components: {
      "menu-icon": MenuIcon,
      "mobile-menu-icon": MobileMenuIcon,
      switches: Switches
    },
    data() {
      return {
        searchKeyword: "",
        isMobileSearch: false,
        isSearchOver: false,
        fullScreen: false,
        menuHiddenBreakpoint,
        searchPath,
        adminRoot,
        localeOptions,
        buyUrl,
        notifications,
        isDarkActive: false,
        noticeList: [],
        noticeDelete: false,
        noticeIndex: '',
        noticeColor: '#ccc',
        envView: false,
        msgName:'',
        msgTel:'',
        msgDate :'',
        msgContent:'',
        msgReceive:'',
        callIdxNo:'',
        callMessage:'',
        screenShow:false,
      };
    },
    created() {
      this.$eventBus.$on('addNoticeList', this.addNoticeInfo);
      this.$eventBus.$on('noticeDelete',this.childNoticeDelete);
      this.adminRoot = '/';
      if (localStorage['srsAuth'] == 1) {
        this.envView = true;
      }
      const color = getThemeColor();
      this.isDarkActive = color.indexOf("dark") > -1;
      var params = {};
      this.$http.post(API_URL_NOTICE_GET, params, {headers: CONFIG_HEADER_POST}).then(res => {
        console.log(res.data)
        this.noticeList = [];
        for (let item of res.data.noticeList) {
          item.contents = item.dataContents;
          item.rdate = item.rdate.replace('T', ' ').replace('.000+0000', '');
          this.noticeList.push(item);
          if (this.noticeList.length > 0) {
            this.noticeColor = '#E50B0B';
          }
        }
      });

    },

    methods: {
      ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
      ...mapActions(["setLang", "signOut"]),
      search() {
        this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`);
        this.searchKeyword = "";
      },
      addNoticeInfo(item) {
        this.noticeList.unshift(item);
        this.noticeColor = '#E50B0B';
      },
      childNoticeDelete(obj) {
        if (obj.noticeDelete && obj.noticeIndex) {
          this.noticeList.splice(obj.noticeIndex, 1);
          this.noticeIndex = '';
          this.noticeDelete = false;
        } else {
          this.noticeList.splice(0, 1);
        }
        if (this.noticeList.length > 0) {
          this.noticeColor = '#E50B0B';
        } else {
          this.noticeColor = '#CCC';
        }

      },
      regsitCall() {
        if(!this.callMessage) {
          let alertParams = {};
          alertParams.type = 'confirm';
          alertParams.message = '메세지 입력없이 확인 처리하시겠습니까?';
          alertParams.doAction = () => {
            this.doRegistCall()
          }
          this.$eventBus.$emit('modalOpen', alertParams);
        } else {
          this.doRegistCall()
        }
      },
      doRegistCall() {
        this.screenShow = false;
        var obj = this;
        var params = {content: this.callMessage, no: this.callIdxNo}
        this.$http.post(API_URL_ALERTMAP_REGISTCALL, params, {headers: CONFIG_HEADER_POST}).then(res => {
          if (obj.noticeDelete && obj.noticeIndex) {
            obj.noticeList.splice(obj.noticeIndex, 1);
            obj.noticeIndex = '';
            obj.noticeDelete = false;
          } else {
            obj.noticeList.splice(0, 1);
          }
          if (obj.noticeList.length > 0) {
            obj.noticeColor = '#E50B0B';
          } else {
            obj.noticeColor = '#CCC';
          }
          obj.callMessage = '';
          this.$eventBus.$emit('noticeAlertDelete');

        });
      },
      showNoticeList() {
        $('.notice-list .list-table-layout').slideToggle();
      },
      showPopup(index, volume) {

        this.noticeDelete = true;
        this.noticeIndex = index;
        var info = this.noticeList[index];
        this.msgName = info.name;
        this.msgTel = info.msgcode;
        this.msgDate = info.rdate;
        this.msgContent = info.contents;
        this.msgReceive = info.receiver;
        this.callIdxNo = info.no;
        this.callMessage = '';
        this.screenShow = true;

      },
      noticeClear() {
        if(this.noticeList.length<1) {
          let message = {
            type:'alert',
            message:'데이타가 존재하지 않습니다'
          }
          this.$eventBus.$emit('modalOpen', message);
          return;
        }
        var obj = this;

        var alertParams = {};
        alertParams.type = 'confirm';
        alertParams.message = '전체 확인 처리 하시겠습니까?';
        alertParams.doAction = function () {
          var nos = [];
          for (var key in obj.noticeList) {
            nos.push({no: obj.noticeList[key].no});
          }

          var params = {nos: nos};
          this.$http.post(API_URL_ALERTMAP_REGISTALLCALL, JSON.stringify(params), {headers: CONFIG_HEADER_POST}).then(res => {
           // console.log(res.data)
            obj.noticeColor = '#CCC';
            obj.noticeList = [];
            obj.showNoticeList();
            this.$eventBus.$emit('noticeAlertDelete');

          });
        }
        this.$eventBus.$emit('modalOpen', alertParams);
      },
      getFormatDate(regDate) {

        var rdate = regDate.replace('.0', '');
        var checkRdate = Date.parse(rdate);
        var date = new Date(checkRdate);
        date.setHours(date.getHours() - 9);

        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        var hour = date.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        var min = date.getMinutes();
        min = min >= 10 ? min : '0' + min;
        var sec = date.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;


        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      },
      searchClick() {
        if (window.innerWidth < this.menuHiddenBreakpoint) {
          if (!this.isMobileSearch) {
            this.isMobileSearch = true;
          } else {
            this.search();
            this.isMobileSearch = false;
          }
        } else {
          this.search();
        }
      },
      handleDocumentforMobileSearch() {
        if (!this.isSearchOver) {
          this.isMobileSearch = false;
          this.searchKeyword = "";
        }
      },

      changeLocale(locale, direction) {
        const currentDirection = getDirection().direction;
        if (direction !== currentDirection) {
          setDirection(direction);
        }

        this.setLang(locale);
      },
      changePass() {
        this.$router.push("/admin/changePass");
      },
      setEnv() {
        this.$router.push("/admin/setenv");
      },
      logout() {
        localStorage['windowReloadTime'] = '';

        this.signOut().then(() => {
          CONFIG_HEADER_POST.memberkey = '';
          CONFIG_HEADER_DEFAULT.memberkey = '';
          CONFIG_HEADER_FORM.memberkey = '';
          this.$router.push("/user/login");
        });
      },

      toggleFullScreen() {
        const isInFullScreen = this.isInFullScreen();

        var docElm = document.documentElement;
        if (!isInFullScreen) {
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
        this.fullScreen = !isInFullScreen;
      },
      isInFullScreen() {
        return (
          (document.fullscreenElement && document.fullscreenElement !== null) ||
          (document.webkitFullscreenElement &&
            document.webkitFullscreenElement !== null) ||
          (document.mozFullScreenElement &&
            document.mozFullScreenElement !== null) ||
          (document.msFullscreenElement && document.msFullscreenElement !== null)
        );
      }
    },
    computed: {
      ...mapGetters({
        currentUser: "currentUser",
        menuType: "getMenuType",
        menuClickCount: "getMenuClickCount",
        selectedMenuHasSubItems: "getSelectedMenuHasSubItems"
      })
    },
    beforeDestroy() {
      document.removeEventListener("click", this.handleDocumentforMobileSearch);
    },
    watch: {
      "$i18n.locale"(to, from) {
        if (from !== to) {
          this.$router.go(this.$route.path);
        }
      },
      isDarkActive(val) {
        let color = getThemeColor();
        let isChange = false;
        if (val && color.indexOf("light") > -1) {
          isChange = true;
          color = color.replace("light", "dark");
        } else if (!val && color.indexOf("dark") > -1) {
          isChange = true;
          color = color.replace("dark", "light");
        }
        if (isChange) {
          setThemeColor(color);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
      isMobileSearch(val) {
        if (val) {
          document.addEventListener("click", this.handleDocumentforMobileSearch);
        } else {
          document.removeEventListener(
            "click",
            this.handleDocumentforMobileSearch
          );
        }
      },
    },
    mounted() {
      window.addEventListener('beforeunload', (event) => {
        let time = new Date();
        localStorage['windowReloadTime'] = time.getTime();
        event.preventDefault();
        // 표준에 따라 기본 동작 방지
        // Chrome에서는 returnValue 설정이 필요함
        event.returnValue = true;


      });

    }
  };
</script>
