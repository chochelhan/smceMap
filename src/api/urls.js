const IS_DEBUG = process.env.NODE_ENV !== 'production';
const DEV_SERVER_HOST = `http://localhost:8060`;
//const DEV_SERVER_HOST = `http://192.168.0.98:8080`;
let hostName = location.hostname;
let port = location.port;

const REAL_SERVER_HOST = 'http://' + hostName + ':'+port;

const LOCAL_HOST = 'http://' + hostName;

//export const HOST = REAL_SERVER_HOST;
export const HOST = DEV_SERVER_HOST;


const DEV_VEGA_WSURI = 'ws://' + location.hostname + ':8040/echo';
const REAL_VEGA_WSURI = 'ws://' + hostName + ':8080/vega';
//const REAL_VEGA_WSURI = 'ws://39.118.213.166:8080/vega';

const DEV_VEGA_HTTPURI = 'http://' +location.hostname;
const REAL_VEGA_HTTPURI = 'http://' + hostName;
//const REAL_VEGA_HTTPURI = 'http://39.118.213.166';

export const VEGA_WSURI = IS_DEBUG ? DEV_VEGA_WSURI : REAL_VEGA_WSURI;
export const VEGA_HTTPURI = IS_DEBUG ? DEV_VEGA_HTTPURI : REAL_VEGA_HTTPURI;


export const API_URL_AUTH = `${HOST}/api/member/memberLogin`;
export const API_URL_SESSION = `${HOST}/api/auth/session`;
export const API_URL_VALIDATE_TOKEN = `${HOST}/api/auth/token`;
export const API_URL_LOGOUT = `${HOST}/api/auth/logout`;

export const API_URL_USER = `${HOST}/api/user`;
export const API_URL_USER_EDIT = `${HOST}/api/user`;
export const API_URL_USER_REG = `${HOST}/api/user`;
export const API_URL_USER_DETAIL = `${HOST}/api/user`;


/**
 * @ 기본설정
 */
// 건물정보
export const API_URL_SETTING_CATEGORYLIST = `${HOST}/api/category/getCategoryList`;
export const API_URL_SETTING_CATEGORYUPDATE = `${HOST}/api/category/cateUpdate`;
export const API_URL_SETTING_CATEGORYINSERT = `${HOST}/api/category/cateInsert`;
export const API_URL_SETTING_CATEGORYDELETE = `${HOST}/api/category/cateDelete`;
export const API_URL_SETTING_CATEGORYRANK = `${HOST}/api/category/rankUpdate`;

// 발신번호
export const API_URL_SETTING_SENDNUMBER_UPDATE = `${HOST}/api/msgdata/msgUpdate`;
export const API_URL_SETTING_SENDNUMBER_INSERT = `${HOST}/api/msgdata/msgInsert`;
export const API_URL_SETTING_SENDNUMBER_IDCHECK = `${HOST}/api/msgdata/msgIdcheck`;
export const API_URL_SETTING_SENDNUMBER_LIST = `${HOST}/api/msgdata/getDataList`;
export const API_URL_SETTING_SENDNUMBER_GET = `${HOST}/api/msgdata/getDataInfo`;
export const API_URL_SETTING_SENDNUMBER_DELETE = `${HOST}/api/msgdata/msgDelete`;

// 알림 및 맵키

export const API_URL_SETTING_ALERTINSERT = `${HOST}/api/setting/insertAlertset`;
export const API_URL_SETTING_ALERTGET = `${HOST}/api/setting/getAlertsetData`;



/**
 * @ 직원관리
 **/
export const API_URL_MEMBER_MEMBERLIST = `${HOST}/api/member/getMemberList`;
export const API_URL_MEMBER_MEMBERDELETE = `${HOST}/api/member/updateUout`;

export const API_URL_MEMBER_MEMBER_CHECKID = `${HOST}/api/member/getCheckId`;
export const API_URL_MEMBER_MEMBER_INFO = `${HOST}/api/member/getMemberInfo`;
export const API_URL_MEMBER_MEMBER_UPDATE = `${HOST}/api/member/userUpdate`;
export const API_URL_MEMBER_MEMBER_INSERT = `${HOST}/api/member/userRegist`;


/**
 * @ 비상벨 목록
 **/

export const API_URL_BELL_LIST = `${HOST}/api/msgdata/getBellDataList`;
export const API_URL_BELL_DELETE = `${HOST}/api/msgdata/belldataDelete`;

/**
 * @ 맵 정보
 **/

export const API_URL_MAP_GET = `${HOST}/api/mapdata/getData`;
export const API_URL_MAP_SAVEIMG = `${HOST}/api/mapdata/saveImage`;
export const API_URL_MAP_REGIST = `${HOST}/api/mapdata/registData`;
export const API_URL_MAP_GETIMG = `${HOST}/api/uploads/getImage`;

export const API_URL_NOTICE_GET = `${HOST}/api/mapdata/getBelldata`;

/**
 * @ 미확인 비상벨
 **/

export const API_URL_ALERTMAP_REGISTCALL = `${HOST}/api/calldata/registCall`;
export const API_URL_ALERTMAP_REGISTALLCALL = `${HOST}/api/calldata/registAllCall`;



// 관리자 비번 변경
export const API_URL_ADMIN_CHAGEPASSWORD = `${HOST}/api/member/memberUpdate`;





// 운영환경 Fallback
export const API_URL_ADMIN_FALLBACK = `${HOST}/api/user/setEnv`;
export const API_URL_ADMIN_GET_FALLBACK = `${HOST}/api/user/getEnv`;

export const CONFIG_HEADER = {
  'Content-Type': 'application/json;charset=UTF-8'
};

export const CONFIG_HEADER_DEFAULT = {
  memberkey: localStorage['memberkey'],
  
};
export const CONFIG_HEADER_POST = {
  memberkey: localStorage['memberkey'],
  'Content-Type': 'application/json;charset=UTF-8'
};

export const CONFIG_HEADER_FORM = {
  authToken: localStorage['memberkey'],
  'Content-Type': undefined
};

export const CONFIG_HEADER_MULTIPART = {

};
