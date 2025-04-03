<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>직원 목록</h1>
        <div class="top-right-button-container">
          <div class="right-button">
            <b-button class="mb-2" size="lg" style="color:#fff;" variant="secondary" @click="regist()">직원 등록</b-button>
          </div>
          <b-button-group>
            <b-button style="color:#fff;" variant="danger" @click="deleteItem()">삭제</b-button>
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
             <span>기본설정</span> | <span class="pointer" @click="pageInit()">직원 관리</span>
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
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="mb-0  w-20 w-sm-150"></p>
                  <p class="w-button-box"></p>
                </div>
              </div>
            </b-card>
            <b-card class="header-pannel d-flex flex-row" no-body>
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <div
                  class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p class="mb-0  w-5 w-sm-50">번호</p>
                  <p class="mb-0 w-20 w-sm-150">아이디</p>
                  <p class="mb-0 w-20 w-sm-150">이름</p>
                  <p class="mb-0 w-20 w-sm-150">수신번호</p>
                  <p class="mb-0 w-20 w-sm-150">등록일</p>
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
                  <p class="mb-0 w-20 w-sm-150">{{data.uid}}</p>
                  <p class="mb-0 w-20 w-sm-150">{{data.name}}</p>
                  <p class="mb-0 w-20 w-sm-150">{{data.pcs}}</p>
                  <p class="mb-0 w-20 w-sm-150">{{data.insdate}}</p>
                  <p class="item-button-box">
                    <b-button class="mb-1 inner-button" size="sm" variant="outline-secondary"
                              @click="update(data.no)">
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

  </div>
</template>

<style lang="scss" scoped="true">
  .right-button {
    position: absolute;
    width: 220px;
    right: 110px;
  }

  .w-button-box {
    width: 230px;
  }

  .item-button-box {
    width: 230px;
    padding-left: 50px;
  }

  .eMembers {
    .extenMembers {
      padding-right: 10px;

    }
  }

</style>
<script>
  import {
    API_URL_MEMBER_MEMBERLIST,
    API_URL_MEMBER_MEMBERDELETE,
    CONFIG_HEADER_POST
  } from '../../api/urls';
  import {ko} from 'vuejs-datepicker/dist/locale'
  import Datepicker from "vuejs-datepicker";

  export default {
    name: "UserList",
    components: {
      datepicker: Datepicker,
    },
    data() {
      return {
        keepInit: false,
        search: "",
        items: [],
        selectedItems: [],
        page: 1,
        from: 0,
        to: 0,
        perPage: 10,
        total: 0,
        lastPage: 1,
        datas: [],
        pageSizes: [5, 10, 15, 20],
        searchOptions: [
          {id: 'name', label: '직원 이름'},
          {id: 'uid', label: '직원 아이디'},
          {id: 'pcs', label: '직원 수신번호'},
        ],
        searchKey: {},
        stDate: '',
        enDate: '',
        dateLang: ko,
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
      this.getData();


    },
    methods: {
      getData() {
        this.items = [];
        this.selectedItems = [];
        let params = this.queryParams();
        //console.log(params);
        this.$http.post(API_URL_MEMBER_MEMBERLIST,params, {headers: CONFIG_HEADER_POST}).then(res => {
          console.log(res.data);

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
              datas.push(data);
              i++;
            }
            this.items = datas;
            this.datas = datas;

        }).catch(function () {
          console.log("Promise Rejected");
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
          params.startDate =stDate;
        }
        if (this.enDate) {
          let endate = new Date(this.enDate);
          let month = ((endate.getMonth() + 1) < 10) ? '0' + (endate.getMonth() + 1) : (endate.getMonth() + 1);
          let day = (endate.getDate() < 10) ? '0' + endate.getDate() : endate.getDate();
          let enDate = endate.getFullYear() + '-' + month + '-' + day;
          params.endDate = enDate;
        }
        if (this.search) {
          params.cmd = this.searchKey.id;
          params.keyword= this.search;
        }
        params.limit = this.perPage;
        params.page= this.page;
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
      deleteItem() {
        if (this.selectedItems.length < 1) {
          let sparams = {
            message: '직원을 선택하세요'
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
            this.$http.post(API_URL_MEMBER_MEMBERDELETE, params, {headers: CONFIG_HEADER_POST}).then(res => {
                let sparams = {
                  type: 'alert',
                  message: '선택된 정보가 삭제 되었습니다',
                  doAction: () => {
                    this.getData();
                  }
                };
                this.$eventBus.$emit('modalOpen', sparams);

            })
          }
        };
        this.$eventBus.$emit('modalOpen', params);
      },
      pageInit() {
        this.page = 1;
        this.perPage = 10;
        this.search = "";
        this.items = [];
        this.selectedItems = [];
        this.searchKey = this.searchOptions[0];
        this.stDate = '';
        this.enDate = '';
        this.getData();
      }
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

