<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>발신번호 목록</h1>
        <div class="top-right-button-container">
          <div class="right-button">
            <b-button class="mb-2" size="lg" style="color:#fff;" variant="secondary" @click="registData()">발신번호 등록</b-button>
          </div>
          <b-button-group>
            <b-button variant="danger" style="color:#fff;" @click="deleteItem()">삭제</b-button>
            <b-button @click="selectAll(true)" style="padding:0 0 7px 5px;width:60px;" variant="primary">
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
             <span>기본설정</span> | <span class="pointer" @click="pageInit()">발신번호 목록</span>
          </b-nav>
        </span>
        <form @submit.prevent="searchForm" novalidate>
          <button class="hiddenButton" type="submit"></button>

          <div class="mb-2 mt-2">
            <b-collapse id="displayOptions" class="d-md-block">
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
              <div class="float-md-right pt-1" style="position:relative;top:10px;">
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
        </form>
        <div class="separator mb-5"/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-colxx xxs="12" class="mb-3 table-header">
            <b-card class="table-header-border d-flex flex-row" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0  w-5 w-sm-50"></p>
                  <p class="mb-0  w-10 w-sm-100"></p>
                  <p class="mb-0  w-20 w-sm-200"></p>
                  <p class="mb-0  w-15 w-sm-150"></p>
                  <p class="mb-0  w-25 w-sm-250"></p>
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
                  <p class="mb-0 w-10 w-sm-100">발신번호</p>
                  <p class="mb-0 w-20 w-sm-200">위치정보</p>
                  <p class="mb-0 w-20 w-sm-150">건물정보</p>
                  <p class="mb-0 w-20 w-sm-250">내용</p>
                  <p class="mb-0 w-15 w-sm-150">좌표</p>
                  <p class="w-button-box"></p>
                </div>
              </div>
            </b-card>
          </b-colxx>
          <b-colxx xxs="12" class="mb-3 table-body" v-for="(data,index) in datas" :key="index" :id="data.no">
            <b-card :class="{'body-pannel d-flex flex-row':true,'active' : selectedItems.includes(data.no)}" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0 w-5 w-sm-50">{{data.number}}</p>
                  <p class="mb-0 w-10 w-sm-100">{{data.tel}}</p>
                  <p class="mb-0 w-20 w-sm-200">{{data.name}}</p>
                  <p class="mb-0 w-20 w-sm-150" v-html="data.cateName"></p>
                  <p class="mb-0 w-20 w-sm-250 content-line" @click="showContent(index)">{{data.stringContents}}</p>
                  <p class="mb-0 w-15 w-sm-150">{{data.lat}}<br>{{data.lng}}</p>
                  <p class="item-button-box">
                    <b-button class="mb-1 inner-button" size="sm" variant="outline-secondary"
                              @click="updateData(data.no)">
                      수정
                    </b-button>
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
    <b-modal  size="lg" ref="modalHolidaybackdrop" :title="'내용상세보기'"
             :hide-backdrop="selectedHolidayBackdrop=='false'"
             :no-close-on-backdrop="selectedHolidayBackdrop=='false' || selectedHolidayBackdrop=='static'">
      <b-colxx xxs="12" class="box-margin30 data-regist">
        <b-row>
          <b-colxx sm="12">
            <div class="content-box" v-html="detailContents"></div>
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
    width: 200px;
    right: 110px;
  }
  .content-box {
    line-height:140%;
    p {
      line-height:140%;
    }
    max-width:100%;
    height:400px;
    overflow-y:auto;
    overflow-x:hidden;
    word-break:break-all;

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

  .hiddenButton {
    opacity: 0;
  }

  .w-button-box {
    width: 150px;
  }

  .item-button-box {
    width: 150px;
    padding-left: 20px;
  }
</style>
<script>
  import {API_URL_SETTING_SENDNUMBER_LIST, API_URL_SETTING_CATEGORYLIST,API_URL_SETTING_SENDNUMBER_DELETE, CONFIG_HEADER_POST} from '../../../api/urls';
  import {ko} from 'vuejs-datepicker/dist/locale'
  import Datepicker from "vuejs-datepicker";
  import {util} from '../../../utils/index'

  export default {
    name: "sendnumberList",
    components: {
      datepicker: Datepicker,
    },
    data() {
      return {
        keepInit: false,
        search: "",
        items: [],
        selectedHolidayBackdrop: 'true',
        selectedItems: [],
        page: 1,
        from: 0,
        to: 0,
        perPage: 10,
        total: 0,
        categoryList: {},
        lastPage: 1,
        datas: [],
        pageSizes: [5, 10, 15, 20],
        searchOptions: [{id: 'tel', label: '발신번호'}, {
          id: 'name',
          label: '위치정보'
        }],
        searchKey: {},
        dateLang: ko,
        detailContents: '',
        cate1: '',
        cate1Text: '건물정보를 선택하세요',
        cate2Text: '층별정보를 선택하세요',
        cate3Text: '층별상세정보를 선택하세요',
        cate2: '',
        cate3: '',
        cateView: false,
        cateList1: [],
        cateList2: [],
        cateList3: [],
      };
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
            categoryList.unshift({id: '', label: '건물정보를 선택하세요'})
            obj.cateList1 = categoryList;
            obj.cate1 = '';
            obj.cate2 = '';
            this.cate1Text = '건물정보를 선택하세요';
            this.cate2Text = '층별정보를 선택하세요';

            obj.cateList2 = [{id:'',label:'층별정보를 선택하세요'}];
            obj.cate3 = '';
            obj.cateView = false;
            obj.cateList3 = [];
            break;
          case 2:
            categoryList.unshift({id: '', label: '층별정보를 선택하세요'})
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
              categoryList.unshift({id: '', label: '층별상세정보를 선택하세요'})
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
          this.cate2Text = '층별정보를 선택하세요';

          this.cateList2 = [{id: '', label: '층별정보를 선택하세요'}];
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
      searchForm() {
        this.keywordSearch();
      },
      getData() {
        let params = this.queryParams();
        console.log(params);
        this.$http.post(API_URL_SETTING_SENDNUMBER_LIST, params, {headers: CONFIG_HEADER_POST}).then(res => {
          console.log(res.data)

          if (res.data.categorys.length > 0) {
            for (var key in res.data.categorys) {
              var item = res.data.categorys[key]
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
            data.stringContents = util.strip_tags(data.contents);
            let categorys = data.category.split(',');
            let categoryResult = [];
            for (let cateItem of categorys) {
              if (cateItem && this.categoryList[cateItem]) {
                categoryResult.push(this.categoryList[cateItem]);
              }
            }
            data.cateName = categoryResult.join(' > ');
            datas.push(data);
            i++;
          }
          this.datas = datas;
          this.items = datas;


          //console.log(this.datas)

        });

      },
      hideModal() {
        this.$refs['modalHolidaybackdrop'].hide();
      },
      queryParams() {
        let params = {};
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
      registData() {
        this.$router.push('/setting/sendnumber/regist/new');
      },
      updateData(id) {
        this.$router.push('/setting/sendnumber/regist/' + id);
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

        this.selectedItems = [];
        this.searchKey = this.searchOptions[0];
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
      showContent(index) {
        this.detailContents = this.datas[index].contents;
        this.$refs['modalHolidaybackdrop'].show();
      },
      deleteItem() {
        if (this.selectedItems.length < 1) {
          let sparams = {
            message: '발신번호를 선택하세요'
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
            this.$http.post(API_URL_SETTING_SENDNUMBER_DELETE, JSON.stringify(params), {headers: CONFIG_HEADER_POST}).then(res => {
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


    },
    activated() {
      if (this.$route.params.mode == 'api' && this.keepInit) {
        this.pageInit();
      } else if (this.$route.params.mode == 'update') {
        this.getData();
      }
      this.keepInit = true;

    },


  }
</script>

