<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>건물정보 설정</h1>
      <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
             <span>기본설정</span> | <span>건물정보 설정</span>
          </b-nav>
       </span>
      <div class="top-right-button-container">

      </div>

    </b-colxx>
    <b-colxx xxs="12">
      <b-row class="search-box" style="width:100%;overflow-x:hidden;height:auto;">
        <div class="col-box-list">
          <div class="sub-title">
            건물정보
          </div>
          <div class="search-content">
            <div class="search-group-box">
              <ul>
                <li v-for="item,index in cateList1" :class="item.gclass" @click="setData(index,'f')">
                  {{item.name}}
                </li>
              </ul>
            </div>
            <div class="button-row">
              <b-button class="round-button" style="color:#fff;" @click="rankChage('f','up')"><i class="fas fa-angle-up"></i></b-button>
              <b-button class="round-button" style="color:#fff;" @click="rankChage('f','down')"><i class="fas fa-angle-down"></i></b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="primary" @click="cateCreate('f')">생성</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="secondary" @click="cateUpdate('f')">수정</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="danger" @click="cateDelete('f')">삭제</b-button>
            </div>
          </div>
        </div>
        <div class="col-box-wd">
          <div class="sub-title">
            층별정보
          </div>
          <div class="search-content">
            <div class="search-group-box">
              <ul>
                <li v-for="item,index in cateList2" :class="item.gclass" @click="setData(index,'s')">
                  {{item.name}}
                </li>
              </ul>
            </div>
            <div class="button-row">
              <b-button class="round-button" style="color:#fff;" @click="rankChage('s','up')"><i class="fas fa-angle-up"></i></b-button>
              <b-button class="round-button" style="color:#fff;" @click="rankChage('s','down')"><i class="fas fa-angle-down"></i></b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="primary" @click="cateCreate('s')">생성</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="secondary" @click="cateUpdate('s')">수정</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="danger" @click="cateDelete('s')">삭제</b-button>
            </div>
          </div>

        </div>
        <div class="col-box-sm">
          <div class="sub-title">
            층별상세
          </div>
          <div class="search-content">
            <div class="search-group-box">
              <ul>
                <li v-for="item,index in cateList3" :class="item.gclass" @click="setData(index,'t')">
                  {{item.name}}
                </li>
              </ul>
            </div>
            <div class="button-row">
              <b-button class="round-button" style="color:#fff;" @click="rankChage('t','up')"><i class="fas fa-angle-up"></i></b-button>
              <b-button class="round-button" style="color:#fff;" @click="rankChage('t','down')"><i class="fas fa-angle-down"></i></b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="primary" @click="cateCreate('t')">생성</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="secondary" @click="cateUpdate('t')">수정</b-button>
              <b-button class="mb-2" size="sm" style="color:#fff;" variant="danger" @click="cateDelete('t')">삭제</b-button>
            </div>


          </div>
        </div>
      </b-row>

    </b-colxx>


    <b-modal ref="modalHolidaybackdrop" :title="screenTitle"
             :hideFooter="true"
             :hide-backdrop="selectedHolidayBackdrop=='false'"
             :no-close-on-backdrop="selectedHolidayBackdrop=='false' || selectedHolidayBackdrop=='static'">
      <b-form  @submit.prevent="onValitadeFormSubmit"class="av-tooltip tooltip-label-right">
        <b-colxx xxs="12" class="box-margin30 data-regist">
          <b-row>
            <b-colxx sm="12">
              <b-form-group :label="fieldName" class="has-float-label error-l-100 margin30 required">
                <span></span>
                <b-form-input type="text" id="name" v-model="$v.name.$model"
                              :state="!$v.name.$error"/>
                <b-form-invalid-feedback v-if="!$v.name.required && submitFlag">{{fieldName}}을 입력하세요
                </b-form-invalid-feedback>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12" class="button-row">

              <b-button variant="secondary" style="color:#fff;" size="sm" @click="hideModal()" type="button">취소</b-button>
              <b-button variant="primary"  style="color:#fff;" size="sm" type="submit">확인</b-button>

            </b-colxx>

          </b-row>
        </b-colxx>

      </b-form>

    </b-modal>

  </b-row>
</template>
<style lang="scss" scoped="true">
  .margin30 {
    input {
      background: #fff;
    }
  }

  .right-button {
    position: absolute;
    right: 0;
  }
  .button-row {
    text-align:right;
    display:flex;
    position:relative;
  }
