# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-15
**Commit:** 16faae6
**Branch:** master

## OVERVIEW

NestJS 10 backend for Vue Naive Admin 2.0 (HIS — Hospital Information System). Serves 80+ clinical/admission/pharmacy/EMR modules. Stack: NestJS + TypeORM + **MSSQL** + Redis + JWT auth + RBAC.

## STRUCTURE

```
./
├── src/
│   ├── main.ts              # Bootstrap, global prefix /api-doctor, port 8085
│   ├── app.module.ts        # Root module — imports all 85+ feature modules
│   ├── shared/              # Global infrastructure (@Global): TypeORM, Redis, filters, interceptors
│   ├── common/              # Guards (5), decorators (2), filters, interceptors, exceptions, transformers
│   ├── modules/             # 89 feature modules (see modules/AGENTS.md)
│   ├── utils/               # General utilities (snowflake ID, SQL debug, date format)
│   ├── types/               # Shared TS types (PermissionType, MethodType, ReturnType)
│   ├── constants/           # ⚠️ Duplicate of common/constants/ — split by accident
│   ├── 逻辑                  # ⚠️ Legacy PowerBuilder source (w_ss_gxmk_ssap) — documentation reference only
│   └── 逻辑说明.md            # PB business logic documentation
├── dist/                    # tsc output
├── ncc-dist/                # Single-file bundle (Vercel NCC)
├── his-server.service       # systemd unit
└── pm2.json                 # PM2 config
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Auth/JWT/Login | `src/modules/auth/` | JWT guard in `common/guards/` |
| Role/Permission RBAC | `src/modules/{role,permission,module}/` | Guards in `common/guards/` |
| Prescriptions/Orders | `src/modules/h12_yzzb/` | Largest module (~7000 LOC) |
| Patient Admission | `src/modules/h11_brxx/` | Has embedded PB legacy + .service_new.ts |
| Surgery Scheduling | `src/modules/sm-ssap/`, `sm-sssq/`, `h15_sszb/` | Multiple modules |
| EMR/JB | `src/modules/emr_*/`, `enr_*` | 8 controllers total |
| Drug Inventory | `src/modules/h11_yjk/`, `h30_ypzd/`, `h31_kcxx/` | Pharmacy chain |
| Global error handling | `src/common/filters/all-exception.filter.ts` | All exceptions → `{code, error, data, message}` |
| API response format | `src/common/interceptors/transform.interceptor.ts` | Success → `{code:0, message:'OK', data}` |
| Error codes | `src/common/exceptions/error-code.ts` | ERR_10000-ERR_500 |
| DB config | `src/shared/shared.module.ts` | TypeORM for MSSQL |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `AppModule` | Module | `src/app.module.ts` | Root module, imports all features |
| `SharedModule` | Module(@Global) | `src/shared/shared.module.ts` | TypeORM, Redis, global pipes/filters |
| `JwtGuard` | Guard | `src/common/guards/jwt.guard.ts` | JWT auth guard |
| `PermissionGuard` | Guard | `src/common/guards/permission.guard.ts` | RBAC permission check |
| `TransformInterceptor` | Interceptor | `src/common/interceptors/transform.interceptor.ts` | Response envelope |
| `AllExceptionFilter` | Filter | `src/common/filters/all-exception.filter.ts` | Error envelope |
| `CustomException` | Exception | `src/common/exceptions/custom.exception.ts` | Domain errors with codes |
| `ContextService` | Service | `src/shared/context.service.ts` | AsyncLocalStorage-style request context |
| `SnowflakeIdGenerator` | Util | `src/utils/SnowflakeIdGenerator.ts` | Distributed ID generation |

## CONVENTIONS

**Module structure**: `src/modules/<name>/` with `{name}.module.ts`, `{name}.controller.ts`, `{name}.service.ts`, `{name}.entity.ts`, `dto.ts`. Some modules deviate with `dto/`, `entity/`, `service/` subdirectories.

**Naming**: Two conventions coexist — `snake_case` (h11_brxx) and `kebab-case` (sm-ssap, n04-23). No migration plan.

**API envelope**: All responses wrapped as `{ code: 0, message: 'OK', data, originUrl }`. Use `@ReturnType('primitive')` for raw responses.

**Error pattern**: Throw `new CustomException(errorCode)` — never raw `HttpException`. Codes defined in `error-code.ts`.

**DB access**: TypeORM via `@InjectRepository()`. No raw SQL. MSSQL with `synchronize: false` (prod-safe). Timezone `+08:00`.

**DTO validation**: `class-validator` with `@Allow()` default, `whitelist: true` via global pipe.

**Formatting**: Prettier (`singleQuote: true, printWidth: 100, trailingComma: all, semi: true, tabWidth: 2`). ESLint with all strict TS rules OFF (`no-explicit-any`, `no-unused-vars`, `explicit-function-return-type` all disabled).

**Environment**: `.env` at root. `APP_PORT=8085`. MSSQL on 1433. Redis URL. `DB_SYNC=false`, `DB_LOGGING=all`.

## ANTI-PATTERNS (THIS PROJECT)

- `console.log()` in services — use NestJS `Logger` instead (65 instances, mostly in h12_yzzb and h13_yzzxcs)
- `as any` / `: any` — 141 instances. Fix or explicitly justify in JSDoc.
- `.service_new.ts` duplicate files — `h12_yzxb.service_new.ts` (2912 lines) and `h11_brxx.service_new.ts` coexist with originals. Audit which is active.
- gRPC/microservice dead imports — `GrpcMethod`, `RequestContext` imported but unused.
- Commented-out `SunsoftModule` — in `app.module.ts`. Either restore or remove.
- Zero-width unicode chars — directory `​​h13_yzzxcs​​` has U+200B chars. **DO NOT rename via filesystem** — fix import paths simultaneously.
- `src/constants/` duplicates `src/common/constants/` — consolidate.
- Orphaned `h13_yzzxcs_delete/` — remove.
- Module naming inconsistency — `n04_22` vs `n04-23`. Pick one.
- Hardcoded `localhost` in `README.md` commands.

## UNIQUE STYLES

- **Custom `ContextService`** for request-scoped context propagation (not NestJS `REQUEST` scope). Used in `h12_yzxb.service.ts` to avoid threading `userId`/`patientId` through all method signatures.
- **@DateTransformer()** decorator for date formatting via `class-transformer`.
- **Varchar-to-Number transformer** for comma-formatted decimals (Chinese locale).
- **ER module codes** (h00-h40, emr, n04) correspond to hospital department classification system.

## COMMANDS

```bash
pnpm install               # Install dependencies
pnpm start:dev             # Dev server with hot reload (port 8085)
pnpm build                 # tsc + ncc → ncc-dist/
pnpm lint                  # ESLint with --fix
pnpm format                # Prettier on src/
systemctl start his-server # Production deployment
```

## NOTES

- README says MySQL but **actual DB is MSSQL** (see `.env` and `shared.module.ts`). `mysql2` driver is installed but unused.
- `src/逻辑` is legacy PowerBuilder code — NOT executable TypeScript. It documents surgery scheduling UI logic for reference during TS migration.
- No tests exist (Jest/supertest installed but zero `*.spec.ts` files). Test infra must be created from scratch.
- No CI/CD configs (no GitHub Actions, Dockerfile, Jenkins). Deployment is manual `scp + systemctl`.
