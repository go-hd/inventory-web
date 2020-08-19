## 在庫管理システム FRONT側

### 言語
- Nuxt.js v2.11.0

***
### ローカル環境構築

#### Docker起動
[初回]
```
$ docker-compose up -d --build
```
[二度目以降]
```
$ docker-compose up -d
```
#### Nuxt起動
```
$ cp .env.example .env
# .envのPASSPORT_PASSWORD_GRANT_SECRETにAPI側の"oauth_clientsテーブル"のid=2の"secret"の値を設定
$ npm install
$ npm run dev
```

#### ログイン
```
url: http://localhost:3000
email: user1@go.com
password: password
```

他ユーザーでログインする場合はAPI側のシーダー参照 <br>
inventory-api/database/seeds/ActualDatas/UserData.php



