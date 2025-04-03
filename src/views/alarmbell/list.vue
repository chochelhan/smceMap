<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>비상벨 목록</h1>
        <div class="top-right-button-container">
          <div class="right-button">
          </div>
          <b-button-group>
            <b-button style="color:#fff;" variant="danger" @click="deleteItem()">삭제</b-button>
            <b-button  @click="selectAll(true)" style="padding:0 0 7px 5px;width:60px;" variant="primary">
              <label
                class="custom-control custom-checkbox pl-4 mb-0 d-inline-block"
                slot="button-content"
              >
                <input
                  class="custom-control-input"
                  type="checkbox"
                  :checked="isSelectedAll"
                  v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}"
                  @shortkey="keymap"
                />
                <span
                  :class="{
                'custom-control-label' :true,
                'indeterminate' : isAnyItemSelected
                }"
                >&nbsp;</span>
              </label>
            </b-button>
          </b-button-group>
        </div>
        <span class="sub-title">
           <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">


          </b-nav>
        </span>
        <form @submit.prevent="keywordSearch" novalidate>
          <button class="hiddenButton" type="submit"></button>

          <div class="mb-2 mt-2">
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block pt-1 search-box-date">
                <datepicker
                  :bootstrap-styling="true"
                  v-model="stDate"
                  :language="dateLang"
                  :placeholder="'등록일: 시작'"
                  :format="'yyyy-MM-dd'"
                ></datepicker>
              </div>
              <div class="d-block d-md-inline-block pt-1 search-box-date">
                <datepicker
                  :bootstrap-styling="true"
                  :format="'yyyy-MM-dd'"
                  :language="dateLang"
                  :placeholder="'등록일: 종료'"
                  v-model="enDate"
                ></datepicker>
              </div>
              <div class="d-block d-md-inline-block pt-1" style="width:20px;">
              </div>
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="cate1"
                  :text="cate1Text"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xm"
                >
                  <b-dropdown-item
                    v-for="(item,index) in cateList1"
                    :key="index"
                    @click="changeCate1(item)">{{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="cate2"
                  :text="cate2Text"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xm"
                >
                  <b-dropdown-item
                    v-for="(item,index) in cateList2"
                    :key="index"
                    @click="changeCate2(item)">{{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="cate3"
                  :text="cate3Text"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xm"
                >
                  <b-dropdown-item
                    v-for="(item,index) in cateList3"
                    :key="index"
                    @click="changeCate3(item)">{{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <div class="d-block d-md-inline-block pt-1" style="width:20px;">
              </div>
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="gcheck"
                  :text="gcheckText"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xm"
                >
                  <b-dropdown-item
                    v-for="(item,index) in gcheckList"
                    :key="index"
                    @click="changeGcheck(item)">{{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <div class="d-block d-md-inline-block pt-1 search-box-dropdown">

                <b-dropdown
                  id="ddown1"
                  :text="searchKey.label"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xm"
                >
                  <b-dropdown-item
                    v-for="(order,index) in searchOptions"
                    :key="index"
                    @click="changeSearchKey(order)">{{ order.label }}
                  </b-dropdown-item>
                </b-dropdown>
                <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                  <b-input :placeholder="$t('menu.search')" v-model="search"/>
                  <span @click="keywordSearch()"></span>
                </div>
                <div class=" float-md-left align-top">
                  <b-button class="mb-1 inner-button" size="sm" style="color:#fff;border:none;" variant="primary"
                            @click="pageInit()">
                    전체보기
                  </b-button>
                </div>
              </div>
            </b-collapse>
          </div>
        </form>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <div class="mb-2 mt-2">
          <b-collapse class="d-md-block">
            <div class="float-md-right pt-1" style="position:relative;bottom:10px;">
              <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
              <b-dropdown
                id="ddown2"
                right
                :text="`${perPage}`"
                variant="outline-dark"
                class="d-inline-block"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(size,index) in pageSizes"
                  :key="index"
                  @click="changePageSize(size)"
                >{{ size }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </b-collapse>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <div class="separator mb-5"/>

        <b-row>
          <b-colxx xxs="12" class="mb-3 table-header">
            <b-card class="table-header-border d-flex flex-row" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0  w-5 w-sm-50"></p>
                  <p class="mb-0  w-15 w-sm-150"></p>
                  <p class="mb-0  w-15 w-sm-150"></p>
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="mb-0  w-15 w-sm-150"></p>
                  <p class="mb-0  w-15 w-sm-150"></p>
                  <p class="w-button-box"></p>
                </div>
              </div>
            </b-card>
            <b-card class="header-pannel d-flex flex-row" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0  w-5 w-sm-50">번호</p>
                  <p class="mb-0 w-15 w-sm-150">확인여부</p>
                  <p class="mb-0 w-15 w-sm-150">발신번호</p>
                  <p class="mb-0 w-20 w-sm-150">건물정보</p>
                  <p class="mb-0 w-20 w-sm-150">위치정보</p>
                  <p class="mb-0 w-20 w-sm-150">메세지</p>
                  <p class="mb-0 w-15 w-sm-150">수신번호</p>
                  <p class="mb-0 w-15 w-sm-150">등록일</p>
                  <p class="w-button-box"></p>
                </div>
              </div>
            </b-card>
          </b-colxx>
          <b-colxx xxs="12" class="mb-3 table-body" v-for="(data,index) in datas" :key="index" :id="data.no">
            <b-card  :class="{'body-pannel d-flex flex-row':true,'active' : selectedItems.includes(data.no)}" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0 w-5 w-sm-50">{{data.number}}</p>
                  <p class="mb-0 w-15 w-sm-150">
                    <span v-if="data.gcheck=='yes'">확인</span>
                    <span v-else style='color:#f00;'>미확인</span>

                  </p>
                  <p class="mb-0 w-15 w-sm-150">{{data.msgcode}}</p>

                  <p class="mb-0 w-20 w-sm-150">{{data.categoryName}}</p>
                  <p class="mb-0 w-20 w-sm-150">{{data.name}}</p>
                  <!--p class="mb-0 w-20 w-sm-150 data-img" @click="showView(index)">{{data.contents}}</p-->
                  <p class="mb-0 w-20 w-sm-150 data-img" @click="showView(index)">{{data.message}}</p>
                  <p class="mb-0 w-15 w-sm-150" style="text-align:center;">
                    {{data.receiver}}<br>
                    {{data.memberName}} <span v-if="data.uid">({{data.uid}})</span>
                  </p>
                  <p class="mb-0 w-15 w-sm-150">{{data.insdate}}</p>
                  <p class="item-button-box">
                    <span>
                        <b-form-checkbox :checked="selectedItems.includes(data.no)"
                                         class="itemCheck mb-0" @change="itemChecked(data)"></b-form-checkbox>
                      </span>
                  </p>
                </div>
              </div>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx xxs="12" v-if="lastPage>0">
            <b-pagination-nav
              :number-of-pages="lastPage"
              :link-gen="linkGen"
              :value="page"
              @change="(a)=>changePage(a)"
              :per-page="perPage"
              align="center"
            >
              <template v-slot:next-text>
                <i class="simple-icon-arrow-right"/>
              </template>
              <template v-slot:prev-text>
                <i class="simple-icon-arrow-left"/>
              </template>
              <template v-slot:first-text>
                <i class="simple-icon-control-start"/>
              </template>
              <template v-slot:last-text>
                <i class="simple-icon-control-end"/>
              </template>
            </b-pagination-nav>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
    <b-modal size="lg" ref="modalHolidaybackdrop" :title="'알림내용 상세보기'"
             :hide-backdrop="selectedHolidayBackdrop=='false'"
             :no-close-on-backdrop="selectedHolidayBackdrop=='false' || selectedHolidayBackdrop=='static'">
      <b-colxx xxs="12" class="box-margin30 data-regist">
        <b-row>
          <b-colxx sm="12">
            <div class="content-box">
              <!--h3 style='line-height:100%;margin-bottom:10px;'>알림내용</h3>
              <div class="msg-content" v-html="infoContents">
              </div-->
              <h3 style='line-height:100%;margin:20px 0 10px 0'>메세지</h3>
              <div class="msg-content" v-html="infoMessage">
              </div>
            </div>
          </b-colxx>
        </b-row>
      </b-colxx>
      <template slot="modal-footer">
        <b-button variant="secondary" style="color:#fff;" @click="hideModal()">닫기</b-button>
      </template>
    </b-modal>

  </div>
</template>

<style lang="scss" scoped="true">
  .right-button {
    position: absolute;
    width: 220px;
    right: 110px;
  }

  .w-button-box {
    width: 90px;
  }

  .msg-content {
    padding-top: 5px;
    height: 200px;
    min-height: 200px;
    max-height: 200px;
    line-height: 150%;
    overflow-y: auto;
    border: solid 1px #888;
    padding: 10px;
    p {
      line-height: 120%;
    }
  }

  .item-button-box {
    width: 90px;
    padding-left: 50px;
  }

  .eMembers {
    .extenMembers {
      padding-right: 10px;

    }
  }

  .data-img {
    text-decoration: underline;
    cursor: pointer;
    text-align: left;
    padding: 5px 0 5px 10px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

</style>
<script>
  import {
    API_URL_BELL_LIST,
    API_URL_SETTING_CATEGORYLIST,
    API_URL_BELL_DELETE,
    CONFIG_HEADER_POST
  } from '../../api/urls';
  import {ko} from 'vuejs-datepicker/dist/locale'
  import Datepicker from "vuejs-datepicker";
  import {util} from '../../utils/index'

  export default {
    name: "UserList",
    components: {
      datepicker: Datepicker,
    },
    computed: {
      isSelectedAll() {
        return this.selectedItems.length >= this.items.length;
      },
      isAnyItemSelected() {
        return (
          this.selectedItems.length > 0 &&
          this.selectedItems.length < this.items.length
        );
      }
    },
    data() {
      return {
        items: [],
        selectedHolidayBackdrop: 'true',
        selectedItems: [],
        search: "",
        categoryList: {},
        page: 1,
        from: 0,
        to: 0,
        perPage: 10,
        total: 0,
        lastPage: 1,
        datas: [],
        pageSizes: [5, 10, 15, 20],
        searchOptions: [
          {id: 'name', label: '위치정보'},
          {id: 'tel', label: '발신번호'},
          {id: 'receiver', label: '수신번호'},
        ],
        infoContents: '',
        infoMessage: '',
        searchKey: {},
        stDate: '',
        enDate: '',
        dateLang: ko,
        cate1: '',
        cate1Text: '건물정보 선택',
        cate2Text: '층별정보 선택',
        cate3Text: '층별상세정보 선택',
        cate2: '',
        cate3: '',
        cateView: false,
        cateList1: [],
        cateList2: [],
        cateList3: [],
        gcheckText: '확인여부',
        gcheck: '',

        gcheckList: [
          {id: '', label: '확인여부'},
          {id: 'yes', label: '확인'},
          {id: 'no', label: '미확인'},
        ]
      };
    },
    watch: {
      stDate(val) {
        if (val) {
          if (this.enDate) {
            let stdate = new Date(val);
            let endate = new Date(this.enDate);
            let stTime = stdate.getTime();
            let enTime = endate.getTime();
            if (stTime > enTime) {
              let sparams = {
                message: '검색 시작일이 종료일보다 큽니다',
                doAction: () => {
                  this.stDate = '';
                }
              };
              this.$eventBus.$emit('modalOpen', sparams);
            }
          }
        }

      },
      enDate(val) {
        if (val) {
          if (this.enDate) {
            let stdate = new Date(this.stDate);
            let endate = new Date(val);
            let stTime = stdate.getTime();
            let enTime = endate.getTime();
            if (stTime > enTime) {
              let sparams = {
                message: '검색 시작일이 종료일보다 큽니다',
                doAction: () => {
                  this.enDate = '';
                }
              };
              this.$eventBus.$emit('modalOpen', sparams);
            }
          }
        }

      }
    },

    created() {
      this.searchKey = this.searchOptions[0];
      this.getCateData(0, 1);
      this.getData();


    },
    methods: {
      getCateData(pno, depth) {

        var params = {pno: pno, depth: depth};
        this.$http.post(API_URL_SETTING_CATEGORYLIST, params, {headers: CONFIG_HEADER_POST}).then(res => {

          this.setCategory(res.data.result, depth)
        });
      },
      setCategory(datas, depth) {
        let obj = this;
        let categoryList = [];
        if (datas) {
          for (let item of datas) {
            let option = {id: item.no, label: item.name}
            categoryList.push(option)
          }
        }
        switch (depth) {
          case 1:
            categoryList.unshift({id: '', label: '건물정보 선택'})
            obj.cateList1 = categoryList;
            obj.cate1 = '';
            obj.cate2 = '';
            this.cate1Text = '건물정보 선택';
            this.cate2Text = '층별정보 선택';

            obj.cateList2 = [{id: '', label: '층별정보 선택'}];
            obj.cate3 = '';
            obj.cateView = false;
            obj.cateList3 = [];
            break;
          case 2:
            categoryList.unshift({id: '', label: '층별정보 선택'})
            obj.cateList2 = categoryList;
            obj.cate2 = '';
            obj.cate3 = '';
            obj.cateView = false;
            obj.cateList3 = [];
            break;
          case 3:
            if (categoryList.length > 0) {
              obj.cateView = true;
              obj.cate3 = '';
              categoryList.unshift({id: '', label: '층별상세정보 선택'})
              obj.cateList3 = categoryList;
            } else {
              obj.cateView = false;
              obj.cate3 = '';
            }


            break;
        }
      },
      changeCate1(item) {
        this.cate1Text = item.label;
        this.cate1 = item.id;
        if (item.id) {
          this.getCateData(item.id, 2);
        } else {
          this.cate1 = '';
          this.cate2 = '';
          this.cate2Text = '층별정보 선택';

          this.cateList2 = [{id: '', label: '층별정보 선택'}];
          this.cate3 = '';
          this.cateView = false;
          this.cateList3 = [];
        }

      },
      changeCate2(item) {
        this.cate2Text = item.label;
        this.cate2 = item.id;
        if (item.id) {
          this.getCateData(item.id, 3);
        } else {
          this.cate2 = '';
          this.cate3 = '';
          this.cateView = false;
          this.cateList3 = [];
        }

      },
      changeCate3(item) {
        this.cate3Text = item.label;
        this.cate3 = item.id;

      },
      changeGcheck(item) {
        this.gcheckText = item.label;
        this.gcheck = item.id;
      },
      getData() {
        let params = this.queryParams();
        //console.log(params);
        this.$http.post(API_URL_BELL_LIST, params, {headers: CONFIG_HEADER_POST}).then(res => {

          console.log(res.data)
          if (res.data.categorys.length > 0) {
            for (let item  of res.data.categorys) {
              this.categoryList[item.no] = item.name;
            }
          }
          let datas = [];
          this.total = res.data.result.total;
          this.from = this.total - ((this.page - 1) * this.perPage);
          this.to = 1 + this.from - this.perPage;
          if (this.to < 1) this.to = 1;
          let i = 0;
          this.lastPage = Math.ceil(this.total / this.perPage);
          for (let data of res.data.result.dataList) {
            data.number = this.from - i;
            let date = data.rdate;
            let regdate = date.replace('T', ' ').replace('.000+0000', '');
            data.insdate = regdate;

            if (data.content) {
              data.message = util.strip_tags(data.content);
            } else data.message = '';
            if (data.dataContents) {
              data.contents = util.strip_tags(data.dataContents);
            } else data.contents = '';

            datas.push(data);
            i++;
          }
          this.datas = datas;
          this.items = datas;
          //}).catch(function () {
          //console.log("Promise Rejected");
        });

      },
      queryParams() {
        String.prototype.zf = function (len) {
          return "0".string(len - this.length) + this;
        };
        let params = {};
        if (this.stDate) {
          let stdate = new Date(this.stDate);
          let month = ((stdate.getMonth() + 1) < 10) ? '0' + (stdate.getMonth() + 1) : (stdate.getMonth() + 1);
          let day = (stdate.getDate() < 10) ? '0' + stdate.getDate() : stdate.getDate();
          let stDate = stdate.getFullYear() + '-' + month + '-' + day;
          params.stdate = stDate;
        }
        if (this.enDate) {
          let endate = new Date(this.enDate);
          let month = ((endate.getMonth() + 1) < 10) ? '0' + (endate.getMonth() + 1) : (endate.getMonth() + 1);
          let day = (endate.getDate() < 10) ? '0' + endate.getDate() : endate.getDate();
          let enDate = endate.getFullYear() + '-' + month + '-' + day;
          params.endate = enDate;
        }
        params.gcheck = this.gcheck;

        if (this.search) {

          //String cate1 = msgdata.getCate1();
          //String cate2 = msgdata.getCate2();
          //String cate3 = msgdata.getCate3();
          params.cmd = this.searchKey.id;
          params.keyword = this.search;
        }
        params.cate1 = (this.cate1)?this.cate1:'';
        params.cate2 = (this.cate2)?this.cate2:'';
        params.cate3 = (this.cate3)?this.cate3:'';


        params.page = this.page;
        params.limit = this.perPage;
        return params;
      },
      regist() {
        this.$router.push('/member/regist/new');
      },
      update(id) {
        this.$router.push('/member/regist/' + id);
      },
      changeSearchKey(searchKey) {
        this.searchKey = searchKey;
      },


      changePage(page) {
        this.page = page;
        this.getData();
      },
      linkGen(pageNum) {
        return "#page-" + pageNum;
      },
      changePageSize(perPage) {
        this.perPage = perPage;
        this.page = 1;
        this.getData();
      },
      keywordSearch() {
        this.page = 1;
        this.getData();
      },
      getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1;
      },
      pageInit() {
        this.page = 1;
        this.perPage = 10;
        this.search = "";
        this.items = [];
        this.cate1 = '';
        this.cate2 = '';
        this.cate3 = '';
        this.cate1Text = '건물정보를 선택하세요';
        this.cate2Text = '층별정보를 선택하세요';
        this.cateList2 = [{id:'',label:'층별정보를 선택하세요'}];
        this.cate3 = '';
        this.cateView = false;
        this.cateList3 = [];
        this.gcheck='';
        this.gcheckText= '확인여부';
        this.selectedItems = [];
        this.searchKey = this.searchOptions[0];
        this.stDate='';
        this.enDate = '';
        this.getData();
      },
      onRowClass(dataItem, index) {
        if (this.selectedItems.includes(dataItem.no)) {
          return "selected";
        }
        return "";
      },
      keymap(event) {
        switch (event.srcKey) {
          case "select":
            this.selectAll(false);
            break;
          case "undo":
            this.selectedItems = [];
            break;
        }
      },
      itemChecked(dataItem) {
        const itemId = dataItem.no;
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
      },
      selectAll(isToggle) {
        if (this.selectedItems.length >= this.items.length) {
          if (isToggle) this.selectedItems = [];
        } else {
          this.selectedItems = this.items.map(x => x.no);
        }
      },
      getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1;
      },
      showView(index) {
        var info = this.datas[index];
        this.$refs['modalHolidaybackdrop'].show();
        this.infoContents = info.dataContents;
        this.infoMessage = info.content;
      },
      hideModal() {
        this.$refs['modalHolidaybackdrop'].hide();
      },
      deleteItem() {
        if (this.selectedItems.length < 1) {
          let sparams = {
            message: '대상을 선택하세요'
          };
          this.$eventBus.$emit('modalOpen', sparams);
          return;
        }
        let nosList= [];
        for(let  no of this.selectedItems) {
          nosList.push({no:no})
        }
        let params = {
          type: 'confirm',
          message: '선택된 정보를  삭제 하시겠습니까?',
          doAction: () => {
            let params = {
              nos: nosList
            };
            this.$http.post(API_URL_BELL_DELETE, JSON.stringify(params), {headers: CONFIG_HEADER_POST}).then(res => {
              if (res.data.result == 'succ') {
                let sparams = {
                  type: 'alert',
                  message: '선택된 정보가 삭제 되었습니다',
                  doAction: () => {
                    this.getData();
                  }
                };
                this.$eventBus.$emit('modalOpen', sparams);
              }
            })
          }
        };
        this.$eventBus.$emit('modalOpen', params);
      },
    }


  }
</script>

