## 使用情況調查（2026-11-09）

> 本節為 hanlin-edu-tech repo 清理作業的調查紀錄，待負責人確認後決定封存或刪除。

- 調查結論：仍在使用
- 建議處置：保留，理由：正式站 `https://www.ehanlin.com.tw/app/linebot/` 仍提供本 repo 的建置產物，且仍在運行、持續開發中的 LINE bot 後端（tutor-linebot-bg）與客服服務（tutor-customer-service）在發送給使用者的訊息中連結到本頁面。
- 最後更新：pushedAt 2026-10-28；最後 commit `bacde93` 2026-10-28 hotdog929 chore: 升級 Node.js 至 26（CVE-2026-111497） (#92)
- 用途：eHanlin LINE 官方帳號的前端頁面（Vue 2，package 名稱 line-bot-tutor-frontend），提供 LINE 帳號綁定、個人資料與優惠券頁面；以 gulp 上傳到 GCS，正式站路徑 `https://www.ehanlin.com.tw/app/linebot/`。

### 檢查結果

| 檢查項目 | 結果 | 依據 |
|---|---|---|
| GitHub 活動 | 最後實質 commit `3187a3e` 2025-05-02 hotdog929（修改 綁定確認時拿掉學生姓名 [sc-74111]），對應 tag v2.5.4（2025-05-02）；2026-10-28 `bacde93` 屬 org 內「升級 Node.js 至 26（CVE-2026-111497）」批次修改，不列為實質開發。分支 11 個（main、master 最後 2019-10-18、check-coupons 最後 2024-07-04、dependabot 8 個）；open PR 9 筆（dependabot 8 筆、check-coupons 1 筆）；issue 0；tag 31 個；release 0；webhook 0；非 fork；部署 workflow 只由 tag 觸發，Actions 執行紀錄只有 Dependabot Updates | 已查核，細節記錄於內部調查報告 |
| org 內程式碼引用 | 有仍在運行的服務引用本頁面網址 | 關鍵字 tutor-linebot-view、line-bot-tutor-frontend、app/linebot；命中 tutor-linebot-bg、tutor-customer-service、intelligent-scheduling-system-line；另命中 handwriting-practice-view 的 gulpfile（複製自本 repo，上傳路徑同為 `/app/linebot/`）；引用方的部署與活動已查核，細節記錄於內部調查報告 |
| GCP 部署 | 正式站入口頁回 200，內容為本 repo 建置產物，GCS 物件最後上傳 2025-05-02，與最後實質 commit 同日；測試站同樣由本 repo 產物提供（最後上傳 2025-04-18）；查無 Cloud Build trigger、Cloud Run、Cloud Functions 以本 repo 為來源；負載平衡器日誌不保留 200 回應，無法統計頁面請求數 | 已查核，細節記錄於內部調查報告 |
| AWS 部署 | 四個帳號的 Lambda、API Gateway（REST／HTTP）、ECR、ECS、EventBridge、SQS、S3、CloudFront 查無本 repo 的部署 | 已查核，細節記錄於內部調查報告 |

### 待確認事項
- handwriting-practice-view 的 gulpfile 部署流程會先刪除再上傳正式站 `/app/linebot/` 路徑，執行該 repo 的部署會覆蓋本 repo 的 LINE 綁定頁面；需由 handwriting-practice-view 負責人修正上傳路徑。
- 9 筆未處理的 PR（dependabot 8 筆、check-coupons 1 筆）由負責人決定合併或關閉。
- 部署 workflow 的 tag 條件使用 `\d` 正規表示式，GitHub Actions 不支援，查無任何部署 workflow 執行紀錄；目前部署靠手動執行 gulp，負責人需確認部署流程。

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