</style>
<script>

  import {
    API_URL_SETTING_CATEGORYLIST,
    API_URL_SETTING_CATEGORYUPDATE,
    API_URL_SETTING_CATEGORYINSERT,
    API_URL_SETTING_CATEGORYDELETE,
    API_URL_SETTING_CATEGORYRANK,
    CONFIG_HEADER_POST
  } from '../../api/urls';
  import {validationMixin} from "vuelidate";

  const {
    required,
  } = require("vuelidate/lib/validators");

  export default {
    data() {
      return {
        selectedHolidayBackdrop: 'true',
        screenLayoutShow: false,
        cateName1: '건물정보',
        cateName2: '층별정보',
        cateName3: '층별상세',
        registTitle: '',
        currentCategory: '',
        currentNo1: '',
        currentNo2: '',
        currentNo3: '',
        currentIndex1: '',
        currentIndex2: '',
        currentIndex3: '',
        screenTitle: '',
        name: '',
        fieldName: '',
        depth: 1,
        pno: 0,
        no: 0,
        cateList1: [],
        cateList2: [],
        cateList3: [],
        submitFlag:false,
        insertFlag:false,
      };
    },
    mixins: [validationMixin],
    validations: {
      name: {
        required
      }
    },
    created() {
      this.getData('');
    },
    methods: {
      getData(mode) {
        var params = {pno: this.pno, depth: this.depth};
        this.$http.post(API_URL_SETTING_CATEGORYLIST, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.computeData(res.data, this.depth, mode);

        })
      },
      computeData(response, depth, mode) {
        var obj = this;
        var item = {};
        console.log(response)
        switch (depth) {
          case 1:
            obj.cateList1 = [];
            for (var key in response.result) {
              item = response.result[key];
              if (mode == 'rank') {
                if (item.no == obj.currentNo1) {
                  item.gclass = 'active';
                  obj.currentIndex1 = key;

                } else {
                  item.gclass = '';
                }

              } else {
                item.gclass = '';
              }
              obj.cateList1.push(item);
            }
            if (mode != 'rank') {
              obj.currentIndex1 = '';
              obj.currentNo1 = '';
              obj.cateList2 = [];
              obj.currentIndex2 = '';
              obj.currentNo2 = '';
              obj.cateList3 = [];
              obj.currentIndex3 = '';
              obj.currentNo3 = '';
            }
            break;
          case 2:
            obj.cateList2 = [];
            for (var key in response.result) {
              item = response.result[key];
              if (mode == 'rank') {
                if (item.no == obj.currentNo2) {
                  item.gclass = 'active';
                  obj.currentIndex2 = key;

                } else {
                  item.gclass = '';
                }

              } else {
                item.gclass = '';
              }
              obj.cateList2.push(item);
            }
            if (mode != 'rank') {
              obj.currentIndex2 = '';
              obj.currentNo2 = '';
              obj.cateList3 = [];
              obj.currentIndex3 = '';
              obj.currentNo3 = '';
            }
            break;
          case 3:
            obj.cateList3 = [];
            for (var key in response.result) {
              item = response.result[key];
              if (mode == 'rank') {
                if (item.no == obj.currentNo3) {
                  item.gclass = 'active';
                  obj.currentIndex3 = key;

                } else {
                  item.gclass = '';
                }

              } else {
                item.gclass = '';
              }
              obj.cateList3.push(item);
            }
            if (mode != 'rank') {
              obj.currentIndex3 = '';
              obj.currentNo3 = '';
            }
            break;
        }
      },
      setData(index, cmd) {
        var dataList = [];
        switch (cmd) {
          case 'f':

            dataList = this.cateList1;
            if (this.currentNo1 == dataList[index].no) return;

            this.currentNo1 = dataList[index].no;
            this.currentIndex1 = index;
            this.getSelectData(this.currentNo1, 2);

            break;
          case 's':
            dataList = this.cateList2;
            if (this.currentNo2 == dataList[index].no) return;

            this.currentNo2 = dataList[index].no;
            this.currentIndex2 = index;
            this.getSelectData(this.currentNo2, 3);
            break;
          case 't':
            dataList = this.cateList3;
            if (this.currentNo3 == dataList[index].no) return;
            this.currentNo3 = dataList[index].no;
            this.currentIndex3 = index;

            break;
        }
        for (var k in dataList) {
          var item = {}
          item = dataList[k];
          if (k == index) {
            item.gclass = 'active';
          } else {
            item.gclass = '';
          }
          this.$set(dataList, k, item);
        }


      },
      getCateName() {
        switch (this.currentCategory) {
          case 'f':
            this.depth = 1;
            return this.cateName1;
            break;
          case 's':
            this.depth = 2;
            return this.cateName2;
            break;
          case 't':
            this.depth = 3;
            return this.cateName3;
            break;

        }

      },
      getSelectData(pno, depth) {

        var params = {pno: pno, depth: depth};
        this.$http.post(API_URL_SETTING_CATEGORYLIST, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.computeData(res.data, depth, 'no');
        });
      },
      cateCreate(cmd) {

        var flag = false;
        var catePreeName;
        switch (cmd) {
          case 'f':
            this.pno = 0;
            this.depth=1;
            break;
          case 's':
            if (!this.currentNo1) {
              flag = true;
              catePreeName = this.cateName1;
            } else {
              this.pno = this.currentNo1;
              this.depth=2;
            }
            break;
          case 't':
            if (!this.currentNo2) {
              flag = true;
              catePreeName = this.cateName2;
            } else {
              this.pno = this.currentNo2;
              this.depth=3;
            }
            break;
        }

        if (flag) {
          let params = {
            message: catePreeName + '를 선택하세요'
          };
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        this.currentCategory = cmd;
        let cateName = this.getCateName();
        this.name = '';
        this.no = 0;
        this.screenTitle = cateName + ' 생성';
        this.fieldName = cateName + '명';
        this.modalOpen();


      },
      cateUpdate(cmd) {
        this.currentCategory = cmd;
        let flag =false;
        let cateName = this.getCateName();
        let info = {};
        switch(cmd) {
          case 'f':
            if(!this.currentNo1) {
              flag =true;
            } else {
              info = this.cateList1[this.currentIndex1];
            }
            break;
          case 's':
            if(!this.currentNo2) {
              flag =true;
            } else {
              info = this.cateList2[this.currentIndex2];
            }
            break;
          case 't':
            if(!this.currentNo3) {
              flag =true;
            } else {
              info = this.cateList3[this.currentIndex3];
            }
            break;
        }
        if(flag) {
          let params = {
            message: cateName+'를 선택하세요'
          };
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        this.name = info.name;
        this.no = info.no;
        this.screenTitle = cateName+' 수정';
        this.fieldName = cateName+'명';
        this.modalOpen();

      },
      updateResult() {
        switch(this.currentCategory) {
          case 'f':
            var info = this.cateList1[this.currentIndex1];
            info.name = this.name;
            this.$set(this.cateList1,info,this.currentIndex1);
            break;
          case 's':
            var info = this.cateList2[this.currentIndex2];
            info.name = this.name;
            this.$set(this.cateList2,info,this.currentIndex2);

            break;
          case 't':
            var info = this.cateList3[this.currentIndex3];
            info.name = this.name;
            this.$set(this.cateList3,info,this.currentIndex3);

            break;
        }
        this.no = 0;
      },

      modalOpen() {
        this.submitFlag = false;
        this.$refs['modalHolidaybackdrop'].show();
      },
      hideModal() {
        this.$refs['modalHolidaybackdrop'].hide();
      },
      onValitadeFormSubmit(e) {
        if (this.insertFlag) return;
        this.submitFlag = true;
        this.$v.$touch();
        if (!this.$v.$anyError) {
          this.insertFlag = true;
          this.insertData();
        } else {
          for (let id in this.$v.$params) {
            if (!this.$v[id].required || this.$v[id].$error) {
              document.getElementById(id).focus();
              return;
            }
          }
        }
      },
      insertData() {

        let params = {
          no: this.no,
          pno: this.pno,
          depth:this.depth,
          name:this.name
        };
        let url = (this.no>0)?API_URL_SETTING_CATEGORYUPDATE:API_URL_SETTING_CATEGORYINSERT;
        this.$http.post(url, params, {headers: CONFIG_HEADER_POST}).then(res => {
            //console.log(res);
            this.hideModal()
            this.insertFlag = false;
            if(this.no>0) {
              this.updateResult();
            } else {
              this.getData('');
            }

        })
      },

      deleteResult() {
        switch(this.currentCategory) {
          case 'f':
            this.cateList1.splice(this.currentIndex1,1);
            this.currentIndex1 = '';
            this.currentNo1 = '';

            this.cateList2 = [];
            this.currentIndex2 = '';
            this.currentNo2 = '';

            this.cateList3 = [];
            this.currentIndex3 = '';
            this.currentNo3 = '';
            break;
          case 's':
            this.cateList2.splice(this.currentIndex2,1);
            this.currentIndex2 = '';
            this.currentNo2 = '';

            this.cateList3 = [];
            this.currentIndex3 = '';
            this.currentNo3 = '';
            break;
          case 't':
            this.cateList3.splice(this.currentIndex3,1);
            this.currentIndex3 = '';
            this.currentNo3 = '';
            break;
        }
        this.no = 0;
      },
      cateDelete(cmd) {
        this.currentCategory = cmd;
        var flag =false;
        var cateName = this.getCateName();
        var no;
        var depth;
        switch(cmd) {
          case 'f':
            if(!this.currentNo1) {
              flag =true;
            } else {
              no = this.currentNo1;
              depth = 1;
            }
            break;
          case 's':
            if(!this.currentNo2) {
              flag =true;
            } else {
              no = this.currentNo2;
              depth = 2;

            }
            break;
          case 't':
            if(!this.currentNo3) {
              flag =true;
            } else {
              no = this.currentNo3;
              depth = 3;
            }
            break;
        }
        if(flag) {
          let params = {
            message: cateName+'를 선택하세요'
          };
          this.$eventBus.$emit('modalOpen', params);
          return;
        }
        this.deleteData(no,depth);

      },
      rankChage(cmd,mode) {
        this.currentCategory = cmd;
        var flag =false;
        var cateName = this.getCateName();
        var currentNo,currentRank,targetNo,targetRank;
        switch(cmd) {
          case 'f':
            if(!this.currentNo1) {
              flag =true;
            } else {

              if(mode=='up') {
                if(this.currentIndex1<1) {
                  return;
                }
                var targetIndex = this.currentIndex1-1;
                var cinfo = this.cateList1[this.currentIndex1];
                var tinfo = this.cateList1[targetIndex];
              } else {
                if(this.currentIndex1>=parseInt(this.cateList1.length)-1) {
                  return;
                }
                var targetIndex = parseInt(this.currentIndex1)+1;
                var cinfo = this.cateList1[this.currentIndex1];
                var tinfo = this.cateList1[targetIndex];
              }
              this.pno = 0;
            }
            break;
          case 's':
            if(!this.currentNo2) {
              flag =true;
            } else {
              if(mode=='up') {
                if(this.currentIndex2<1) {
                  return;
                }
                var targetIndex = this.currentIndex2-1;
                var cinfo = this.cateList2[this.currentIndex2];
                var tinfo = this.cateList2[targetIndex];
              } else {
                if(this.currentIndex2>=parseInt(this.cateList2.length)-1) {
                  return;
                }
                var targetIndex = parseInt(this.currentIndex2)+1;
                var cinfo = this.cateList2[this.currentIndex2];
                var tinfo = this.cateList2[targetIndex];
              }
              this.pno = this.currentNo1;

            }
            break;
          case 't':
            if(!this.currentNo3) {
              flag =true;
            } else {
              if(mode=='up') {
                if(this.currentIndex3<1) {
                  return;
                }
                var targetIndex = this.currentIndex3-1;
                var cinfo = this.cateList3[this.currentIndex3];
                var tinfo = this.cateList3[targetIndex];
              } else {
                if(this.currentIndex3>=parseInt(this.cateList3.length)-1) {
                  return;
                }
                var targetIndex = parseInt(this.currentIndex3)+1;
                var cinfo = this.cateList3[this.currentIndex3];
                var tinfo = this.cateList3[targetIndex];
              }
              this.pno = this.currentNo2;

            }
            break;
        }
        if(flag) {
          let params = {
            message: cateName+'를 선택하세요'
          };
          this.$eventBus.$emit('modalOpen', params);

        }
        currentNo = cinfo.no;
        currentRank = tinfo.rank;
        targetNo = tinfo.no;
        targetRank = cinfo.rank;
        this.updateRank(currentNo,currentRank,targetNo,targetRank);
      },
      updateRank(currentNo,currentRank,targetNo,targetRank) {
        var obj = this;
        var params = {cno:currentNo,crank:currentRank,tno:targetNo,trank:targetRank};
        this.$http.post(API_URL_SETTING_CATEGORYRANK, params, {headers: CONFIG_HEADER_POST}).then(res => {
          this.getData('rank');
        })

      },
      deleteData(no,depth) {
        if(depth==3) {
          if(this.cateList3.length==1) {
            let params = {
              message: '층별상세 정보는 최소 1개 이상이 존재해야 합니다'
            };
            this.$eventBus.$emit('modalOpen', params);
            return;
          }
        }
        let params = {
          type: 'confirm',
          message: '해당정보에 속하는 발신번호 정보도 모두 삭제됩니다<br>선택된 정보를 삭제 하시겠습니까?',
          doAction: () => {
            let params = {
              no: no,
              depth: depth,
            };
            this.$http.post(API_URL_SETTING_CATEGORYDELETE, params, {headers: CONFIG_HEADER_POST}).then(res => {
              this.deleteResult();
            })
          }
        };
        this.$eventBus.$emit('modalOpen', params);
      },
    }
  }
</script>
<style lang="scss" scoped="true">


</style>
