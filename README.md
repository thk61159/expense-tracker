# 廣志の私帳
利用node.js打造記帳網頁，瀏覽收支列表，計算總消費額，新增修改刪除收支項目，掌握帳務，成為理財大師！
歡迎查看雲端部署專案
https://frozen-crag-42286.herokuapp.com/register
email: root@example.com
password: 12345678

## 功能
1. 查看所有收支列表
2. 依項目排列收支
3. 依消費種類查看收支
4. 新增收支
5. 編輯收支
6. 刪除收支
7. 本地註冊登入登出
8. google帳號第三方登入
9. facebook帳號第三方登入
10. 忘記密碼


## 使用介面
![alt 使用介面圖示](https://github.com/thk61159/expense-tracker/blob/main/public/pictures/overall.png?raw=true "記帳使用介面")
![alt 使用介面圖示](https://github.com/thk61159/expense-tracker/blob/main/public/pictures/resetPassword.png?raw=true "記帳使用介面")

## 如何使用
1. 開啟終端機(terminal)，輸入如下將專案複製到電腦中
```shell
 git clone https://github.com/thk61159/expense-tracker.git
```
2. 進入此專案資料夾，安裝各種套件
```shell
 cd restaurantList
 npm install
```
3. 建立.env檔並輸入 -> 需要設定的參數請參照.env.example檔
  MONGODB_URI
  i. 至MongoDB建立帳號並安裝MongoDB Atlas及Robo 3T，利用Robo 3T建立欲使用資料庫
  ii. MONGODB_URI=mongodb+srv://使用者帳號:使用者密碼@資料庫伺服器位置ip/你建立的資料庫名稱?retryWrites=true&w=majority
  
  facebook OAuth
  i. 至 https://developers.facebook.com/ 建立第三方登入授權使用
  google OAuth
  i. 至 https://console.cloud.google.com 建立第三方登入授權使用
6. 新增種子資料(可省略)
```shell
npm run seed
```
3. 運行廣志の私帳
```shell
 npm run start
```
4. 拜訪廣志の私帳網頁
```shell
 http://localhost:3000/
```

##開發工具
* Visual Studio Code 
* Node.js: ^14.16.0
* 
##參考
* [記帳列表樣板](https://assets-lighthouse.alphacamp.co/uploads/image/file/17368/ExportedContentImage_00.png)

