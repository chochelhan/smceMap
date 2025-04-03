const state = {
  areaSaveDataList: {},
  areaEtcDataList: {},
  gUseList: {}
}

const getters = {
  getAreaSaveDataList: state => state.areaSaveDataList,
  getAreaEtcDataList: state =>state.areaEtcDataList,
  getGUseList: state => state.gUseList
}

const mutations = {
  initMapData(state, result) {
    state.areaSaveDataList = result.areaDatas;
    state.areaEtcDataList = result.areaInfos;
  },
  insertAreaSave(state, result) {
    let category = result.category;
    let no = result.no;
    if (state.areaSaveDataList[category]) {
      state.areaSaveDataList[category][no] = result;
    } else {
      state.areaSaveDataList[category] = {};
      state.areaSaveDataList[category][no] = result;
    }
    
  },
  removeAreaSave(state, result) {
    let category = result.category;
    let no = result.no;
    delete state.areaSaveDataList[category][no];
  },
  insertGuse(state, no) {
    state.gUseList[no] = no;
  },
  removeGuse(state, no) {
    delete state.gUseList[no];
  },
  insertAreaEtcDataList(state, result) {
    let category = result.category;
    if (!state.areaEtcDataList[category]) {
      state.areaEtcDataList[category] = {};
    }
    switch (result.type) {
      case 'img':
        state.areaEtcDataList[category].img = result.value;
        break;
      case 'zcnt':
        state.areaEtcDataList[category].zcnt = result.value;
        break;
    }
    
  }
  
}
export default {
  state,
  getters,
  mutations,
}
