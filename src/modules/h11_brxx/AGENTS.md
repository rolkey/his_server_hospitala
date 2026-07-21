# h11_brxx — Patient Admission

Admission / discharge / transfer hub (病人信息). Most-referenced entity in the HIS.

## FILES

```
h11_brxx.module.ts          Module registration
h11_brxx.controller.ts      REST endpoints (118 LOC): CRUD, admit, discharge, transfer
h11_brxx.service.ts         ORIGINAL service (1633 LOC) — full admit/discharge/transfer
h11_brxx.service_new.ts     REFACTORED parallel (397 LOC) ⚠️ audit which is active
h11_brxx.entity.ts          Patient entity (571 LOC), ~40 columns, @AfterLoad() hooks
dto.ts                      Transfer objects (541 LOC)
brzk/                        ⚠️ LEGACY PowerBuilder source (408 lines) — do NOT import
zfcy/                        ⚠️ DOCS: 转科功能说明.md, 转科校验逻辑说明.md, 完善说明.md
```

## ENTITY SCHEMA

PK: `zyid` (varchar 12). Key columns: `zybh`, `mzbh`, `brxm`, `rysj`, `cysj`, `zyzt`, `ryksid`, `sfzh`, `ylzh`, `gfbh`, `brlxid`, `brnl`, `xbid`. Many-to-one joins: usrcat, h00_brlx, ksmc, h00_cwxx, h00_rybq, csxz, jbbmicd10.

`@AfterLoad()` hook (line 476) populates derived fields:
- `zyts`: hospital days (cysj - rysj if discharged, else today - rysj)
- `zyztmc`: status name (0-2→在院, 3→待办, 4→出院)
- `hljlmc`: nursing level name (1→一级, 2→二级, 3→三级, 4→特级)
- All varchar fields trimmed

`csrq` synthesized from `sfzh` ID card when null. `@DateTransformer()` on datetime columns. Comma-formatted decimal transformer for `qfje`, `fdje`, `cwbz` (Chinese locale).

## SERVICE DUALITY

Module imports original service. Do NOT modify one without checking the other's status.

## DISCHARGE (出院)

1. Validate: no undispensed drugs, unexecuted orders, unsigned intern orders, shortages
2. Auto-stop bed, set `zyzt = 3`, record `cysj`
3. Flag all orders `h12_yzzb.tzbz = 1`
4. Delete reminders `h11_jshztzd1`, insert follow-up `YW_SF_BRXX`

## TRANSFER (转科)

1. Validate target `zkksid`. Set `zyzt = 6`.
2. Insert into `h13_brzkqk` — target dept must confirm.
3. If `zkjl = '1'`: cascade `ksid` across 8+ tables (`h12_yzzb`, `h12_yzxb`, `h13_yzzxcs`, `h11_yjk`, `h12_blzb`, `h15_sszb`, `h15_ssxb`, `BQ_HLJL_NEW`).
4. If `zkjl != '1'`: only flag `tzbz = 1`.
5. Optional: transfer deposit ledger per param `yjkzk`.

Full validation rules in `zfcy/转科校验逻辑说明.md`.

## CROSS-MODULE CASCADE ⚠️

Entity field changes affect: `h12_yzzb`, `h12_yzxb`, `h13_yzzxcs`, `h13_cwsyxx`, `h15_sszb`, `h15_ssxb`, `h11_yjk`, `h12_blzb`, `sm-ssap`, `sm-sssq`, `emr_jb*`, `enr_jb*`, `h21_brxx`, `h23_*`, `h31_kcxx`, `h40_sqzb`. Grep ALL before renaming/adding columns.

## KNOWN ISSUES

- **TODO line 1049, 1249**: missing audit logging for discharge + transfer. CRITICAL for compliance.
- **service_new.ts**: parallel implementation, unverified activation status.
- **brzk/**: PowerBuilder. Documents original logic. Not executable.

## WHERE TO LOOK

| Task | File |
|------|------|
| CRUD endpoints | controller + service.ts |
| Entity | entity.ts |
| Discharge | service.ts ~990-1100 |
| Transfer | service.ts ~1140-1260 |
| Transfer validation | zfcy/转科校验逻辑说明.md |
| Feature docs | zfcy/转科功能说明.md |
| Improvements | zfcy/完善说明.md |
| Legacy PB logic | brzk/ |
| DTOs | dto.ts |
