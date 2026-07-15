# h12_yzzb — Prescriptions/Orders (医嘱)

**Generated:** 2026-07-15 | **LOC:** ~7400 across 14 files
**Role:** Core medical orders module. Highest code volume in the project.

## OVERVIEW

Handles order lifecycle: creation, validation, execution, cycles, templates, refunds.
Orders follow master-detail: `yzzb` (主表) + `yzzx` (执行 detail).
Depends on 15+ sibling modules (patients, drugs, stock, surgery, EMR, diagnosis).

## FILES

| File | LOC | Role |
|------|-----|------|
| `h12_yzzb.module.ts` | 116 | Registration, imports, providers |
| `h12_yzzb.controller.ts` | 374 | REST endpoints |
| `h12_yzxb.service.ts` | 1806 | ⚠️ Original service — still active |
| `h12_yzxb.service_new.ts` | 2912 | ⚠️ Refactored duplicate — parallel impl |
| `h12_yzzb.service.ts` | 473 | Supplementary service |
| `baby-advice.service.ts` | 226 | Pediatric/neonatal orders |
| `h12_check.service.ts` | 485 | Pre-save validation rules |
| `h12_yzzb.entity.ts` | 132 | Master entity (yzzb) |
| `h12_yzxb.entity.ts` | 412 | Execution entity (yzzx) |
| `dto/` (5 files) | 462 | DTOs: yzxb, yzxbOpe, yzzbOpe, yzzb1Ope, out-response |

## DATA MODEL

```
yzzb (master order) 1──N yzzx (execution records)
```
- yzzb: order header — patient, dept, type, status, template ref, dates
- yzzx: per-item execution — drug, dosage, frequency, charge, stock deduction

## CROSS-MODULE DEPENDENCIES

| Module | Used for |
|--------|---------|
| `h11_brxx` | Patient demographics |
| `h12-cycl` | Order cycles/groups |
| `h12_xmzd` | Charge item dictionary |
| `h13_yzzxcs` | Order execution context |
| `h31_kcxx` | Drug stock/inventory |
| `h30_ypzd` | Drug dictionary |
| `h31_lyjl` | Usage/administration records |
| `h00_tcxb` | Treatment packages |
| `h00_sypl` | Dosing frequency |
| `emr_jcsq` | EMR exam applications |
| `n04_22`, `n04-23` | Diagnosis codes |
| `h15_sszb`, `sm-ssap`, `sm-sssq` | Surgery orders |
| `gy_identity` | ID generation |
| `auth`, `syspar_new` | Auth & system params |

## KEY PATTERNS

- **Batch tx**: Order groups created/executed/refunded inside TypeORM transactions
- **ContextService**: AsyncLocalStorage-style context for threading `userId`, `patientId`, `orderId` through nested calls, avoiding parameter threading
- **Validation pipeline**: `h12_check.service.ts` pre-save business rules before persistence

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Order CRUD core | `h12_yzxb.service.ts` | Confirm active vs service_new |
| Order CRUD (refactored) | `h12_yzxb.service_new.ts` | Audit before modifying |
| Validation | `h12_check.service.ts` | Called before save/execute |
| Pediatric logic | `baby-advice.service.ts` | Neonatal & children |
| API surface | `h12_yzzb.controller.ts` | All REST routes |
| Entities | `h12_yzzb.entity.ts` + `h12_yzxb.entity.ts` | Schema reference |
| Wiring | `h12_yzzb.module.ts` | Providers, imports, exports |

## ANTI-PATTERNS & TECH DEBT

- ⚠️ **Duplicate services**: `_new.ts` (2912 LOC) and original (1806 LOC) coexist. No HOF/extraction. Audit which controller imports to determine the active path before any change.
- **12 `console.log()` calls** — replace with NestJS `Logger`
- **18 `: any` + 8 `as any`** in service_new.ts — worst type-safety in the project
- **323 lines of commented-out dead code** in service.ts
- **3 TODOs**: Redis caching for syspar (svc line 62), group-delete edge case (svc line 1283), float precision issue (svc_new line 226)
- No unit tests for any service file
