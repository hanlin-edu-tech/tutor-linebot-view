# line-bot-tutor-frontend

Linebot 前端

## Build
```
  npm run build
```

## Deployment
### 測試機
```
  npm run deployTest
```

### 正式機
```
  npm run deployProduction
```


## 大致講解code的結構
src/service: 將跟後端溝通相關操作的api都放在這 
src/service/student-service.js: 將跟後端溝通student相關資料的操作的api都放在這
src/service/coupon-service.js: 將跟後端溝通coupon相關資料的操作的api都放在這
src/service/util-service.js: 隸屬於工具類的放這

src/views中
LineBinding 為 管理綁定流程中的主流程
Profile     為 帳號管理流程中的主流程

store 中的 common 放的是 以上兩個流程共用的行為與資料