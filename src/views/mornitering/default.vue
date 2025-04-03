<template>
  <div>
    <b-row>
      <audio id='sound' loop style="display:none">
        <source src="/assets/media/sound.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <b-colxx xxs="12" style="margin-top:-20px;height:120px;">
        <div style="position:relative;margin-bottom:28px;height:50px;">
          <h1>미확인 비상벨</h1>
          <!--button @click="testCall()">테스트</button-->
          <div style="width:330px;margin:-55px auto 0 auto;padding-right:110px;" v-if="inMapView && kakaoMapView">
            <b-button-group>
              <b-button class="map-choice-button" id="in" @click="choiceMap('in')">내부맵 보기</b-button>
              <b-button class="map-choice-button active" id="out" @click="choiceMap('out')">외부맵 보기</b-button>
            </b-button-group>
          </div>
        </div>
        <div>
          <div id="categoryVirt" style="display:none;" v-if="inMapView">
            <b-dropdown
              id="cate1"
              :text="cate1Text"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="lg"
            >
              <b-dropdown-item
                v-for="(item,index) in cateList1"
                :key="index"
                @click="getCate(item,'f')">{{ item.label }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              id="cate2"
              :text="cate2Text"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="lg"
            >
              <b-dropdown-item
                v-for="(item,index) in cateList2"
                :key="index"
                @click="getCate(item,'s')">{{ item.label }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              id="cate3"
              :text="cate3Text"
              variant="outline-dark"
              class="mr-1 float-md-left btn-group"
              size="lg"
            >
              <b-dropdown-item
                v-for="(item,index) in cateList3"
                :key="index"
                @click="getCate(item,'t')">{{ item.label }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </b-colxx>
    </b-row>
    <b-row v-if="inMapView" id="mapZoomVirt">
      <b-colxx xxs="12">
        <div class='editbutton-box' v-if="zoomCnt>1">
          <ul class='edit-button-box'>
            <li class="zoom-button">
              <button class="md-raised md-button" @click="zoom('up')"><i class="fa fa-search-plus"></i></button>
            </li>
            <li class="zoom-level-box">
              <v-card color="rgba(0,0,0,0.1)">
                <v-card-text>
                  <v-slider
                    v-model="updZoomCnt"
                    step="1"
                    :max="zoomCnt"
                    min="1"
                    background-color="#84B4FF"
                    vertical
                    readonly
                    color="#1867C0"
                    ticks>
                  </v-slider>
                </v-card-text>
              </v-card>

            </li>
            <li class="zoom-button" style='border-radius:0 0 15px 15px;'>
              <button class="md-raised  md-button" style='border-radius:0 0 15px 15px;' @click="zoom('dn')"><i
                class="fa fa-search-minus"></i></button>
            </li>

          </ul>
        </div>
      </b-colxx>
    </b-row>
    <b-row>

      <b-colxx xxs="12"  style="margin-top:0;padding-top:0;">
        <div id='mapImageLayoutVirt' style='border:solid 1px #ccc;padding:0;margin:0;' v-if="inMapView">
          <div id='mapImageLayout' style='position:relative;'>
            <div id='rect-container'>
              <div v-for="rect,idx in rectList" class="rect-box" :index="idx" :style="rect.gstyle">
                <div :class="'mark-box '+rect.call">
                  <div class="mark-info-box" :style="{'display':rect.infoView}">
                    <div class="name-text" v-html="rect.name"></div>
                    <div class="call-regist-button">
                      <b-button size="sm" class="md-raised md-accent md-button"
                                style='width:100%;font-size:9pt;margin:0;min-height:30px;height:30px;line-height:10px;color:#fff;'
                                @click="showCallPopup()" type="button">확 인
                      </b-button>
                    </div>
                    <div class="pop"></div>
                  </div>
                  <img src="/assets/img/siren.png" style='width:25px;'/>
                  <i class="fas fa-map-marker-alt" @click="setInfoData(idx)"></i>
                </div>
              </div>
            </div>
            <canvas id="diagonal" style="position:absolute;top:0;left:0;"></canvas>
            <img id="orgImg" style='display:none;'/>
            <div id='closeMark'></div>
          </div>
        </div>
        <div class="kakao-map-layout" id="kakaomapVirt" style='width:100%;margin-top:20px;' v-if="kakaoMapView">
          <div id="kakao-map-box" style="width:100%;border:solid 1px #999;">
            <vue-daum-map
              :appKey="appKey"
              :center.sync="center"
              :level.sync="kakaoMapLevel"
              :mapTypeId="mapTypeId"
              :libraries="libraries"
              @load="onLoad"
              @center_changed=""
              @zoom_start=""
              @zoom_changed=""
              @bounds_changed=""
              @click=""
              @dblclick=""
              @rightclick=""
              @mousemove=""
              @dragstart=""
              @drag=""
              @dragend=""
              @idle=""
              @tilesloaded=""
              @maptypeid_changed=""
              :style="{'width':kakaoMapWidth,'height':kakaoMapHeight}"/>
          </div>
        </div>

      </b-colxx>
    </b-row>

    <div class="screen-layout" v-if="screenShow">
      <div class="screen-content">
        <div class="modal-header" style="background:#B30B00;">
          <h5 style="margin:auto;font-size:17pt;width:150px;color:#fff;"> 비상벨 알림</h5>
        </div>
        <div class="data-contents">
          <div class="msg-title">
            {{msgName}} <span>({{msgTel}})</span> <span class="volume"><i class="fas fa-volume-up" v-if="msgVolume"
                                                                          @click="audioStop()"></i><i v-else
                                                                                                      class="fas fa-volume-mute"></i></span>
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

<style lang="scss" scoped>

  .map-choice-button {
    color: #000;
    border: solid 1px #000;
    background: #fff;
  }

  .map-choice-button.active {
    color: #fff;
  }

  .screen-layout {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1030;
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
      margin: 0;
      padding: 0;
      position: absolute;
      right: 10px;
      top: 10px;
      .data-contents {
        padding: 20px;
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
          padding: 15px 0;
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
          height: 50px;
        }
      }
    }

  }
</style>
<script>
  import VueDaumMap from 'vue-daum-map'
  import {
    API_URL_MAP_GET,
    API_URL_MAP_GETIMG,
    API_URL_ALERTMAP_REGISTCALL,
    API_URL_ALERTMAP_REGISTALLCALL,
    CONFIG_HEADER_POST
  } from '../../api/urls';
  import * as $ from 'jquery';
  import {mapMutations, mapGetters} from "vuex";

  export default {
    name: 'mapMain',
    components: {
      VueDaumMap
    },
    watch: {

      updZoomCnt(ncnt) {
        if (isNaN(this.mapImgfirstWidth) || !this.mapImgfirstWidth || isNaN($("#diagonal").attr('width')) || !$("#diagonal").attr('width')) return;

        var widthResult = this.mapOrgImgWidth - this.mapImgfirstWidth;
        var divide = parseInt(widthResult / (this.zoomCnt - 1));
        var divideY = parseInt((this.mapOrgImgHeight - this.mapImgfirstHeight) / (this.zoomCnt - 1));


        var nt = $("#mapImageLayout").scrollTop();
        var nl = $("#mapImageLayout").scrollLeft();

        var fw = $("#diagonal").attr('width');

        if (ncnt == 1) {

          this.divideX = 0;
          this.divideY = 0;

          $('.zoom-move-button').addClass('disable');
          $('.zoom-move-button .md-button').removeClass('md-accent');
          $('#diagonal').removeClass('zoom-move');
          $('#diagonal').off('mousedown')
          $('.area-button').removeClass('disable');


          this.zMoveFlag = false;

          $("#diagonal").css({
            'max-width': this.mapImgfirstWidth + 'px',
            'width': this.mapImgfirstWidth + 'px',
            height: this.mapImgfirstHeight + 'px'
          });
          $("#diagonal").attr('width', this.mapImgfirstWidth);
          $("#diagonal").attr('height', this.mapImgfirstHeight);


        } else if (ncnt == this.zoomCnt) {
          if ($('.zoom-move-button').hasClass('disable')) {
            $('.zoom-move-button').removeClass('disable');
          }

          $("#diagonal").css({
            'max-width': this.mapOrgImgWidth + 'px',
            'width': this.mapOrgImgWidth + 'px',
            height: this.mapOrgImgHeight + 'px'
          });
          $("#diagonal").attr('width', this.mapOrgImgWidth);
          $("#diagonal").attr('height', this.mapOrgImgHeight);


          var updt = parseFloat(this.mapImgfirstHeight) / 2;
          var updl = parseFloat(this.mapImgfirstWidth) / 2;
          $("#mapImageLayout").scrollTop(updt);
          $("#mapImageLayout").scrollLeft(updl);

          var updt = parseFloat(nt) + (divideY / 2);
          var updl = parseFloat(nl) + (divide / 2);

          $("#mapImageLayout").scrollTop(parseInt(updt));
          $("#mapImageLayout").scrollLeft(parseInt(updl));

          this.divideX = updl;
          this.divideY = updt;

        } else {

          if ($('.zoom-move-button').hasClass('disable')) {
            $('.zoom-move-button').removeClass('disable');
          }

          var width = this.mapImgfirstWidth + (divide * (ncnt - 1));
          var height = (width / this.mapImgfirstWidth) * this.mapImgfirstHeight;

          $("#diagonal").css({'max-width': width + 'px', 'width': width + 'px', height: height + 'px'});
          $("#diagonal").attr('width', width);
          $("#diagonal").attr('height', height);

          if (parseFloat(fw) < width) {
            var updt = parseFloat(nt) + (divideY / 2);
            var updl = parseFloat(nl) + (divide / 2);
          } else {
            var updt = parseFloat(nt) - (divideY / 2);
            var updl = parseFloat(nl) - (divide / 2);

          }
          $("#mapImageLayout").scrollTop(parseInt(updt));
          $("#mapImageLayout").scrollLeft(parseInt(updl));


          this.divideX = updl;
          this.divideY = updt;

        }


        this.zoomRate = parseFloat($("#diagonal").attr('width')) / this.mapImgfirstWidth;
        this.setAreaShape();
      },
      zMoveFlag(zflag) {
        if (zflag) {
          $('.area-button .md-button').removeClass('md-accent');
          $('.zoom-move-button .md-button').addClass('md-accent');
          $('#diagonal').addClass('zoom-move');


        } else {
          $('.zoom-move-button .md-button').removeClass('md-accent');
          $('#diagonal').removeClass('zoom-move');

        }
      },

    },
    data() {

      return {
        selectedMapPosition: '',
        sideMenuView: true,
        selectedHolidayBackdrop: 'true',
        orgX: 0,
        orgY: 0,
        rectList: [],
        markList: [],
        canvasWidth:1658,
        markTextMove: false,
        mapImage: false,
        saveImgFlag: false,
        markTextMoveTemp: false,
        zoomLevels: [],
        zoomCnt: 1,
        zoomLevel: 1,
        zoomLevelUpd: false,
        tempZoomLevel: 1,
        updZoomCnt: 1,
        mapOrgImgWidth: 0,
        mapOrgImgHeight: 0,
        mapImgfirstWidth: '',
        mapImgfirstHeight: '',
        zMoveFlag: false,
        divideX: 0,
        divideY: 0,
        zoomRate: 1,
        /* 새로 추가된 */
        msgdataAllList: {},
        cateList: [],
        cate1: '',
        cate2: '',
        cate3: '',
        cate1Text: '',
        cate2Text: '',
        cate3Text: '',
        cateList1: [],
        cateList2: [],
        cateList3: [],
        maxLevel: '1',
        tempMakerIndex: '',
        choiceRectIndex: '',
        tempNoticeZoom: 1,
        tempMakerNo: '',
        category: '',
        markerMode: '',
        areaInfos: {},
        areaDatas: {},
        updateMakerIndex: '',
        mapCall: false,
        callCategory: '',
        callNo: '',
        callMoveCenterFlag: false,
        msgName: '',
        msgTel: '',
        msgReceive: '',
        msgDate: '',
        msgContent: '',
        callMessage: '',
        alertSet: {},
        screenLayoutShow: false,
        callIdxNo: '',
        noticeList: [],
        noticeDelete: false,
        noticeIndex: '',
        noticeColor: '#ccc',
        mapCreate: false,
        audio: null,
        msgVolume: false,
        updZoomUpdateFlag: false,
        mapLayooutDrawing: false,
        screenShow: false,
// kakao map ///
        appKey: '', // 테스트용 appkey
        center: {lat: 37.440205, lng: 127.177659}, // 지도의 중심 좌표
        kakaoMapLevel: 3, // 지도의 레벨(확대, 축소 정도),
        kakaoInitLevel: 3,
        mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
        libraries: [], // 추가로 불러올 라이브러리
        map: null, // 지도 객체. 지도가 로드되면 할당됨.
        positions: [],
        kakaoMapHeight: '700px',
        kakaoMapWidth: 'auto',
        kakaoMapView: false,
        kakaoMapMarkers: [],
        msgdataCategoryList: {},
        kakaoMapInfowindows: [],
        inMapView: true,
        bellInfoClass: '',
        kakao: null,
        kakaoMapCreateFlag: false,
        onlyMapcenter: {lat: 37.440205, lng: 127.177659}, // 지도의 중심 좌표
        onlyMapLevel: 3,
        onlyMap: null,
        onlyMapkakao: null,
        kakaoMapOnlyMarkers: [],
        kakaoMapOnlyInfowindows: [],
        /* 새로 추가된 끝 */

      }
    },
    created() {

      this.$eventBus.$on('showCallMessage', this.call);
      this.$eventBus.$on('noticeAlertDelete', this.noticeAlertDelete);

//if(this.appKey) {
//	this.kakaoMapView = true;
//}
      this.getMapData();

    },
    methods: {
      choiceMap(cmd) {
        if (cmd == 'in') {
          $('#in').addClass('active');
          $('#out').removeClass('active');
          $('#kakaomapVirt').hide();
          $('#mapImageLayoutVirt').show();
          $('#mapZoomVirt').show();
          $('#categoryVirt').show();


        } else {
          $('#out').addClass('active');
          $('#in').removeClass('active');
          $('#kakaomapVirt').show();
          $('#mapImageLayoutVirt').hide();
          $('#mapZoomVirt').hide();
          $('#categoryVirt').hide();

        }
      },
      onLoad(map) {

        this.map = map;
        var mapTypeControl = new kakao.maps.MapTypeControl();
        var zoomControl = new kakao.maps.ZoomControl();
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        this.kakao = kakao;
        this.onlyMap = map;
        this.onlyMapkakao = kakao;


      },
      onlyMapOnLoad(map) {

        this.onlyMap = map;
        var mapTypeControl = new kakao.maps.MapTypeControl();
        var zoomControl = new kakao.maps.ZoomControl();
        this.onlyMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);
        this.onlyMap.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);
        this.onlyMapkakao = kakao;

        this.kakaoMapSizeInit();

      },
      showCallPopup() {

        this.showPopup(0, true);
      },
      /*  새로 추가된 곳 시작 */
      call(params, accept) {

        this.msgReceive = params.receiver;
        this.callIdxNo = params.no;
        var time = params.time.replace('T', ' ').replace('.000+0000', '');
        var info = this.msgdataAllList[params.msgno];

        var categoryInfos = info.category.split(',');
        if (categoryInfos[2] == "null" || categoryInfos[2] == "" || categoryInfos[2] == null) {
          var category = categoryInfos[0] + '_' + categoryInfos[1];
        } else var category = categoryInfos[0] + '_' + categoryInfos[1] + '_' + categoryInfos[2];
        var msgno = params.msgno;

        if (this.alertSet.sound == 'yes') {
          this.audioStart();
          this.msgVolume = true;
        } else this.msgVolume = false;

        this.callMessage = '';
        if (this.alertSet.popup == 'yes') {
// console.log(info);
          this.msgName = info.name;
          this.msgTel = info.tel;
          this.msgDate = time;
          this.msgContent = info.contents;
          this.screenShow = true;

        }
        if (accept != 'sess') {
          var item = {
            name: info.name,
            msgcode: info.tel,
            rdate: time,
            contents: info.contents,
            no: this.callIdxNo,
            receiver: this.msgReceive,
            msgno: msgno
          }
          this.$eventBus.$emit('addNoticeList',item);
          this.noticeList.unshift(item);
        }

        if (this.mapLayooutDrawing && this.kakaoMapView) {
          var kakaoMapOnlyViewFlag = false;
          if (this.areaInfos[category] && this.areaDatas[category]) {
            if (this.areaDatas[category][msgno]) {
              this.kakaoMapOnlyViewClose()
              this.callCategory = category;
              this.callNo = msgno;
              if (this.category != category) {
                this.choiceMap('in');
                this.checkCate();
                return;
              } else {
                this.choiceMap('in');
                this.mapCallMove();
              }

            } else kakaoMapOnlyViewFlag = true;
          } else {
            kakaoMapOnlyViewFlag = true;
          }
          if (kakaoMapOnlyViewFlag) {
            this.choiceMap('out');
            this.kakaoMapOnlyView(msgno);

          }
        } else if (this.mapLayooutDrawing) {
          if (this.areaInfos[category] && this.areaDatas[category]) {
            if (this.areaDatas[category][msgno]) {
              this.callCategory = category;
              this.callNo = msgno;
              if (this.category != category) {
                this.checkCate();
                return;
              } else {
                this.mapCallMove();
              }
            }
          }
        } else if (this.kakaoMapView) {
          this.kakaoMapOnlyView(msgno);
        }


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
      checkCate() {
        this.createFlag = false;
        var category = this.callCategory;
        var cateInfos = category.split('_');
        this.cate1 = cateInfos[0];
        this.cate2 = cateInfos[1];
        if (cateInfos[2]) {
          this.cate3 = cateInfos[2];
          ;
          this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
        } else {
          this.cate3 = '';
          this.category = this.cate1 + '_' + this.cate2;
        }
        /*
        for (var k in this.cateList) {
          var item = this.cateList[k];
          if (item.no == this.cate1) {
            item.gclass = 'active';
            if (item.subList.length > 0) {
              for (var sk in item.subList) {
                if (item.subList[sk].no == this.cate2) {
                  item.subList[sk].gclass = 'active';
                } else item.subList[sk].gclass = '';
              }
            }
          } else item.gclass = '';
          this.$set(this.cateList, k, item);
        }
        */
        this.selectedMapPosition = this.getPositionName();
        this.settingMap(true);

      },
      mapCallMove() {
        var category = this.callCategory;
        var no = this.callNo;
        var targetData = this.areaDatas[category][no];
        var obj = this;
        setTimeout(function () {
          if (targetData.data.zoom > 1) {
            obj.updZoomCnt = targetData.data.zoom;
            obj.zoomMove();
            obj.callZoomCenter(targetData.data);
          }
          for (var k in obj.rectList) {
            var item = obj.rectList[k];
            if (item.no == no) {
              item.call = 'active'
              item.infoView = 'block';
              obj.kakaoMarkerToggle(no)

            } else {
              item.call = '';
              item.infoView = 'none';
            }
            obj.$set(obj.rectList, k, item);
          }

        }, 200);
      },
      getMapData() {
        var params = {};
        this.$http.post(API_URL_MAP_GET, params, {headers: CONFIG_HEADER_POST}).then(res => {
          console.log(res.data)
          console.log('--------------')
          //this.initMapData(res.data.result);
          //this.settingMsgData(res.data);
          //this.settingCategory(res.data);
          res.data.result = (res.data.mapdata.contents) ? JSON.parse(res.data.mapdata.contents) : {};
          //this.canvasWidth = res.data.result.mapWidth;
          this.alertSet = res.data.setting;
         /*
          this.noticeList = [];
          for (let item of res.data.noticeList) {
            item.contents = item.dataContents;
            item.rdate = this.getFormatDate(item.rdate);
            this.noticeList.push(item);
          }
          */
          if (this.alertSet.mapkey) {
            this.appKey = this.alertSet.mapkey;
            this.kakaoMapView = true;
          }

          //if (this.noticeList.length > 0) {
            //this.noticeColor = '#E50B0B';
          //}
          this.inMapView = (this.alertSet.inMapuse != 'no') ? true : false;
          if(!this.kakaoMapView && this.inMapView) {
            $("#categoryVirt").show();
          }


          this.settingMsgData(res.data);

          if (res.data.categorys) {
            var subsubCategorys = {};
            var subCategorys = {};
            var categorys = [];
            var subsubList = {};
            var subList = {};
            for (var idx in res.data.categorys) {
              var item = res.data.categorys[idx];
              switch (item.depth) {
                case 1:
                  if (!subCategorys[item.no]) {
                    subList = [];
                  } else {
                    subList = subCategorys[item.no];
                  }
                  categorys.push({no: item.no, name: item.name, gclass: '', subList: subList})
                  this.cateList1.push({id: item.no, label: item.name});
                  break;
                case 2:
                  if (!subCategorys[item.pno]) {
                    subCategorys[item.pno] = [];
                  }
                  if (!subsubCategorys[item.no]) {
                    subsubList = [];
                  } else {
                    subsubList = subsubCategorys[item.no];
                  }
                  subCategorys[item.pno].push({no: item.no, name: item.name, gclass: '', subList: subsubList});
                  break;
                case 3:
                  if (!subsubCategorys[item.pno]) {
                    subsubCategorys[item.pno] = [];
                  }
                  subsubCategorys[item.pno].push({no: item.no, name: item.name, gclass: ''});
                  break;
              }

            }
            if (res.data.result.areaInfos) {
              this.areaInfos = res.data.result.areaInfos;
              this.areaDatas = res.data.result.areaDatas;
            }

            var cate2 = '';
            var cate3 = '';
            categorys[0].gclass = 'active';
            if (categorys[0].subList) {
              if (categorys[0].subList.length > 0) {
                categorys[0].subList[0].gclass = 'active';
                cate2 = categorys[0].subList[0].no;
                if (categorys[0].subList[0].subList) {
                  if (categorys[0].subList[0].subList.length > 0) {
                    cate3 = categorys[0].subList[0].subList[0].no;
                  }
                }
              }
            }
            this.cateList = categorys;
            this.cate1 = this.cateList[0].no;
            this.cate1Text = this.cateList[0].name;
            if (cate3) {
              this.cate2 = cate2;
              this.cate3 = cate3;

              this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
            } else if (cate2) {
              this.cate2 = cate2;
              this.category = this.cate1 + '_' + this.cate2;
            }

            if (this.category) {
              for (var key in this.cateList) {
                var item = this.cateList[key];
                if (item.no == this.cate1) {
                  if (item.subList.length > 0) {
                    for (var sk in item.subList) {
                      var subItem = item.subList[sk];
                      this.cateList2.push({id: subItem.no, label: subItem.name});
                      if (this.cate2 == subItem.no) {
                        this.cate2Text = subItem.name;
                        if (subItem.subList.length > 0) {
                          for (let subsubItem of subItem.subList) {
                            this.cateList3.push({id: subsubItem.no, label: subsubItem.name});

                          }
                        }
                      }
                    }
                  }
                }
              }
              this.selectedMapPosition = this.getPositionName();
              this.settingMap();
            } else {
              this.selectedMapPosition = '';
            }
          }
        });
      },
      getPositionName() {
        let cateName = '';
        for (var key in this.cateList) {
          var item = this.cateList[key];
          if (item.no == this.cate1) {
            cateName = item.name;
            if (item.subList.length > 0) {
              for (var sk in item.subList) {
                var subItem = item.subList[sk];
                if (this.cate2 == subItem.no) {
                  cateName += ' > ' + subItem.name;
                  if (subItem.subList.length > 0) {
                    for (let subsubItem of subItem.subList) {
                      if (this.cate3 == subsubItem.no) {
                        cateName += ' > ' + subsubItem.name;
                        this.cate3Text = subsubItem.name;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        return cateName;
      },
      settingMsgData(response) {
        this.msgdataAllList = {};
        if (response.msgdataList) {
          if (response.msgdataList.length < 1) return;
          var category_code;
          for (var key in response.msgdataList) {
            var item = response.msgdataList[key]
            this.msgdataAllList[item.no] = item;

            var categorys = item.category.split(',');
            if (categorys[2] && categorys[2] != "null") {
              category_code = categorys[0] + '_' + categorys[1] + '_' + categorys[2];
            } else category_code = categorys[0] + '_' + categorys[1];
            if (this.msgdataCategoryList[category_code]) {
              this.msgdataCategoryList[category_code][item.no] = item;
            } else {
              this.msgdataCategoryList[category_code] = {};
              this.msgdataCategoryList[category_code][item.no] = item;
            }
          }
          var obj = this;
          if (this.kakaoMapView) {
            if (this.map && this.kakao) {
              this.settingKakaoMapData();
            } else {
              var obj = this;
              var interval = setInterval(function () {
                if (obj.map && obj.kakao) {
                  clearInterval(interval);
                  obj.settingKakaoMapData();
                }
              }, 100);
            }
          }

        }
      },
      getCate(data, mode) {
        this.kakaoMapOnlyViewClose()
        var categoryFlag = false;
        let no = data.id;
        switch (mode) {
          case 'f':
            this.cateList2 = [];
            this.cateList3 = [];

            this.cate1 = no;
            var cate2 = '';
            var cate3 = '';
            for (var key in this.cateList) {
              var item = this.cateList[key];
              if (item.no == no) {
                this.cate1Text = item.name;
                if (item.subList.length > 0) {
                  for (var sk in item.subList) {
                    if (sk < 1) item.subList[0].gclass = 'active';
                    else item.subList[sk].gclass = '';
                    this.cateList2.push({id: item.subList[sk].no, label: item.subList[sk].name})
                  }
                  cate2 = item.subList[0].no;
                  this.cate2Text = item.subList[0].name;
                  if (item.subList[0].subList.length > 0) {
                    cate3 = item.subList[0].subList[0].no;
                    for (let subsubItem of item.subList[0].subList) {
                      this.cateList3.push({id: subsubItem.no, label: subsubItem.name});
                    }
                  }

                }
              }
            }
            if (cate3) {
              this.cate2 = cate2;
              this.cate3 = cate3;
              this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
              categoryFlag = true;
            } else if (cate2) {
              this.cate2 = cate2;
              this.category = this.cate1 + '_' + this.cate2;
              categoryFlag = true;
            }
            break;
          case 's':
            this.cateList3 = [];
            let index = 0;
            let k = 0;
            for (let cateItem of this.cateList) {
              if (this.cate1 == cateItem.no) {
                index = k;
                break;
              }
              k++;
            }
            this.cate2 = no;
            var cate3 = '';
            for (var key in this.cateList[index].subList) {
              var item = this.cateList[index].subList[key];
              if (item.no == no) {
                if (item.subList.length > 0) {
                  item.subList[0].gclass = 'active';
                  cate3 = item.subList[0].no;
                }
              }
            }
            if (cate3) {
              this.cate3 = cate3;
              this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
            } else {
              this.category = this.cate1 + '_' + this.cate2;
            }
            for (var key in this.cateList) {
              var item = this.cateList[key];
              if (item.no == this.cate1) {
                if (item.subList.length > 0) {
                  for (var sk in item.subList) {
                    var subItem = item.subList[sk];
                    if (this.cate2 == subItem.no) {
                      this.cate2Text = subItem.name;
                      if (subItem.subList.length > 0) {
                        for (let subsubItem of subItem.subList) {
                          this.cateList3.push({id: subsubItem.no, label: subsubItem.name})

                        }
                      }
                    }
                  }
                }
              }
            }
            categoryFlag = true;
            break;
          case 't':
            this.cate3 = no;
            this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;

            categoryFlag = true;
            break;
        }
        if (categoryFlag) {
          this.settingMap();
          this.selectedMapPosition = this.getPositionName();
        } else this.selectedMapPosition = '';
      },

      setInfoData(idx) {

        for (var k in this.rectList) {
          var info = this.rectList[k];
          if (k == idx) {
            info.infoView = 'block';
            if (this.map) {
              for (var midx in this.positions) {
                if (this.positions[midx].no == info.no) {
                  this.center = {lat: parseFloat(this.positions[midx].lat), lng: parseFloat(this.positions[midx].lng)};
                  this.kakaoMapInfowindows[midx].open(this.map, this.kakaoMapMarkers[midx]);
                  this.map.setLevel(this.kakaoInitLevel);
                } else {
                  this.kakaoMapInfowindows[midx].close();
                }
              }

            }

          } else info.infoView = 'none';
          this.$set(this.rectList, k, info);
        }

      },
      settingMap(flag) {
        if (!this.inMapView) return;

        this.areaMapInitalize();
        var areaEtcDataList = this.areaInfos;
        var zcntFlag = false;
        if (areaEtcDataList[this.category]) {
          if (areaEtcDataList[this.category].img) {
            this.mapImage = true;
            this.setImgConfig(areaEtcDataList[this.category].img);
          }
          if (areaEtcDataList[this.category].zcnt) {
            this.zoomCnt = areaEtcDataList[this.category].zcnt;
            zcntFlag = true;
          }

        }
        if (!zcntFlag) {
          this.zoomCnt = 1
        }

        var areaDataList = this.areaDatas;
        var msgdataCategoryList = this.msgdataCategoryList[this.category];

        if (areaDataList[this.category]) {
          for (var k in areaDataList[this.category]) {
            var data = areaDataList[this.category][k];
            var rectData = data.data;
            if (msgdataCategoryList[rectData.no]) {
              var top = rectData.baseStyle.top + 'px';
              var left = rectData.baseStyle.left + 'px';
              rectData.gstyle = {top: top, left: left};
              rectData.infoView = 'none';
              rectData.name = '(' + msgdataCategoryList[rectData.no].tel + ')<br>' + msgdataCategoryList[rectData.no].name;
              this.rectList.push(rectData);
            }
          }
        }
        if (flag) {
          this.updZoomCnt = 1
          this.mapCall = true;
        } else {
          this.mapCreate = true;
          if (this.updZoomCnt != 1) {
            this.updZoomUpdateFlag = true;
          }
        }

      },
      setImgConfig(img) {
        if (!this.mapImage) {
          $("#diagonal").attr('width', this.canvasWidth);
          $("#diagonal").attr('height', 700);
          $("#diagonal").css({'background': '#fff'});

          $('.area-button').addClass('disable');
          $('.area-button .md-button').removeClass('md-accent');
          $('.zoom-set select').attr('disabled', true);

          return;
        }
        $('#orgImg').off('load');
        $('#orgImg').attr('src', img);
        var obj = this;
        $('#orgImg').on('load', function () {
          if ($(this).width() < obj.canvasWidth) {
            setTimeout(function () {
              obj.setImgConfig(img);
            }, 200);
          } else {
            var tImg = new Image();
            tImg.src = $(this).attr('src');
            obj.mapOrgImgWidth = tImg.width;
            obj.mapOrgImgHeight = tImg.height;

//$('.area-button').removeClass('disable');
//$('.zoom-set select').attr('disabled',false);


            $("#mapImageLayout").css({width: $(this).width() + 'px', height: $(this).height() + 'px'});
            $("#mapImageLayoutVirt").css({width: ($(this).width() + 2) + 'px', height: ($(this).height() + 2) + 'px'});
            obj.kakaoMapHeight = $(this).height() + 'px'

            $("#diagonal").css({
              'background': 'url(' + img + ') no-repeat',
              'background-size': '100% 100%',
              width: $(this).width() + 'px',
              'max-width': $(this).width() + 'px',
              height: $(this).height() + 'px'
            });

            $("#diagonal").attr('width', $(this).width());
            $("#diagonal").attr('height', $(this).height());
            obj.mapImgfirstWidth = $(this).width();
            obj.mapImgfirstHeight = $(this).height();
            obj.zoomRate = 1;

          }
        });

      },
      /*  새로 추가된 곳 끝 */
      areaMapInitalize() {

        this.pointerDataList = []
        this.rectPointerDataList = []
        this.targetElement = null
        this.rectList = []
        this.markList = []
        this.markTextMove = false
        this.saveImgFlag = false;
        this.markTextMoveTemp = false;
        this.pointPolyTempList = [];
        this.zoomLevels = []
        this.mapOrgImgWidth = 0
        this.mapOrgImgHeight = 0
        this.mapImgfirstWidth = ''
        this.mapImgfirstHeight = ''
        this.zMoveFlag = false;
        this.divideX = 0
        this.divideY = 0
        this.zoomRate = 1;
        this.textLevels = []
        this.zoomLevelUpd = false;
        this.mapImage = false;

        for (var k = 1; k <= 10; k++) {
          this.zoomLevels.push(k);
        }
        $('#orgImg').attr('src', '');
        $("#diagonal").attr('width', this.canvasWidth);
        $("#diagonal").attr('height', 700);
        $("#diagonal").css({'background': '#fff'});

      },
      zoomMove() {

        if (this.zoomCnt == 1 || this.updZoomCnt == 1) {
          this.zMoveFlag = false;
          return;
        }
        if (!this.zMoveFlag) {
          $('#diagonal').off('mousemove');
          $('#closeMark').off('click');
          $('#diagonal').off('click');
          $('#diagonal').off('mousedown')
          $('#diagonal').off('mouseup')
          this.zMoveFlag = true;
          this.setZoomMove();
        }

      },
      setZoomMove() {

        var obj = this;
        var orgYy = this.orgY;
        var orgXx = this.orgX;

        var objWidth = $('#diagonal').attr('width');
        var objHeight = $('#diagonal').attr('height');


        $('#diagonal').on('mousedown', function (event) {

          var orgx = event.pageX;
          var orgy = event.pageY;

          var nt = $("#mapImageLayout").scrollTop();
          var nl = $("#mapImageLayout").scrollLeft();

          $(window).on('mousemove', function (event) {
            var x = event.pageX;
            var y = event.pageY;
            var moveX = orgx - x
            var moveY = orgy - y;

            var updt = parseFloat(nt) + moveY;// + parseFloat(nt);
            var updl = parseFloat(nl) + moveX;// + parseFloat(nl);
            if (updt <= 0) updt = 0;
            if (updl <= 0) updl = 0;
            $("#mapImageLayout").scrollTop(parseInt(updt));
            $("#mapImageLayout").scrollLeft(parseInt(updl));
          });
          $(window).on('mouseup', function (event) {
            $(window).off('mousemove');
            $(window).off('mouseup');

//obj.divideY = $("#mapImageLayout").scrollTop();
//obj.divideX = $("#mapImageLayout").scrollLeft();
          });

        });

      },
      callZoomCenter(data) {
        var obj = this;
        setTimeout(function () {
          var nt = $("#mapImageLayout").scrollTop();
          var nl = $("#mapImageLayout").scrollLeft();

          var moveY = data.baseStyle.top * obj.zoomRate;
          var moveX = data.baseStyle.left * obj.zoomRate;

          var updt = moveY - ($("#mapImageLayout").height() / 2);
          var updl = moveX - ($("#mapImageLayout").width() / 2);

          if (updt <= 0) updt = 0;
          if (updl <= 0) updl = 0;
          $("#mapImageLayout").animate({
            scrollTop: parseInt(updt),
            scrollLeft: parseInt(updl)
          }, 100);
        }, 200);
      },
      zoom(cmd) {
        if (cmd == 'up') {
          if (this.updZoomCnt >= this.zoomCnt) {
            return;
          }
          this.updZoomCnt++;

        } else {
          if (this.updZoomCnt <= 1) {
            return;
          }
          this.updZoomCnt--;
        }
        this.zoomMove()

      },
      setAreaShape() {

        if (this.rectList.length > 0) {
          for (var i in this.rectList) {
            var rectData = this.rectList[i];
            var top = parseFloat(rectData.baseStyle.top) * this.zoomRate;
            var left = parseFloat(rectData.baseStyle.left) * this.zoomRate;
            rectData.gstyle.top = top + 'px';
            rectData.gstyle.left = left + 'px';
            this.$set(this.rectList, i, rectData);
          }
//markTempFlag = true;
          var obj = this;
          $('#rect-container .rect-box').each(function () {
            var width = 80 * obj.zoomRate;
            var left = (width / 2) + 13;
            $(this).width(width);
            $(this).find('.mark-info-box .pop').css('left', left + 'px');

          });
        }
      },
      testCall() {
        var params = {msgno: 20, no: 3250, time: '2020-02-02', receiver: ''};
        this.call(params);
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
        this.audioStop();
        var obj = this;
        var params = {content: this.callMessage, no: this.callIdxNo}
        this.$http.post(API_URL_ALERTMAP_REGISTCALL, params, {headers: CONFIG_HEADER_POST}).then(res => {
          console.log(res.data)
          let notparams = {
            noticeIndex:this.noticeIndex,
            noticeDelete:this.noticeDelete
          }
          this.$eventBus.$emit('noticeDelete',notparams);
          if (obj.noticeDelete && obj.noticeIndex) {
           // obj.noticeList.splice(obj.noticeIndex, 1);
            obj.noticeIndex = '';
            obj.noticeDelete = false;
          }

          if (obj.alertSet.popup != 'yes') {
            $('#onlyMapConfirmButton').remove();
          }
          for (var k in obj.rectList) {
            var item = obj.rectList[k];
            item.call = '';
            obj.$set(obj.rectList, k, item);
          }
          obj.callMessage = '';

        });
      },
      noticeAlertDelete() {
        if (this.alertSet.popup != 'yes') {
          $('#onlyMapConfirmButton').remove();
        }
        for (var k in this.rectList) {
          var item = this.rectList[k];
          item.call = '';
          this.$set(this.rectList, k, item);
        }

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
        if (this.alertSet.sound == 'yes') {
          if (volume) this.msgVolume = true;
          else this.msgVolume = false;
        } else this.msgVolume = false;
        this.screenShow = true;

      },
      audioStart() {
        this.audio.currentTime = 0;
        this.audio.play();
      },
      audioStop() {
        this.msgVolume = false;
        this.audio.pause();  // &nbsp;Audio 정지하기
      },
      settingKakaoMapData() {
        this.positions = [];
        if (this.msgdataAllList) {
          for (var key in this.msgdataAllList) {
            var item = this.msgdataAllList[key]
            if (item.lat && item.lng) {
              var content = '<div style="padding:7px 5px;min-height:60px;text-align:center;border-radius:9px;min-width:130px;width:100%;">';
              content += '<div style="font-size:9pt;line-height:120%;color:#000;padding:0;">(' + item.tel + ')<br>' + item.name + '</div></div>';

              var mapItem = {content: content, lat: item.lat, lng: item.lng, no: key}
              this.positions.push(mapItem);
            }
          }
        }
        this.setMapMarker()
      },
      kakaoMapOnlyView(no) {
        this.category = '';
        /*
        for (var k in this.cateList) {
          var item = this.cateList[k];
          item.gclass = '';
          if (item.subList.length > 0) {
            for (var sk in item.subList) {
              item.subList[sk].gclass = '';
            }
          } else item.gclass = '';
          this.$set(this.cateList, k, item);
        }
        */
        this.KakaoOnlyViewMarker(no)
      },

      kakaoMapSizeInit() {
        //$("#kakao-map-only-view-box").hide();

      },
      kakaoMapOnlyViewClose() {
        return;
      },
      KakaoOnlyViewMarker(msgno) {
        var kakakoMarkerData = {};
        var kakakoMarkerDataFlag = false;
        if (this.kakaoMapView) {
          for (var midx in this.positions) {
            if (this.positions[midx].no == msgno) {
              kakakoMarkerDataFlag = true;
              kakakoMarkerData = this.positions[midx];
            }
          }
        }
        if (kakakoMarkerDataFlag) {
          if (kakakoMarkerData.lat && kakakoMarkerData.lng) {
            this.setKakaoMarker(kakakoMarkerData);
          }
        }
      },
      kakaoMarkerToggle(no) {
        for (var midx in this.positions) {
          if (this.positions[midx].no == no) {
            this.center = {lat: parseFloat(this.positions[midx].lat), lng: parseFloat(this.positions[midx].lng)};
            this.kakaoMapInfowindows[midx].open(this.map, this.kakaoMapMarkers[midx]);
            this.map.setLevel(this.kakaoInitLevel);
          } else {
            this.kakaoMapInfowindows[midx].close();
          }
        }
      },
      setKakaoMarker(item) {
        if (this.kakaoMapOnlyMarkers.length > 0) {
          for (var key in this.kakaoMapOnlyMarkers) {
            this.kakaoMapOnlyMarkers[key].setMap(null);
            this.kakaoMapOnlyInfowindows[key].close();
          }
          this.kakaoMapOnlyMarkers = [];
          this.kakaoMapOnlyInfowindows = [];

        }

        this.onlyMap.setLevel(this.kakaoInitLevel);
        var position = new kakao.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
        var content = item.content;
        var marker = new kakao.maps.Marker({
          position: position
        });
        if (this.alertSet.popup != 'yes') {
          $('#onlyMapConfirmButton').remove();
          content += '<button style="width:100px;font-size:10pt;margin:0 auto 10px 20px;text-align:center;background:#f00;border-radius:3px;color:#fff;line-height:25px;min-height:25px;height:25px;" id="onlyMapConfirmButton" type="button">확 인</button>';
        }
        marker.setMap(this.onlyMap);
        this.kakaoMapOnlyMarkers.push(marker);
        var infowindow = new kakao.maps.InfoWindow({
          content: content,
          center: position
        });
        infowindow.open(this.onlyMap, marker);
        this.kakaoMapOnlyInfowindows.push(infowindow);
        this.center = {lat: parseFloat(item.lat), lng: parseFloat(item.lng)}
        if (this.alertSet.popup != 'yes') {
          var obj = this;
          $('#onlyMapConfirmButton').on('click', function () {
            obj.showCallPopup()
          });
        }

      },
      setMapMarker() {
        var obj = this;
        var moveLat = "";
        var moveLon = "";

        for (var i = 0; i < this.positions.length; i++) {
          this.addMarker(this.positions[i]);
          if (!moveLat) {
            moveLat = this.positions[i].lat;
            moveLon = this.positions[i].lng;
          }
        }
        if (moveLat) {
          this.center = {lat: parseFloat(moveLat), lng: parseFloat(moveLon)};
        }

      },
      addMarker(data) {
        if (this.kakao) {
          var position = new kakao.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
          var content = data.content;
          var marker = new kakao.maps.Marker({
            position: position
          });

          marker.setMap(this.map);
          this.kakaoMapMarkers.push(marker);

          var infowindow = new kakao.maps.InfoWindow({
            content: content,
            center: position
          });

          this.kakaoMapInfowindows.push(infowindow);
          var obj = this;
          (function (marker, infowindow) {
            kakao.maps.event.addListener(marker, 'click', function () {
              for (var midx in obj.kakaoMapInfowindows) {
                obj.kakaoMapInfowindows[midx].close();
              }
              infowindow.open(obj.map, marker);
            });

          })(marker, infowindow);
        }
      }

    },
    beforeDestroy() {
      this.audio.pause();
      this.$eventBus.$off('showCallMessage');
      this.$eventBus.$off('noticeAlertDelete');

    },
    mounted() {

      /*
	  var pageWidth = $('.page-content').width();
	  var imgWidth = $("#mapImageLayout").width()
	  var kakaoWidth = pageWidth - imgWidth;
	  $(".kakao-map-layout").width(kakaoWidth);
	  */

    },
    updated() {
      if (this.inMapView) {
        if (!this.mapLayooutDrawing) {
          $("#mapImageLayout").css({width: this.canvasWidth + 'px', height: '700px'});
          $("#mapImageLayoutVirt").css({width: (this.canvasWidth + 2) + 'px', height: '702px'});
          $("#diagonal").attr('width', this.canvasWidth);
          $("#diagonal").attr('height', 700);
          $('#orgImg').css('max-width', this.canvasWidth + 'px');
          this.mapLayooutDrawing = true;
          if (this.kakaoMapView) {
            $('#mapImageLayoutVirt').hide();
            $('#mapZoomVirt').hide();
            $('#categoryVirt').hide();
          }

        }
        this.orgY = $('#diagonal').offset().top;
        this.orgX = $('#diagonal').offset().left + 3;
        this.audio = document.querySelector("#sound");

        var obj = this;
        if (this.zoomLevelUpd) {
          this.zoomLevel = this.tempZoomLevel;
          this.zoomLevelUpd = false;
        }
      }

      if (sessionStorage.getObject('callMessage')) {
        var params = sessionStorage.getObject('callMessage');
        if (params.no) {
          this.call(params, 'sess');

        }
        sessionStorage.setObject('callMessage', '')
      }
      if (this.mapCall) {
        this.mapCallMove();
        this.mapCall = false;
      } else {
        if (this.updZoomUpdateFlag) {
          if (this.inMapView) {
            this.updZoomUpdateFlag = false;
            $("#mapImageLayout").scrollTop(0);
            $("#mapImageLayoutVirt").scrollLeft(0);
            var interval = setInterval(function () {
              if (!isNaN(obj.mapImgfirstWidth) && obj.mapImgfirstWidth) {
                obj.updZoomCnt = 1
                clearInterval(interval);
              }
            }, 100);
          }
        }
      }

    },
  }
</script>
<style lang="scss" scoped>

  .map-posi-title {
    font-weight: bold;
    color: #000;
    font-size: 14pt;
    margin: 0 0 10px 0;
  }

  .kakao-map-layout {
    .wide-button {
      position: absolute;
      display: inline-block;
      padding: 8px;
      background: #cc0000;
      font-size: 15pt;
      color: #fff;
      top: 10px;
      right: 10px;
      cursor: pointer;
      z-index: 1002;

    }
    #kakao-map-box {
      z-index: 1001;

    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .category-box {
    display: flex;
    ul.list {
      display: flex;
      flex-wrap: wrap;
      margin: 0 0 10px 0;
      li {
        border: solid 1px #ccc;
        border-right: none;
        width: auto;
        height: 40px;
        padding: 0 20px;
        font-size: 12pt;
        cursor: pointer;
        line-height: 40px;
        font-size: 12pt;
        font-weight: bold;

      }
      li.active {
        background: #448AFF;
        color: #fff;
      }
      li.cate-sub-list {
        padding: 0 15px;
        background: #fafafa;
        color: #000;
        font-size: 11pt;
        .cate-name-box {
          display: inline-block;
          height: 40px;
        }

      }
      li.cate-sub-list.active {
        background: #999;
        .cate-name-box {
          color: #fff;
        }
        .cate-last-box {
          select {
            margin-left: 15px;
            margin-right: -10px;
            background: #fff;
            padding: 0 0 0 10px;
            color: #000;
          }
        }
      }
      &:first-child li:first-child {
        border-radius: 7px 0 0 7px;
      }
      &:last-child li:last-child {
        border-right: solid 1px #ccc;
        border-radius: 0 7px 7px 0;
      }

    }
  }

  .page-container {
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }

  #mapImageLayout {
    -ms-overflow-style: none;
    position: relative;
    margin-bottom: 50px;
    overflow: hidden;
    #closeMark {
      width: 18px;
      height: 18px;
      border: dashed 2px #f00;
      border-radius: 9px;
      position: absolute;
      display: none;
    }
    #orgImg {
      position: absolute;
      display: none;
    }
    #rect-container {
      height: 0;
      .rect-box {
        position: absolute;
        z-index: 100;
        width: 80px;
        height: 60px;
        margin: -10px 0 0 -40px;
        text-align: center;
        .mark-box {
          z-index: 1000;
          padding: 0;
          height: auto;
          width: 100%;
          background: none;
          position: relative;
          i {
            font-size: 15pt;
            cursor: pointer;
            color: #FF5252;
            display: inline-block;
          }
          img {
            display: none;
          }
          .mark-info-box {
            padding: 10px;
            min-width: 130px;
            background: #fff;
            border: solid 1px #ccc;
            border-radius: 7px;
            position: absolute;
            -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
            bottom: 37px;
            left: -25px;
            .name-text {
              width: auto;
              height: auto;
              padding: 0;
              background: none;
              font-size: 9pt;
              line-height: 120%;
              color: #000;
            }
            .call-regist-button {
              display: none;
            }
            .pop {
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-top: 10px solid #fff;
              bottom: -10px;
              left: 53px;
            }

          }
        }
        .mark-box.active {
          i {
            display: none;
          }
          img {
            display: inline-block;
          }
          .mark-info-box {
            -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
            bottom: 40px;
            left: -25px;
            .name-text {
              font-size: 11pt;
              font-weight: bold;
              line-height: 130%;

            }
            .call-regist-button {
              display: block;
              padding: 7px 0 4px 0;
            }

          }
        }
      }
    }

  }

  #diagonal.zoom-move {
    cursor: grab;
  }

  #mapImageLayout::-webkit-scrollbar {
    display: none;
  }

  .editbutton-box {
    position: absolute;
    top: 60px;
    right: 30px;
    .edit-button-box {
      position: relative;
      z-index: 1000;
      font-size: 14px;
      width: 40px;
      li.zoom-button {
        padding: 0;
        height: 45px;
        background: #fafafa;
        .md-button {
          margin: 0;
          font-size: 12px;
          min-width: 15px;
          width: 100%;
          min-height: 45px;
          height: 45px;
          background: #fafafa;
          border: none;
          border-radius: 0;
          i {
            font-size: 15pt;
          }
        }
        &:first-child {
          height: 47px;
          border: solid 1px #ccc;
          border-radius: 15px 15px 0 0;
          .md-button {
            border-radius: 15px 15px 0 0;
            i {
              margin-top: 2px;
            }
          }
        }
        &:last-child {
          border: solid 1px #ccc;
          border-radius: 0 0 15px 15px;
          .md-button {
            border-radius: 0 0 15px 15px;

          }
        }

      }
      li.zoom-level-box {
        height: auto;
        min-height: 200px;
        padding: 0;
        background: #fafafa;
        position: relative;
        border: solid 1px #ccc;
        padding: 0;
        margin: 0;

      }

    }
  }

  select {
    height: 34px;
    border-radius: 5px;
    width: 110px;
    font-size: 12px;
  }

  select:disabled {
    background: #dfdfdf;
  }


</style>
