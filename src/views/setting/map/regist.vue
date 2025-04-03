<template>
  <div class="page-content" style='position:relative;'>
    <b-row>
      <b-colxx xxs="12">
        <h1>맵 등록</h1>
        <div class="top-right-button-container">

        </div>
        <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
             <span>기본설정</span> | <span>맵 등록</span>
          </b-nav>
        </span>

        <div class="mb-2 mt-2" style="padding-top:10px;">
          <b-collapse class="d-md-block">
            <div>
              <div>
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
            <div style="clear:both;height:3px;"></div>
            <div>
              <div>
                <b-tooltip target="area-img-btn"
                           placement="left"
                           :style="{'width':'300px'}"
                           :title="'맵 지도를 등록할 파일선택'">
                </b-tooltip>
                <div class='editbutton-box'>
                  <ul class='edit-button-box' style="overflow:hidden;width:100%;">
                    <li class="subtitle-box">
                      <span>맵 이미지 등록 &nbsp;</span>
                    </li>

                    <li class="img-input-box" id="area-img-btn">
                      <button class="md-raised md-button" style='width:60px;border-radius:0 7px 7px 0;'><i
                        class="fa fa-image"></i></button>
                      <input type='file' id="mapImage" accept="image/*">
                    </li>

                    <li class="subtitle-box">
                      <span>비상벨 등록 &nbsp;</span>
                    </li>
                    <b-tooltip target="area-regit-btn"
                               placement="left"
                               :style="{'width':'300px'}"
                               :title="'비상벨을 등록할 위치 지정'">
                    </b-tooltip>
                    <li class="area-button" id="area-regit-btn">
                      <button class="md-raised md-button" code="rect"><i class="far fa-square"></i></button>
                    </li>
                    <li class="subtitle-box" style="max-width:3px;">
                    </li>
                    <li class="zoom-set">
                      <select v-model="zoomCnt" style='width:100%;'>
                        <option v-for="zoom in zoomLevels" :value="zoom">확대분활수 : {{zoom}}</option>
                      </select>

                    </li>
                    <li class="zoom-button">
                      <button class="md-raised md-button" @click="zoom('up')"><i class="fa fa-search-plus"></i></button>
                      <button class="md-raised md-button" @click="zoom('dn')"
                              style="border-radius:0;margin:0 0 0 -4px;border-left:solid 1px #999da0;"><i
                        class="fa fa-search-minus"></i></button>
                    </li>
                    <li class="zoom-level-box" style="border-left:none;margin-left:0;">
                      <span>Lv {{updZoomCnt}}</span>
                    </li>
                    <li class="zoom-move-button">
                      <button class="md-raised md-button" @click="zoomMove()"><i class="fa fa-arrows-alt"></i></button>
                    </li>
                    <li class="tip-button">
                      확대기능 사용시 최소 이미지 사이즈는 가로 {{canvasWidth+200}}px 입니다<br>
                      확대등급을 10등급까지 사용하실때는 가로 {{canvasWidth+1000}}px 이상의 이미지를 입력하세요
                    </li>
                    <li class="regist-button">
                      <b-button variant="primary" size="lg" style="color:#fff;" @click="registData()" type="button">정보
                        저장
                      </b-button>
                    </li>

                  </ul>

                  <div style='clear:both;'></div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5"/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" style="margin-top:-30px">
        <!--div class="map-posi-title">{{selectedMapPosition}}</div-->
        <div id='mapImageLayoutVirt' style='border:solid 1px #ccc;padding:0;margin:0;'>
          <div id='mapImageLayout' style='position:relative;'>
            <div id='rect-container'>
              <div v-for="rect,idx in rectList" class="rect-box" :index="idx" :style="rect.gstyle">
                <div class="mark-box">
                  <i class="fas fa-map-marker-alt" @click="setInfoData(idx)"></i>
                  <div v-if="rect.name" class="name-text" v-html="rect.name"></div>

                </div>
              </div>
            </div>
            <canvas id="diagonal" style="position:absolute;top:0;left:0;"></canvas>
            <img id="orgImg" style='display:none;'/>
            <div id='closeMark'></div>
          </div>
        </div>

      </b-colxx>
    </b-row>
    <b-modal size="lg" ref="modalHolidaybackdrop"
             :hide-backdrop="selectedHolidayBackdrop=='false'"
             :no-close-on-backdrop="selectedHolidayBackdrop=='false' || selectedHolidayBackdrop=='static'">
      <template slot="modal-header">
        <h5 style="padding-left:40px;">발신번호 등록</h5>
      </template>
      <b-colxx xxs="12" class="box-margin30 data-regist">
        <b-row>
          <b-colxx sm="12">
            <div class="from-box">
              <ul class="msgdata-list" v-if="msgdataView">
                <li v-for="mdata,index in msgdataList" :class="mdata.gclass" @click="setMsgdata(index)">
                  <div class="tel">{{mdata.tel}}</div>
                  <div class="name">{{mdata.name}}</div>
                </li>
              </ul>
              <div class="none-box" v-else>
                등록된 발신번호 목록이 존재하지 않습니다
              </div>
            </div>
            <div class="select-level-box">
              <div>비상벨 알림시 확대레벨</div>
              <select v-model="tempNoticeZoom" style='width:100%;'>
                <option v-for="zoom in initZoomLevels" :value="zoom">Lv {{zoom}}</option>
              </select>
            </div>

          </b-colxx>
        </b-row>
      </b-colxx>
      <template slot="modal-footer">
        <div v-if="markerMode=='create'">
          <b-button variant="secondary" style="color:#fff;" type="button" @click="removeTempData()"> 취 소</b-button>
          <b-button variant="primary" style="color:#fff;" v-if="msgdataView" @click="makeMarker()" type="button">확 인
          </b-button>
        </div>
        <div v-else>
          <b-button variant="warning" type="button" style="color:#fff;" @click="deleteMarker()">삭 제</b-button>

          <b-button variant="secondary" type="button" style="color:#fff;" @click="removeTempData()"> 취 소</b-button>
          <b-button variant="primary" style="color:#fff;" v-if="msgdataView" @click="makeMarker()" type="button">확 인
          </b-button>
        </div>
      </template>
    </b-modal>


  </div>
