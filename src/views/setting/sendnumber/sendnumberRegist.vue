<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ title }}</h1>
      <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
             <span>기본설정</span> | <span class="pointer" @click="goList()">발신번호 설정</span>
          </b-nav>
       </span>
      <div class="top-right-button-container">
        <div class="right-button">
          <b-button class="mb-2" size="lg" variant="secondary" style="color:#fff;" @click="goBack()">목록으로</b-button>
        </div>
      </div>

    </b-colxx>
    <b-colxx xxs="12" class="box-margin30 data-regist">
      <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip tooltip-label-right">
        <b-card class="mb-4">
          <div class="sub-title">기본정보</div>
          <b-row>
            <b-colxx sm="6">
              <b-form-group label="발신번호" class="has-float-label error-l-100 margin30 required" v-if="no>0">
                <span></span>
                <b-form-input type="text" id="tel" v-model="$v.tel.$model" readonly="readonly"/>
              </b-form-group>
              <b-form-group label="발신번호" class="has-float-label error-l-100 margin30 required" v-else="no<1">
                <span></span>
                <b-form-input type="text" id="tel" v-model="$v.tel.$model"
                              :state="!$v.tel.$error"/>
                <b-form-invalid-feedback v-if="!$v.tel.required">발신번호를 입력하세요
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.tel.numeric">발신번호는 숫자만 입력가능합니다
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.tel.doubleTel">중복된 발신번호 입니다
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group label="위치정보" class="has-float-label error-l-100 margin30 required">
                <span></span>
                <b-form-input type="text" id="name" v-model="$v.name.$model"
                              :state="!$v.name.$error"/>
                <b-form-invalid-feedback v-if="!$v.name.required">위치정보를 입력하세요
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
          </b-row>
          <b-row v-if="inMapuse">
            <b-colxx sm="12" class="category-box">
              <div class="category-list">
                <b-form-group label="건물정보" class="has-float-label error-l-100 margin30  select-required">
                  <span v-if="!appKey" class="icon"></span>
                  <v-select
                    placeholder="건물정보을 선택해주세요"
                    v-model="cate1"
                    :options="cateList1"
                  />

                </b-form-group>
              </div>
              <div class="category-list">
                <b-form-group label="층별정보" class="has-float-label error-l-100 margin30   select-required">
                  <span v-if="!appKey" class="icon"></span>
                  <v-select
                    :placeholder="'층별정보를 선택해주세요'"
                    v-model="cate2"
                    :options="cateList2"
                  />

                </b-form-group>

              </div>
              <div class="category-list">
                <b-form-group label="층별상세정보" class="has-float-label error-l-100 margin30 select-required">
                  <span v-if="!appKey" class="icon"></span>
                  <v-select
                    placeholder="층별상세정보를 선택해주세요"
                    v-model="cate3"
                    :options="cateList3"
                  />
                </b-form-group>
              </div>
            </b-colxx>

          </b-row>

          <b-row style="padding-bottom:60px;">
            <b-colxx sm="12">
              <quill-editor
                ref="myQuillEditor"
                class="editor"
                v-model="contents"
                :options="editorOption"
                @ready="onEditorReady($event)"
              ></quill-editor>
            </b-colxx>
          </b-row>
          <b-row v-if="appKey">
            <b-colxx sm="12">
              <div class="sub-title">지도정보</div>

            </b-colxx>
            <b-colxx sm="5">
              <b-form-group label="좌표 LAT" class="has-float-label error-l-100 margin10 required">
                <span v-if="!inMapuse"></span>
                <b-form-input type="text" id="lat" readonly="readonly" v-model="lat" placeholder="지도에서 위치를 클릭하세요"/>
              </b-form-group>
              <div class="tip">지도에서 위치를 클릭하시면 좌표값이 자동 생성됩니다</div>

            </b-colxx>
            <b-colxx sm="5">
              <b-form-group label="좌표 LNG" class="has-float-label error-l-100 margin30 required">
                <span v-if="!inMapuse"></span>
                <b-form-input type="text" id="lng" readonly="readonly" placeholder="지도에서 위치를 클릭하세요" v-model="lng"/>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="2">

              <b-button type="button" variant="info" class="mapdel" style="color:#fff;" size="sm"
                        @click="latLngDelete()">좌표삭제
              </b-button>
            </b-colxx>

            <b-colxx sm="12">
              <div id="kakao-map-box" style="width:100%;border:solid 1px #999;margin-bottom:30px;">
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
                  @click="setLatLng"
                  @dblclick=""
                  @rightclick=""
                  @mousemove=""
                  @dragstart=""
                  @drag=""
                  @dragend=""
                  @idle=""
                  @tilesloaded=""
                  @maptypeid_changed=""
                  :style="{'width':'100%','height':'400px'}"/>
              </div>
            </b-colxx>
          </b-row>
          <b-colxx sm="12">
            <div class="button-row">
              <b-button type="button" variant="light" size="lg" @click="goBack()" class="mt-4 cancle">취 소</b-button>
              <b-button type="submit" variant="primary" style="color:#fff;" size="lg" class="mt-4">{{title}}</b-button>
            </div>
          </b-colxx>
        </b-card>
      </b-form>
    </b-colxx>
  </b-row>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'
  import VueDaumMap from 'vue-daum-map'

  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";
  import {
    API_URL_SETTING_CATEGORYLIST,
    API_URL_SETTING_SENDNUMBER_IDCHECK,
    API_URL_SETTING_SENDNUMBER_INSERT,
    API_URL_SETTING_SENDNUMBER_UPDATE,
    API_URL_SETTING_SENDNUMBER_GET,
    API_URL_SETTING_ALERTGET,
    CONFIG_HEADER_POST
  } from '../../../api/urls';
  import {validationMixin} from "vuelidate";

  const {
    required,
    numeric
  } = require("vuelidate/lib/validators");

  export default {
    components: {
      "v-select": vSelect,
      quillEditor,
      VueDaumMap
    },
    data() {
      return {
        title: '발신번호 등록',
        insertFlag: false,
        no: 0,
        tel: '',
        cate1: '',
        cate2: '',
        cate3: '',
        cateList1: [],
        cateList2: [],
        cateList3: [],
        cateView: false,
        categoryList: {},
        name: '',
        lat: '',
        lng: '',
        cate3View: false,
        updateMode: false,
        contents: '',
        editorOption: {
          theme: 'snow',
          modules: {
            toolbar: [
              // [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
            ],
            clipboard: {
              matchVisual: false
            }
          }
        },
        inMapuse: true,
        appKey: '', // 테스트용 appkey
        center: {lat: 37.440205, lng: 127.177659}, // 지도의 중심 좌표
        kakaoMapLevel: 3, // 지도의 레벨(확대, 축소 정도),
        kakaoInitLevel: 3,
        mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
        libraries: ['services', 'drawing'], // 추가로 불러올 라이브러리
        map: null, // 지도 객체. 지도가 로드되면 할당됨.
        kakaoMapMarkers: [],
        kakaoMapHeight: '550px',
        kakaoMapView: false,
      };
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mixins: [validationMixin],
    validations: {
      tel: {
        required,
        numeric,
        async doubleTel(id) {
          if (this.no > 0) return true;
          if (this.$v.tel.required && this.$v.tel.numeric) {
            let params = {tel: id}
            let {data} = await this.$http.post(API_URL_SETTING_SENDNUMBER_IDCHECK, params, {headers: CONFIG_HEADER_POST});
            if (data.result == 'succ') {
              return true;
            } else return false;
          }
        }
      },
      name: {
        required,
      },
    },
    watch: {
      cate1(val) {
        if (val.value) {
          if (!this.updateMode) {
            this.getCateData(val.value, 2, '')
          }
        } else {
          this.cate2 = '';
          this.cateList2 = [];

          this.cate3 = '';
          this.cateView = false;
          this.cateList3 = [];
        }

      },
      cate2(val) {
        if (val.value) {
          if (!this.updateMode) {
            this.getCateData(val.value, 3, '')
          }
        } else {
          this.cateList3 = [];
          this.cate3 = '';
          this.cateView = false;
        }
      },
    },
    created() {
      if (this.$route.params.id != 'new') {
        this.no = this.$route.params.id;
        if (this.no > 0) {
          this.title = '발신번호 수정';
        }
        this.setInitData();

      } else {
        this.getCateData(0, 1);
      }
      this.$http.post(API_URL_SETTING_ALERTGET, {}, {headers: CONFIG_HEADER_POST}).then(res => {
        if (res.data.result == 'succ') {
          this.inMapuse = (res.data.inMapuse != 'no') ? true : false;
          this.appKey = res.data.mapkey;

        }
      });


    },
    methods: {
      onEditorReady(quill) {
      },
      onEditorChange({quill, html, text}) {
        this.contents = html
      },
      getCateData(pno, depth, mode) {

        var params = {pno: pno, depth: depth};
        this.$http.post(API_URL_SETTING_CATEGORYLIST, params, {headers: CONFIG_HEADER_POST}).then(res => {

          this.setCategory(res.data.result, depth, mode)
        });
      },
      setCategory(datas, depth, mode) {
        let obj = this;
        let categoryList = [];
        if (datas) {
          for (let item of datas) {
            let option = {value: item.no, label: item.name}
            categoryList.push(option)
          }
        }
        switch (depth) {
          case 1:
            obj.cateList1 = categoryList;
            obj.cateList1.unshift({value:'', label:'건물정보를 선택하세요'})
            if (mode != 'upd') {
              obj.cate1 = '';
              obj.cate2 = '';
              obj.cateList2 = [];
              obj.cate3 = '';
              obj.cateView = false;
              obj.cateList3 = [];

            } else {
              console.log(obj.cate2)
              obj.getCateData(obj.cate1.value, 2, 'upd');

            }
            break;
          case 2:
            obj.cateList2 = categoryList;
            obj.cateList2.unshift({value:'', label:'층별정보를 선택하세요'})
            if (mode == 'upd') {
              if (obj.cate3) {
                obj.getCateData(obj.cate2.value, 3, 'upd');
              }
              this.updateMode = false;

            } else {
              obj.cate2 = '';
              obj.cate3 = '';
              obj.cateList3 = [];
            }
            break;
          case 3:
            obj.cateList3 = categoryList;
            obj.cateList3.unshift({value:'', label:'층별상세정보를 선택하세요'})

            if (categoryList.length > 0) {
              if (mode != 'upd') {
                obj.cate3 = '';
              }
            } else {
              obj.cate3 = '';
            }
            break;
        }
      },
      onLoad(map) {
        this.map = map;
        //var mapTypeControl = new kakao.maps.MapTypeControl();
        //this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);

        var zoomControl = new kakao.maps.ZoomControl();
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


      },
      setLatLng(data) {
        this.lat = data[0].latLng.Ma;
        this.lng = data[0].latLng.La;
        for (var key in this.kakaoMapMarkers) {
          this.kakaoMapMarkers[key].setMap(null);
        }
        this.kakaoMapMarkers = [];
        var marker = new kakao.maps.Marker({
          position: data[0].latLng
        });

        marker.setMap(this.map);
        this.kakaoMapMarkers.push(marker);

      },
      latLngDelete() {
        this.lat = '';
        this.lng = '';
        for (var key in this.kakaoMapMarkers) {
          this.kakaoMapMarkers[key].setMap(null);
        }
        this.kakaoMapMarkers = [];

      },
      showKakaoMap() {
        if (!this.appKey) return;

        if (this.lat && this.lng) {

          var latlng = new kakao.maps.LatLng(parseFloat(this.lat), parseFloat(this.lng));
          var marker = new kakao.maps.Marker({
            position: latlng
          });
          marker.setMap(this.map);
          this.kakaoMapMarkers.push(marker);
          this.center = {lat: parseFloat(this.lat), lng: parseFloat(this.lng)}
        }

      },
      setInitData() {
        let params = {no: this.no};
        this.$http.post(API_URL_SETTING_SENDNUMBER_GET, params, {headers: CONFIG_HEADER_POST}).then(res => {
          //console.log(res.data);
          if (res.data.result.no) {
            let categorys = res.data.result.category.split(',');
            //console.log(categorys);
            let cateNameList = {};
            if (res.data.categorys) {
              for (let cate of res.data.categorys) {
                cateNameList[cate.no] = cate.name;
              }
            }
            this.updateMode = true;
            this.cate1 = {value: categorys[0], label: cateNameList[categorys[0]]}
            this.cate2 = {value: categorys[1], label: cateNameList[categorys[1]]}
            if (categorys[2]) {
              this.cate3 = {value: categorys[2], label: cateNameList[categorys[2]]}
            }
            this.tel = res.data.result.tel;
            this.name = res.data.result.name;
            this.contents = res.data.result.contents;
            if (res.data.result.lat && res.data.result.lng) {
              this.lat = parseFloat(res.data.result.lat);
              this.lng = parseFloat(res.data.result.lng);
              this.showKakaoMap();
            }
            this.getCateData(0, 1, 'upd');
          } else {
            let params = {
              message: '잘못된 접근입니다',
              doAction: () => {
                this.goBack();
              }
            };
            this.$eventBus.$emit('modalOpen', params);
            return;
          }
        });
      },

      goList() {
        this.$router.push('/setting/sendnumber/list/api');
      },
      goBack() {
        this.$router.push('/setting/sendnumber/list/keep');
      },
      goListUpdate() {
        this.$router.push('/setting/sendnumber/list/update');
      },
      onValitadeFormSubmit() {

        if (this.insertFlag) return;
        this.$v.$touch();
        if (!this.$v.$anyError) {

          if (this.appKey && this.inMapuse) {

            let checkFlag = true;
            let cate1 = (this.cate1) ? this.cate1.value : '';
            let cate2 = (this.cate2) ? this.cate2.value : '';
            let cate3 = (this.cate3) ? this.cate3.value : '';
            if (cate1) {
              if (!cate2) {
                let params = {
                  message: '층별정보를 선택하세요',
                  doAction: () => {
                    scrollTo(0, 200);
                  }
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
              }
              if (!cate3) {
                let params = {
                  message: '층별상세정보를 선택하세요',
                  doAction: () => {
                    scrollTo(0, 200);
                  }
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
              }
            }
            if ((!cate1 || !cate2 || !cate3) && (!this.lat || !this.lng)) {
              checkFlag = false;
            }
            if (!checkFlag) {
              let params = {
                message: '지도정보 또는 건물정보를 선택하세요',
              };
              this.$eventBus.$emit('modalOpen', params);
              return;

            }

          } else if (this.appKey) {
            if (!this.lat && !this.lng) {
              let params = {
                message: '지도정보를 선택하세요',
              };
              this.$eventBus.$emit('modalOpen', params);
              return;
            }

          } else if (this.inMapuse) {
            let cate1 = (this.cate1) ? this.cate1.value : '';
            let cate2 = (this.cate2) ? this.cate2.value : '';
            let cate3 = (this.cate3) ? this.cate2.value : '';
            if (!cate1) {
              let params = {
                message: '건물정보를 선택하세요',
                doAction: () => {
                  scrollTo(0, 200);
                }
              };
              this.$eventBus.$emit('modalOpen', params);
              return;
            }
            if (!cate2) {
              let params = {
                message: '층별정보를 선택하세요',
                doAction: () => {
                  scrollTo(0, 200);
                }
              };
              this.$eventBus.$emit('modalOpen', params);
              return;
            }
            if (!cate3) {
              let params = {
                message: '층별상세정보를 선택하세요',
                doAction: () => {
                  scrollTo(0, 200);
                }
              };
              this.$eventBus.$emit('modalOpen', params);
              return;
            }

          }

          /*
		  if (!this.contents) {
			let params = {
			  message: '메세지 내용을 입력하세요'
			};
			this.$eventBus.$emit('modalOpen', params);
			return;
		  }
		  */


          this.insertFlag = true;
          if (this.no > 0) {
            this.updateData();
          } else this.insertData();
        } else {
          for (let id in this.$v.$params) {
            if (!this.$v[id].required || this.$v[id].$error) {
              switch (id) {
                case 'tel':
                case 'name':
                  document.getElementById(id).focus();
                  break;
                case 'cate1':
                case 'cate2':
                  window.scrollTo(0, 200)
                  break;

              }
              return;
            }
          }
        }
      },
      insertData() {
        let params = this.setSendParams();
        this.$http.post(API_URL_SETTING_SENDNUMBER_INSERT, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.insertFlag = false;
          let params = {};
          switch (res.data.result) {
            case 'succ':
              params = {
                message: '발신번호를 등록하였습니다',
                doAction: () => {
                  this.goListUpdate();
                }
              };
              break;
            case "telIs":
              params = {
                message: '중복된 발신번호가 존재합니다',
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
        params.no = this.no;
        this.$http.post(API_URL_SETTING_SENDNUMBER_UPDATE, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.insertFlag = false;
          let params = {};
          switch (res.data.result) {
            case 'succ':
              params = {
                message: '발신번호를 수정하였습니다',
                doAction: () => {
                  this.goListUpdate();
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
      setSendParams() {
        let cate1 = '';
        let cate2 = '';
        let cate3 = '';
        if (this.inMapuse) {
          cate1 = (this.cate1) ? this.cate1.value : '';
          cate2 = (this.cate2) ? this.cate2.value : '';
          cate3 = (this.cate3) ? this.cate3.value : '';
        }
        let params = {
          tel: this.tel,
          cate1: cate1,
          cate2: cate2,
          cate3: cate3,
          lat: this.lat,
          lng: this.lng,
          name: this.name,
          contents: this.contents,
        };

        return params;
      }
    },
    mounted() {

    }
  }
</script>
<style lang="scss" scoped="true">
  .list-unstyled {
    border: solid 1px #666;
    height: 320px;
    overflow-y: auto;
    li {
      cursor: pointer;
      border: solid 1px #dcdcdc;
      font-weight: bold;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      &:last-child {
        border-bottom: solid 1px #dcdcdc;
      }
      &.active {
        background: #008ECC;
        color: #fff;

      }
    }
  }

  #tel, #lat, #lng {
    background: #fff;
  }

  .tip {
    font-weight: normal;
    font-size: 10pt;
    color: #008ECC;
    font-weight: bold;
    padding-bottom: 5px;
  }

  .sub-title {
    .tip {
      font-weight: normal;
      font-size: 10pt;
      color: #666;
      padding-left: 30px;
    }
  }

  .margin30 {
    margin-bottom: 30px;
  }

  .box-margin30 {
    margin: 30px 0;
  }

  .callerIdView {
    padding: 15px 0 0 10px;
    font-weight: bold;
    min-height: 30px;

  }

  .category-box {
    display: flex;
    .category-list {
      width: 33.33%;
      padding-right: 15px;

    }
  }

  #category-third {
    display: none;
  }

  .editor {
    height: 300px;
  }
</style>
