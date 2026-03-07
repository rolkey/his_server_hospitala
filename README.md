# Isme Nest Server

## 简介

本项目是 [Vue Naive Admin 2.0](https://github.com/zclzone/vue-naive-admin) 的后端服务，使用 Nestjs + TypeOrm + MySql + Redis 搭建，实现了 JWT 认证、菜单管理、RBAC 权限控制核心等功能。

## 预览

[https://admin.isme.top](https://admin.isme.top)

## 接口文档

[isme-nest-serve | Apifox](https://apifox.com/apidoc/shared-ff4a4d32-c0d1-4caf-b0ee-6abc130f734a)

## 安装及使用

请查看 Vue Naive Admin 2.0 项目文档：[Vue Naive Admin Docs](https://docs.isme.top/web/#/624306705/188522224)

## 版权说明（跟Vue Naive Admin 2 完全一样）

本项目使用 `MIT协议`，默认授权给任何人，被授权人可免费地无限制的使用、复制、修改、合并、发布、发行、再许可、售卖本软件拷贝、并有权向被供应人授予同等的权利，但必须满足以下条件:

- 复制、修改和发行本项目代码需包含原作者的版权及许可信息，包括但不限于文件头注释、协议等

简单来说，作者只想保留版权，没有任何其他限制。

## 代码统计

- 统计用户提交数

```bash
git log --author="用户名" --pretty=tformat: --numstat | awk '{ add += $1; subtract += $2 } END { printf "Added lines: %s\nRemoved lines: %s\n", add, subtract }'
```

## 代码生成

```bash
npx typeorm-model-generator -h localhost -d database -u root -x password -e mysql -o ./src/entity
```

## 本地部署

```bash
systemctl stop his-server

pnpm build
rm /var/www/his-server
scp -r ncc-dist /var/www/his-server
cp .env /var/www/his-server/.env

systemctl start his-server
```