</template>

<script>
  import {
    API_URL_MAP_GET,
    API_URL_MAP_SAVEIMG,
    API_URL_MAP_REGIST,
    API_URL_MAP_GETIMG,
    CONFIG_HEADER_POST
  } from '../../../api/urls';
  import * as $ from 'jquery';
  import {mapMutations, mapGetters} from "vuex";

  export default {
    name: 'mapRegist',
    computed: {
      ...mapGetters(["getAreaSaveDataList", "getAreaEtcDataList", "getGUseList"])
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

          $('.img-input-box').removeClass('disable');
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
          $('.img-input-box').addClass('disable');
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
          $('.img-input-box').addClass('disable');
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

        //$('.mark-box .name-text').css('font-size',size+'pt');


      },
      zoomCnt(zcnt) {
        this.initZoomLevels = [];
        for (var i = 1; i <= zcnt; i++) {
          this.initZoomLevels.push(i)
        }
        this.zoomLevel = 1;
        this.updZoomCnt = 1
        if (zcnt == 1) {
          $('.zoom-button').addClass('disable');
          //$('.area-button').removeClass('disable');

        } else {
          $('.zoom-button').removeClass('disable');

        }
        var zoomData = {};
        zoomData.category = this.category;
        zoomData.type = 'zcnt';
        zoomData.value = zcnt;
        this.insertAreaEtcDataList(zoomData);


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
        sideMenuView: true,
        selectedHolidayBackdrop: 'false',
        pointerList: [],
        context: null,
        pointerDataList: [],
        orgX: 0,
        orgY: 0,
        rectPointerDataList: [],
        circlePointerDataList: [],
        targetElement: null,
        rectList: [],
        circleList: [],
        markList: [],
        canvasWidth: 1658,
        markTextMove: false,
        mapImage: false,
        saveImgFlag: false,
        markTextMoveTemp: false,
        pointPolyTempList: [],
        zoomLevels: [],
        initZoomLevels: [],
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
        textLevel: 7,
        textLevels: [],

        /* 새로 추가된 */
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


        screenLayoutShow: false,
        msgdataList: {},
        msgdataAllList: {},
        tempMakerIndex: '',
        choiceRectIndex: '',
        tempNoticeZoom: 1,
        tempMakerNo: '',
        category: '',
        markerMode: '',
        updateMakerIndex: '',
        updZoomUpdateFlag: false,
        mapCreate: false,
        /* 새로 추가된 끝 */
        msgdataView: false,
        selectedMapPosition: '',

      }
    },
    created() {
      this.getMapData();


    },
    methods: {

      ...mapMutations(["initMapData", "insertAreaSave", "removeAreaSave", "insertGuse", "removeGuse", "insertAreaEtcDataList"]),

      /*  새로 추가된 곳 시작 */
      getMapData() {

        var params = {};
        this.$http.post(API_URL_MAP_GET, params, {headers: CONFIG_HEADER_POST}).then(res => {
          if (res.data.result == 'succ') {
            if (res.data.mapdata.contents) {
              let mapdata = JSON.parse(res.data.mapdata.contents);
              this.initMapData(mapdata);
            }
            this.settingMsgData(res.data);
            this.settingCategory(res.data);
          }


        });
      },
      settingMsgData(response) {

        this.msgdataAllList = {};
        if (response.msgdataList) {
          if (response.msgdataList.length < 1) return;
          var category_code;
          for (var key in response.msgdataList) {
            var item = response.msgdataList[key];
            var categorys = item.category.split(',');
            if (categorys[2] && categorys[2] != "null") {
              category_code = categorys[0] + '_' + categorys[1] + '_' + categorys[2];
            } else category_code = categorys[0] + '_' + categorys[1];
            if (this.msgdataAllList[category_code]) {
              this.msgdataAllList[category_code][item.no] = item;
            } else {
              this.msgdataAllList[category_code] = {};
              this.msgdataAllList[category_code][item.no] = item;
            }
          }
        }

      },
      settingCategory(response) {
        var obj = this;
        if (response.categorys) {
          if (response.categorys.length < 1) return;
          var subsubCategorys = {};
          var subCategorys = {};
          var categorys = [];
          var subsubList = {};
          var subList = {};
          for (var idx in response.categorys) {
            var item = response.categorys[idx];
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
          if (response.result) {
            obj.areaInfos = response.result.areaInfos;
            obj.areaDatas = response.result.areaDatas;
          }

          var cate2 = '';
          var cate3 = '';
          var cate2Name = '';
          var cate3Name = '';

          categorys[0].gclass = 'active';
          if (categorys[0].subList) {
            if (categorys[0].subList.length > 0) {
              categorys[0].subList[0].gclass = 'active';
              cate2 = categorys[0].subList[0].no;
              cate2Name = categorys[0].subList[0].name;
              if (categorys[0].subList[0].subList) {
                if (categorys[0].subList[0].subList.length > 0) {
                  cate3 = categorys[0].subList[0].subList[0].no;
                  cate3Name = categorys[0].subList[0].subList[0].name;
                }
              }
            }
          }
          obj.cateList = categorys;
          obj.cate1 = obj.cateList[0].no;
          this.cate1Text = obj.cateList[0].name;
          if (cate3) {
            obj.cate2 = cate2;
            obj.cate3 = cate3;
            this.cate2Text = cate2Name;
            this.cate3Text = cate3Name;

            obj.category = obj.cate1 + '_' + obj.cate2 + '_' + obj.cate3;
          } else if (cate2) {
            obj.cate2 = cate2;
            obj.category = obj.cate1 + '_' + obj.cate2;
            this.cate2Text = cate2Name;

          }
          if (obj.category) {
            let cateName = '';
            for (var key in this.cateList) {
              var item = this.cateList[key];
              if (item.no == this.cate1) {
                cateName = item.name;
                if (item.subList.length > 0) {
                  for (var sk in item.subList) {
                    var subItem = item.subList[sk];
                    this.cateList2.push({id: subItem.no, label: subItem.name});
                    if (this.cate2 == subItem.no) {
                      cateName += ' > ' + subItem.name;

                      if (subItem.subList.length > 0) {
                        for (let subsubItem of subItem.subList) {
                          this.cateList3.push({id: subsubItem.no, label: subsubItem.name});

                          if (this.cate3 == subsubItem.no) {
                            cateName += ' > ' + subsubItem.name;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            this.selectedMapPosition = cateName
            obj.settingMap();
          } else {
            this.selectedMapPosition = '2차 카테고리를 선택하세요'
          }
        }
      },
      getCate(item, mode) {
        var categoryFlag = false;
        var cateName = '';
        let no = item.id;
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
                item.gclass = 'active';
                cateName = item.name;
                this.cate1Text = item.name;
                if (item.subList.length > 0) {
                  for (var sk in item.subList) {
                    if (sk < 1) item.subList[0].gclass = 'active';
                    else item.subList[sk].gclass = '';
                    this.cateList2.push({id: item.subList[sk].no, label: item.subList[sk].name})
                  }
                  cate2 = item.subList[0].no;
                  this.cate2Text = item.subList[0].name;
                  cateName += ' > ' + item.subList[0].name;
                  if (item.subList[0].subList.length > 0) {
                    cate3 = item.subList[0].subList[0].no;
                    cateName += ' > ' + item.subList[0].subList[0].name;
                    this.cate3Text = item.subList[0].subList[0].name;
                    for (let subsubItem of item.subList[0].subList) {
                      this.cateList3.push({id: subsubItem.no, label: subsubItem.name});
                    }
                  }

                }
              } else item.gclass = '';
              this.$set(this.cateList, key, item);
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
            let index = 0;
            let k = 0;
            for (let cateItem of this.cateList) {
              if (this.cate1 == cateItem.no) {
                index = k;
                break;
              }
              k++;
            }
            this.cateList3 = [];
            this.cate2 = no;
            var cate3 = '';
            var cate3Name = '';
            for (var key in this.cateList[index].subList) {
              var item = this.cateList[index].subList[key];
              if (item.no == no) {
                item.gclass = 'active';
                if (item.subList.length > 0) {
                  item.subList[0].gclass = 'active';
                  cate3 = item.subList[0].no;
                  cate3Name = ' > ' + item.subList[0].name;
                }
              } else item.gclass = '';
              this.$set(this.cateList[index].subList, key, item);
            }
            if (cate3) {
              this.cate3 = cate3;
              this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
            } else {
              this.cate3 = '';
              this.category = this.cate1 + '_' + this.cate2;
            }
            for (var key in this.cateList) {
              var item = this.cateList[key];
              if (item.no == this.cate1) {
                cateName = item.name;
                if (item.subList.length > 0) {
                  for (var sk in item.subList) {
                    var subItem = item.subList[sk];
                    if (this.cate2 == subItem.no) {
                      cateName += ' > ' + subItem.name;
                      this.cate2Text = subItem.name;

                      if (subItem.subList.length > 0) {
                        for (let subsubItem of subItem.subList) {
                          this.cateList3.push({id: subsubItem.no, label: subsubItem.name})
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
            //if(cate3Name)cateName+=cate3Name;

            categoryFlag = true;
            break;
          case 't':
            categoryFlag = true;
            this.cate3 = no;
            this.category = this.cate1 + '_' + this.cate2 + '_' + this.cate3;
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

            break;

        }
        if (categoryFlag) {
          this.selectedMapPosition = cateName;
          this.settingMap();
        } else {
          this.selectedMapPosition = '2차 카테고리를 선택하세요'

        }
      },
      setMsgdata(index) {

        if (this.msgdataList[index].gclass == 'active' || this.msgdataList[index].gclass == 'disabled') return;
        var msgdataList = this.msgdataList;
        this.msgdataList = {};
        if (this.tempMakerIndex) {
          msgdataList[this.tempMakerIndex].guse = '';
          msgdataList[this.tempMakerIndex].gclass = '';
        }
        msgdataList[index].guse = 'yes';
        msgdataList[index].gclass = 'active';
        this.tempMakerIndex = index;
        this.tempMakerNo = index;
        for (var key in msgdataList) {
          this.msgdataList[key] = msgdataList[key];
        }
      },
      deleteMarker() {
        var obj = this;
        var alertParams = {};
        alertParams.type = 'confirm';
        alertParams.message = '발신번호 등록정보를 삭제 하시겠습니까?';
        alertParams.doAction = function () {
          var info = obj.rectList[obj.choiceRectIndex];
          var delData = {no: info.no, category: obj.category};
          obj.removeAreaSave(delData);
          obj.removeGuse(info.no);
          var data = obj.msgdataList[obj.updateMakerIndex];
          data.guse = '';
          data.gclass = '';
          obj.$set(obj.msgdataList, obj.updateMakerIndex, data);
          obj.rectList.splice(obj.choiceRectIndex, 1);

          obj.updateMakerIndex = '';
          obj.choiceRectIndex = '';
          obj.tempMakerIndex = '';
          obj.tempMakerNo = '';
          obj.$refs['modalHolidaybackdrop'].hide();

        }
        this.$eventBus.$emit('modalOpen', alertParams);

      },
      makeMarker() {
        if (!this.tempMakerNo) {
          var params = {};
          params.message = '발신번호를 선택하세요';
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        var data = this.msgdataList[this.tempMakerIndex];
        data.guse = 'yes';
        data.gclass = '';
        this.msgdataList[this.tempMakerIndex] = data;

        if (this.updateMakerIndex) {
          var oldData = this.msgdataList[this.updateMakerIndex];
          oldData.guse = '';
          oldData.gclass = '';
          this.msgdataList[this.updateMakerIndex] = oldData;
        }


        var name = '(' + data.tel + ')<br>' + data.name;
        var rectData = this.rectList[this.choiceRectIndex];
        rectData.name = name;
        rectData.no = data.no;
        rectData.zoom = this.tempNoticeZoom;
        if (!rectData.baseStyle) {
          var top = parseFloat(rectData.gstyle.top.replace('px', '')) / this.zoomRate;
          var left = parseFloat(rectData.gstyle.left.replace('px', '')) / this.zoomRate;
          rectData.baseStyle = {top: top, left: left}
        }

        this.rectList.splice(this.choiceRectIndex, 1, rectData);

        var resultData = {data: rectData, category: this.category, no: data.no}
        this.insertAreaSave(resultData);
        this.insertGuse(this.tempMakerNo);


        this.markTextMove = true;
        this.$refs['modalHolidaybackdrop'].hide();

        this.choiceRectIndex = '';
        this.tempMakerIndex = '';
        this.updateMakerIndex = '';
        this.tempMakerNo = '';

      },
      setInfoData(idx) {
        this.choiceRectIndex = idx;
        var info = this.rectList[idx];
        if (info.no) {
          for (var k in this.msgdataList) {
            var item = this.msgdataList[k];
            if (item.no == info.no) {
              item.gclass = 'active';
              this.tempMakerIndex = k;
              this.tempMakerNo = item.no;
              this.updateMakerIndex = k;

            } else if (item.guse == 'yes') {
              item.gclass = 'disabled';
            } else item.gclass = '';

            this.$set(this.msgdataList, k, item);
          }
          this.tempNoticeZoom = info.zoom;
          this.markerMode = 'update';
        } else {
          for (var k in this.msgdataList) {
            var item = this.msgdataList[k];
            if (item.guse == 'yes') {
              item.gclass = 'disabled';
            } else item.gclass = '';
            this.$set(this.msgdataList, k, item);
          }
          this.tempNoticeZoom = 1;
          this.markerMode = 'create';
        }
        this.$refs['modalHolidaybackdrop'].show();


      },
      removeTempData() {
        if (this.markerMode == 'create') {
          this.rectList.pop();
        }
        this.$refs['modalHolidaybackdrop'].hide();
        this.choiceRectIndex = '';
        this.tempMakerIndex = '';
        this.tempMakerNo = '';
        this.updateMakerIndex = '';

      },
      settingMap() {

        this.areaMapInitalize();

        var areaEtcDataList = this.getAreaEtcDataList;
        var mimgFlag = false;
        var zcntFlag = false;
        var zlvFlag = false;
        var tlvFlag = false;
        //console.log(areaEtcDataList);
        if (areaEtcDataList[this.category]) {
          if (areaEtcDataList[this.category].img) {
            this.mapImage = true;
            this.setImgConfig(areaEtcDataList[this.category].img);
          }
          if (areaEtcDataList[this.category].zcnt) {
            this.zoomCnt = areaEtcDataList[this.category].zcnt;
            this.initZoomLevels = [];
            for (var i = 1; i <= this.zoomCnt; i++) {
              this.initZoomLevels.push(i)
            }
            zcntFlag = true;
          }

        }
        if (!zcntFlag) {
          this.zoomCnt = 1
          this.initZoomLevels = [1];
        }

        var areaDataList = this.getAreaSaveDataList;

        if (this.msgdataAllList[this.category]) {
          this.msgdataList = this.msgdataAllList[this.category]
          this.msgdataView = true;
        } else {
          this.msgdataView = false;
          this.msgdataList = {};
        }

        if (areaDataList[this.category]) {
          var checkFlag = false;
          for (var k in areaDataList[this.category]) {
            var data = areaDataList[this.category][k];
            var rectData = data.data;
            checkFlag = false;
            if (this.msgdataList) {
              if (this.msgdataList[rectData.no]) {
                this.msgdataList[rectData.no].guse = 'yes';
                checkFlag = true;
              }
            }
            //console.log(rectData);
            if (checkFlag) {
              var top = rectData.baseStyle.top + 'px';
              var left = rectData.baseStyle.left + 'px';
              rectData.gstyle = {top: top, left: left};
              rectData.name = '(' + this.msgdataList[rectData.no].tel + ')<br>' + this.msgdataList[rectData.no].name;

              this.rectList.push(rectData);

            }
          }
          this.markTextMoveTemp = true;
        }


      },
      setImgConfig(img, sourceImg) {
        if (!this.mapImage) {
          $("#diagonal").attr('width', this.canvasWidth);
          $("#diagonal").attr('height', 700);
          $("#diagonal").css({'background': '#fff'});

          $('.area-button').addClass('disable');
          $('.area-button .md-button').removeClass('md-accent');
          $('.zoom-set select').attr('disabled', true);

          return;
        }
        $('#orgImg').attr('src', img);
        var obj = this;
        $('#orgImg').off('load');
        $('#orgImg').on('load', function () {
          if ($(this).width() < obj.canvasWidth) {
            alert('이미지 최소 넓이는 ' + obj.canvasWidth + '입니다');
            obj.mapImage = null;
            $('.area-button').addClass('disable');
            $('.area-button .md-button').removeClass('md-accent');
            $('.zoom-set select').attr('disabled', true);

            return false;
          } else {

            var tImg = new Image();
            tImg.src = $(this).attr('src');
            obj.mapOrgImgWidth = tImg.width;
            obj.mapOrgImgHeight = tImg.height;

            $('.area-button').removeClass('disable');
            $('.zoom-set select').attr('disabled', false);


            $("#mapImageLayout").css({width: $(this).width() + 'px', height: $(this).height() + 'px'});
            $("#mapImageLayoutVirt").css({width: ($(this).width() + 2) + 'px', height: ($(this).height() + 2) + 'px'});

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


            var widthResult = obj.mapOrgImgWidth - obj.mapImgfirstWidth;
            var divide = parseInt(widthResult);
            if (divide < 200) {
              obj.zoomLevels = [];
              obj.zoomLevels.push(1);
            } else if (divide >= 200 && divide < 400) {
              obj.zoomLevels = [];
              for (var k = 1; k <= 2; k++) {
                obj.zoomLevels.push(k);
              }
            } else if (divide >= 400 && divide < 700) {
              obj.zoomLevels = [];
              for (var k = 1; k <= 4; k++) {
                obj.zoomLevels.push(k);
              }

            } else if (divide >= 700 && divide < 1000) {
              obj.zoomLevels = [];
              for (var k = 1; k <= 6; k++) {
                obj.zoomLevels.push(k);
              }
            } else if (divide >= 1000) {
              obj.zoomLevels = [];
              for (var k = 1; k <= 10; k++) {
                obj.zoomLevels.push(k);
              }
            }

            if (obj.saveImgFlag) {
              var imgName = '';
              if (obj.category) {
                var formData = new FormData();
                formData.append("uploadfile", sourceImg);
                $.ajax({
                  url: API_URL_MAP_SAVEIMG,
                  headers: {
                    "memberkey": localStorage.getItem('memberkey'),
                  },
                  cache: false,
                  processData: false,
                  contentType: false,
                  data: formData,
                  type: 'POST',
                  dataType: 'json',
                  success: function (response) {
                    console.log(response);
                    if (response.ret != 'fail') {
                      var imgName = API_URL_MAP_GETIMG + '?file=' + response.imgName;
                      var imgData = {};
                      imgData.category = obj.category;
                      imgData.type = 'img';
                      imgData.value = imgName;
                      obj.insertAreaEtcDataList(imgData);

                    } else {
                      alert('파일 업로드에 실패하였습니다');
                    }

                  }
                });
              }
            }

          }
        });

      },
      /*  새로 추가된 곳 끝 */

      areaMapInitalize() {

        this.pointerDataList = []
        this.rectPointerDataList = []
        this.targetElement = null
        this.rectList = []
        this.circleList = []
        this.markList = []
        //  this.canvasWidth = 1250
        this.markTextMove = false
        this.saveImgFlag = false;
        this.markTextMoveTemp = false;
        this.pointPolyTempList = [];
        this.zoomLevels = []
        this.initZoomLevels = []
        if (this.updZoomCnt != 1) {
          this.updZoomUpdateFlag = true;

        }
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
        this.zoomLevels.push(1);
        //for(var k=1; k<=10; k++) {
        //	this.zoomLevels.push(k);
        //}
        $('#orgImg').attr('src', '');
        $("#diagonal").attr('width', this.canvasWidth);
        $("#diagonal").attr('height', 700);
        $("#diagonal").css({'background': '#fff'});

        $('.area-button').addClass('disable');
        $('.area-button .md-button').removeClass('md-accent');
        $('.zoom-set select').attr('disabled', true);


      },

      zoomMove() {
        if (this.zoomCnt == 1 || this.updZoomCnt == 1) return;

        $('#diagonal').off('mousemove');
        $('#closeMark').off('click');
        $('#diagonal').off('click');
        $('#diagonal').off('mousedown')
        $('#diagonal').off('mouseup')

        if (this.zMoveFlag) {
          this.zMoveFlag = false;
        } else {
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
        $('#diagonal').css('cursor', 'grab')

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

            //obj.drawRect(orgx,orgy,x,y);
          });

          $(window).on('mouseup', function (event) {
            $(window).off('mousemove');
            $(window).off('mouseup');

            obj.divideY = $("#mapImageLayout").scrollTop();
            obj.divideX = $("#mapImageLayout").scrollLeft();

            //obj.closeRect();
          });

        });

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

      },

      rectInitalize() {

        $('#diagonal').css('cursor', 'pointer')
        $('#closeMark').off('click');
        $('#diagonal').off('click');
        var obj = this;
        var orgY = this.orgY;
        //var orgX = this.orgX;
        var orgX = $('#diagonal').offset().left;
        $('#diagonal').off('mousedown');
        $(window).off('mousemove');

        $('#diagonal').on('click', function (event) {
          var orgx = event.pageX - orgX;
          var orgy = event.pageY - orgY;
          orgx = obj.divideX + parseFloat(orgx);
          orgy = obj.divideY + parseFloat(orgy);

          var styleRect = {};
          styleRect.gstyle = {top: orgy + 'px', left: orgx + 'px'}
          obj.rectList.push(styleRect);
          var idx = obj.rectList.length - 1;
          obj.setInfoData(idx);

        });

      },
      rectEventOut() {

        //$('#diagonal').off('mousemove');
        //$('#closeMark').off('click');
        $('#diagonal').off('click');
        $('#diagonal').css('cursor', 'default')

      },

      updateMarkData(el) {
        var $element = $(el);
        var index = parseInt($element.attr('index'));
        var info = this.rectList[index];
        info.gstyle = {top: $element.css('top'), left: $element.css('left')}
        var top = $element.css('top');
        top = parseFloat(top.replace('px', '')) / this.zoomRate;
        var left = $element.css('left');
        left = parseFloat(left.replace('px', '')) / this.zoomRate;
        info.baseStyle = {top: top, left: left}

        var resultData = {data: info, category: this.category, no: info.no}
        this.insertAreaSave(resultData);


      },
      markTextEvent() {

        var obj = this;

        $('#rect-container .rect-box .name-text').off('mousedown')
        $('#rect-container .rect-box .name-text').on('mousedown', function () {
          var thisObj = this;
          var width = $(thisObj).parent().parent().width();
          var height = $(thisObj).parent().parent().height();

          var orgY = $('#diagonal').offset().top - 7;
          var orgX = $('#diagonal').offset().left - 40;
          var boundryMinX = obj.orgX - orgX;
          var boundryMaxX = ($('#mapImageLayout').width() - width) + boundryMinX;
          var boundryMinY = obj.orgY - orgY;
          var boundryMaxY = ($('#mapImageLayout').height() - height) + boundryMinY;

          $(window).off('mousemove');
          $(window).on('mousemove', function (event) {

            var moveX = event.pageX - orgX - (width / 2);
            var moveY = event.pageY - orgY - (height / 2);

            if ((moveX < boundryMinX) || (moveX >= boundryMaxX)) return false;
            if ((moveY < boundryMinY) || (moveY >= boundryMaxY)) return false;
            $(thisObj).parent().parent().css({'top': moveY + 'px', 'left': moveX + 'px'});
          })
          $(window).on('mouseup', function (event) {
            $(window).off('mousemove');
            $(window).off('mouseup');

            obj.updateMarkData($(thisObj).parent().parent());

          })
        });

      },
      registData() {
        let areaEtcDataList = this.getAreaEtcDataList;
        let areaDataList = this.getAreaSaveDataList;
        let checkFlag = false;
        for (var key in areaEtcDataList) {
          if (key) {
            checkFlag = true;
            break;
          }
        }
        if (!checkFlag) {
          let params = {};
          params.message = '등록할 데이타가 존재하지 않습니다';
          this.$eventBus.$emit('modalOpen', params);
          return;
        }

        let sendParams = {mapWidth: this.canvasWidth, areaDatas: areaDataList, areaInfos: areaEtcDataList};
        let sendData = JSON.stringify(sendParams);
        this.$http.post(API_URL_MAP_REGIST, sendData, {headers: CONFIG_HEADER_POST}).then(res => {
          let aparams = {};
          if (res.data.result == 'succ') {
            aparams.message = '데이타를 등록하였습니다';
          } else {
            aparams.message = '데이타를 등록에 실패 하였습니다';
          }
          this.$eventBus.$emit('modalOpen', aparams);

        });

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
            $(this).width(width);

          });
        }


      },
      hideModal() {
        this.$refs['modalHolidaybackdrop'].hide();
      },

    },
    mounted() {
      //  $('.page-container').css('min-height', $(window).height());
      $("#mapImageLayout").css({width: (this.canvasWidth) + 'px', height: '700px'});
      $("#mapImageLayoutVirt").css({width: (this.canvasWidth + 2) + 'px', height: '702px'});
      $("#diagonal").attr('width', this.canvasWidth);
      $("#diagonal").attr('height', 700);
      $('#orgImg').css('max-width', this.canvasWidth + 'px');

      this.orgY = $('#diagonal').offset().top;
      this.orgX = $('#diagonal').offset().left + 3;

      var obj = this;
      var file = document.querySelector('#mapImage');
      file.onchange = function () {
        if (!obj.cate2) {
          let aparams = {
            message: '2차 카테고리를 선택하세요'
          }
          obj.$eventBus.$emit('modalOpen', aparams);
          return;
        }
        var fileList = file.files;
        var reader = new FileReader();
        reader.readAsDataURL(fileList[0]);
        reader.onload = function () {
          obj.saveImgFlag = true
          obj.mapImage = true;
          obj.setImgConfig(reader.result, fileList[0]);
          $('#mapImage').val('');
        }

      }
      $('.area-button .md-button').off('click');
      $('.area-button .md-button').on('click', function () {
        if (!$('#orgImg').attr('src')) {
          return false;
        }
        if ($(this).hasClass('md-accent')) {
          $(this).removeClass('md-accent');
          obj.rectEventOut();
        } else {
          obj.zMoveFlag = false;
          $(this).addClass('md-accent');
          obj.rectInitalize();
        }

      });
      if (this.zoomCnt == 1) {
        $('.zoom-button').addClass('disable');
        $('.zoom-move-button').addClass('disable');
        $('.zoom-move-button .md-button').removeClass('md-accent');

      } else {
        $('.zoom-button').removeClass('disable');
        $('.zoom-move-button').removeClass('disable');
      }

      if (!this.mapImage) {
        $('.area-button').addClass('disable');
        $('.area-button .md-button').removeClass('md-accent');
        $('.zoom-set select').attr('disabled', true);
      }
      if (this.markTextMoveTemp) {
        $('#mark-container .mark-box').each(function () {
          obj.targetElement = this;
          obj.markTextEvent()
        });
        this.markTextMoveTemp = false;
        $('#mark-container .mark-box > i').off('click');
        $('#mark-container .mark-box > i').on('click', function () {
          obj.setInfoData($(this).parent());
        });

      }

    },
    updated() {
      //$('.page-container').css('min-height',$(window).height());
      var obj = this;
      if (this.markTextMoveTemp || this.markTextMove) {
        this.markTextEvent();
        this.markTextMoveTemp = false;
      }

      if (this.zoomLevelUpd) {
        this.zoomLevel = this.tempZoomLevel;
        this.zoomLevelUpd = false;

      }

      if (this.updZoomUpdateFlag) {
        this.updZoomUpdateFlag = false;
        $("#mapImageLayout").scrollTop(0);
        $("#mapImageLayoutVirt").scrollLeft(0);
        var interval = setInterval(function () {
          if (!isNaN(obj.mapImgfirstWidth) && obj.mapImgfirstWidth) {
            obj.updZoomCnt = 1
            clearInterval(interval);
          }
        }, 200);
      }

    },
  }
</script>
<style lang="scss" scoped>

  .map-posi-title {
    font-weight: bold;
    color: #000;
    font-size: 14pt;
    margin: -17px 0 10px 0;
  }

  .side-menu-icon {
    position: fixed;
    right: 5px;
    top: 300px;
    width: 60px;
    height: 60px;
    background: #7F3CBD;
    color: #fff;
    border-radius: 30px;
    text-align: center;
    line-height: 60px;
    font-size: 17pt;
    cursor: pointer;

  }

  .side-menu-box {
    position: fixed;
    right: 0;
    top: 300px;
    background: #fff;
    border-radius: 7px;
    z-index: 1000;
    width: 260px;
    -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
    .header {
      width: 100%;
      border-radius: 7px 7px 0 0;
      height: 50px;
      text-align: center;
      background: #7F3CBD;
      color: #fff;
      line-height: 50px;
      position: relative;
      font-weight: bold;
      .close-icon {
        color: #fff;
        font-size: 13pt;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 10px;
        top: 1px;
        cursor: pointer;
      }
    }
    .big-menu {
      .only-view {
        width: 50px;
        height: 50px;
        background: #fff;
        border: solid 1px #8d8d8d;
        text-align: center;
        line-height: 50px;
        font-size: 20pt;
        color: #2A8A3A;
      }
    }
    .side-category-box {
      padding: 15px;
      height: 200px;
      .category-box {
        min-width: 230px;
      }
    }

  }

  .content-box {
    line-height: 140%;
    p {
      line-height: 140%;
    }
    max-width: 100%;
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    word-break: break-all;

  }

  .content-line {
    text-decoration: underline;
    cursor: pointer;
    text-align: left;
    padding: 5px 0 5px 10px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    display: inline-block;

  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
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
          i {
            font-size: 15pt;
            cursor: pointer;
            color: #FF5252;
          }
          .name-text {
            width: auto;
            height: auto;
            padding: 0;
            background: none;
            font-size: 6pt;
            line-height: 120%;
            color: #000;
            cursor: move;

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
    .edit-button-box {
      display: flex;
      font-size: 14px;
      li {
        i {
          color: #000;
        }
        height: 40px;
        padding: 0;
        .md-raised {
          margin: 0;
          font-size: 12px;
          width: 50px;
          height: 40px;
          background: #fff;
          border: solid 1px #ccc;
          border-left: none;

          border-radius: 0;
          i {
            margin-top: 2px;
            font-size: 15pt;
          }
        }
        .md-raised:last-child {
          border-radius: 0 7px 7px 0;
        }
        .md-accent {
          background: #DF7161;
          color: #fff;
          i {
            color: #fff;
          }
        }
      }
      li.disable {
        .md-raised {
          background: #ccc;
          cursor: not-allowed;
        }
      }
      li.img-input-box {
        position: relative;
        input {
          position: absolute;
          z-index: 10;
          top: 0;
          left: 0;
          max-width: 40px;
          overflow: hidden;
          height: 40px;
          cursor: pointer;
          opacity: 0;
          cursor: pointer;
        }
      }
      li.img-input-box.disable {
        input {
          width: 0;
          height: 0;
        }
      }

      margin: 10px 0;
      li.subtitle-box {
        padding: 0 8px;
        margin-left: 17px;
        border-radius: 7px 0 0 7px;
        border: solid 1px #ccc;
        background: #777;
        color: #fff;
        span {
          line-height: 37px;
        }
      }
      li.subtitle-box:first-child {
        margin-left: 0;

      }
      li.zoom-set {
        padding: 2px 10px 0 10px;
        border: solid 1px #ccc;
        border-left: none;

      }
      li.zoom-level-box {
        padding: 0 15px;
        border: solid 1px #ccc;
        background: #fafafa;
        span {
          line-height: 37px;
          font-weight: bold;
          color: #000;
        }
      }
      li.tip-button {
        width: 410px;
        padding: 6px 0 0 10px;
        font-size: 11px;
        line-height: 130%;
        color: #f00;
        font-weight: bold;
      }
      li.regist-button {
        width: 200px;
        .md-raised {
          float: right;
          width: auto;
          border-radius: 7px;
          background: #448AFF;
          color: #fff;
          font-weight: bold;
          font-size: 12pt;
        }
      }
      float: left;
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
    .select-level-box {
      padding: 15px 0;
      div {
        padding: 10px 0 10px 10px;
        font-weight: bold;
        font-size: 14pt;
      }
      select {
        border: solid 1px #dfdfdf;
        font-size: 12pt;
        padding-left: 10px;

      }
    }

  }

  .data-regist {
    .select-level-box {
      padding: 15px 0;
      div {
        padding: 10px 0 10px 10px;
        font-weight: bold;
        font-size: 14pt;
      }
      select {
        border: solid 1px #dfdfdf;
        font-size: 12pt;
        height:40px;
        padding-left: 10px;

      }
    }
  }
  .from-box {
    height: 450px;
    overflow-y: auto;
    border: solid 1px #666;
    padding: 5px;
    background: #fafafa;
    .none-box {
      text-align: center;
      line-height: 420px;
      font-weight: bold;
      font-size: 13pt;
    }
    .msgdata-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
      li {
        width: 18.5%;
        height: 90px;
        border: solid 1px #ccc;
        margin: 5px;
        padding: 8px 5px;
        border-radius: 5px;
        background: #fff;
        cursor: pointer;
        overflow: hidden;
        .tel {
          font-weight: bold;
          font-size: 11pt;
          word-break: break-all;
          line-height: 110%;
          color: #000;
        }
        .name {
          padding-top: 5px;
          font-size: 10pt;
          color: #999;
          line-height: 120%;
        }

      }
      li.active {
        background: #535353;
        .tel, .name {
          color: #fff;
        }
      }
      li.disabled {
        background: #dfdfdf;
        cursor: default;

      }

    }
  }


</style>

