# FLIP : 나만의 문제집 프로젝트

## Description

FLIP : 나만의 문제집 프로젝트 BackEnd 리포

## Tech Stack
<div>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"> 
  <img src="https://img.shields.io/badge/TypeORM-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white"> 
  <img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
  <img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=PM2&logoColor=white">
</div>



## Directory Structure

``` js
root
├─config : config node module 설정파일
└─src 
    └─domain // 서비스 domain root 디렉토리 ex) auth, workbook
      ├─interfaces // Controller, Request, Response
      ├─application // Service
      ├─domain // Entity
      └─infrastructure // Repository
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy

```bash
# pm2
$ pm2 start ecosystem.config.js
```
