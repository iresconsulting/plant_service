# 病蟲害診斷服務系統

### 正式環境建構指令
```
$ apt install nodejs
$ apt install npm
$ npm i -g yarn
$ yarn
$ yarn build
$ yarn start
```

### API 接口
```
伺服器心跳檢查
GET /health
```
```
當前版本/版號
GET /version
response: {
  version: string;
}
```
```
問診紀錄/列表
GET /mng/record
headers: {
  authorization: Bearer
}
query: {
  id: string;
  agriculture: stirng;
  symptoms: stirng;
  body_part: stirng;
  expert_name: stirng;
}
response: {
  id: stirng;
  time: stirng;
  location: stirng;
  agriculture: stirng;
  symptoms: stirng;
  body_part: stirng;
  raised_method: stirng;
  user_name: stirng;
  user_phone: stirng;
  user_email: stirng;
  status: stirng;
  response: stirng;
  video_url: stirng;
  expert_name: stirng;
  hidden: stirng;
  created_at: stirng;
  last_updated: stirng;
}
```
```
問診建檔/更新文檔資訊
POST /mng/record
headers: {
  authorization: Bearer
}
params: {
  action_type: 'insert';
  id: string;
  time: string; //時間
  location: string; //地點
  agriculture: string; //作物名稱
  symptoms: string; //病徵
  body_part: string; //部位
  raised_method: string; //栽培方式
  user_name: string; //農友姓名
  user_phone: string; //農友電話
  user_email: string; //農友 Email
  hidden: boolean; //是否顯示於列表
}
```
```
問診上傳影片
POST /mng/record
headers: {
  authorization: Bearer
}
params: {
  action_type: 'video';
  id: string;
  video_url: string; //影片網址
}
```
```
問診診斷
POST /mng/record
headers: {
  authorization: Bearer
}
params: {
  action_type: 'status';
  id: string;
  status: string; //done=已診斷, processing=待診斷
  response: string; //診斷回饋內容 (0-500字)
  expert_name: string; //診斷專家名稱
}
```
```
作物建檔/更新
POST /sys/agriculture
headers: {
  authorization: Bearer
}
body: {
  id: string;
  name: string;
  species: string; //科目
  hidden: boolean; //是否顯示於列表
}
```
```
作物列表
GET /sys/agriculture
headers: authorization
query: {
  id: string;
}
response: {
  id: string;
  name: string;
  species: string;
  hidden: boolean;
  created_at: string;
  last_updated: string;
}
```
```
服務處建檔/更新
POST /sys/unit
headers: {
  authorization: Bearer
}
body: {
  id: string;
  name: string;
  location: string;
  contact: string; //聯絡人
  phone: string;
  hidden: boolean; //是否顯示於列表
}
```
```
服務處列表
GET /sys/unit
headers: authorization
query: {
  id: string;
}
response: {
  id: string;
  name: string;
  location: string;
  contact: string;
  phone: string;
  hidden: boolean;
  created_at: string;
  last_updated: string;
}
```
```
病蟲害建檔/更新
POST /sys/disease
headers: {
  authorization: Bearer
}
body: {
  id: string;
  name: string;
  sickness: string; //病害
  bug: string; //蟲害
  symptoms: string; //病徵
  body_part: string; //部位
  hidden: boolean; //是否顯示於列表
}
```
```
病蟲害列表
GET /sys/disease
headers: authorization
query: {
  id: string;
}
response: {
  id: string;
  name: string;
  sickness: string;
  bug: string;
  symptoms: string;
  body_part: string;
  hidden: boolean;
  created_at: string;
  last_updated: string;
}
```
```
系統登入
POST /sys/user/login
body: {
  account: string; //帳號 (專家: Email, 諮詢單位: Email)
  paassword: string; //密碼
}
```
```
系統帳戶驗證
GET /sys/user/login
headers: {
  authorization: Bearer
}
```
```
系統設定更新
POST /config
headers: {
  authorization: Bearer
}
body: {
  root_usr: string; //系統管理員登入帳號
  root_pwd: string; //系統管理員登入密碼
}
```
```
系統設定列表
GET /config
headers: {
  authorization: Bearer
}
response: {
  root_usr: string;
  root_pwd: string;
}
```
```
系統管理員登入
POST /admin/login
body: {
  usr: string; //系統管理員登入帳號
  pwd: string; //系統管理員登入密碼
}
```
```
共用影片上傳
POST /file/uploads
headers: {
  authorization: Bearer;
  content-type: 'application/json' || 'multipart-formdata-*'
}
body: {
  convert: boolean; //是否執行轉檔
  video_url: string; //網址上傳, 支援格式: https://*
  video: form_data; //客戶端本地影片上傳, 支援格式: video/*
}
```
```
資料庫建置
GET /db/init
requirements:
  1. system.env.ALLOW_DB_INIT: 'true'
query: {
  drop: boolean; //1. 清除所有資料, 2. 重新建構資料庫, 3. 重新建構基礎數據 (Ex. 系統管理員登入帳號及密碼)
}
response: {
  root_usr: string; //系統管理員登入帳號
  root_pwd: string; //系統管理員登入密碼
}
```
