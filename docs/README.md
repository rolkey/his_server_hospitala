# 项目文档

## 目录结构

```
docs/
├── README.md                    ← 本文件
├── issues/                      ← 问题扫描快照（按日期归档）
│   └── 2026-07-15.md            ← /init-deep 全项目问题扫描
├── legacy/                      ← PB 源码及业务说明（待迁移）
└── modules/                     ← 模块级业务文档（待迁移）
```

## 问题扫描

| 日期 | 扫描方式 | 文件 | 问题数 |
|------|------|------|:---:|
| 2026-07-15 | `/init-deep` 全量 | [2026-07-15.md](issues/2026-07-15.md) | 29 |

每次 `/init-deep` 或定期巡检后新增一份快照到 `issues/`，方便追踪问题收敛趋势。

## 待迁移文档

以下文档目前散落在源码目录中，后续应集中到 `docs/`：

| 当前位置 | 建议位置 | 说明 |
|------|------|------|
| `src/逻辑` | `docs/legacy/w_ss_gxmk_ssap.srw` | PB 源码（手术排班） |
| `src/逻辑说明.md` | `docs/legacy/逻辑说明.md` | PB 业务说明 |
| `src/modules/h11_brxx/brzk/` | `docs/legacy/brzk/` | PB 源码（转科） |
| `src/modules/h11_brxx/zfcy/` | `docs/modules/h11_brxx/` | 转科说明 3 个 md |

## 约定

- `docs/` 存放面向人类的文档，AGENTS.md 跟着代码放（面向 AI）
- 问题扫描按日期归档到 `docs/issues/YYYY-MM-DD.md`
- 后续加入架构决策记录（ADR）、变更日志等可扩展新子目录
