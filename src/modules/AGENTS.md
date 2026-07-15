# src/modules/ — Feature Modules

89 NestJS feature modules covering hospital workflows: registration, admission, prescriptions/orders, surgery, EMR, pharmacy, billing, scheduling.

## STRUCTURE BY DOMAIN

### Registration (h00_*) — 14 modules
`brlb brlx cwxx fkfs fylb gxzd mzzd rybq syff sypl tcxb xmzd ybfl ypfl`
Beds, fee categories, payment methods, departments, TCM diagnoses, drug classifications.

### Admission / Inpatient (h11_*) — 11 modules
`brxx fpxb fpzb jsxb jszb jshztzd1 lsh xnh yjk zybh zypj`
Patient hub (brxx), invoices, billing, serial numbers, drug stock at ward level.

### Orders / Prescriptions (h12_*, h13_*) — 11 modules
**h12**: `yzzb cycl mbzb mbxb ryjl xmzd` — Core prescriptions. yzzb is highest-complexity module (~7000 LOC).
**h13**: `brzkqk cwsyxx djdy yzzxcs yzzxcs_tf` — Order execution, bed status, printing.
⚠️ `​​h13_yzzxcs​​` has zero-width Unicode chars (U+200B) in directory name. Do NOT rename via filesystem; fix import paths simultaneously.
⚠️ `h13_yzzxcs_delete` is an orphaned copy. Remove after verifying no references.

### Surgery (h15_*, sm-*) — 6 modules
`h15_ssjxxb h15_ssxb h15_ssxb_tf h15_sszb sm-ssap sm-sssq`
Surgery docs, scheduling (ssap), applications (sssq). sm-ssap has PB legacy docs at `src/逻辑/`.

### EMR (emr_*, enr_*) — 8 modules
`emr_jb01 emr_jb02 emr_jcbw emr_jcff emr_jcsq emr_jcxm emr_xmfl enr_jb01 enr_jb02`
Disease records, examination requests, item classification.

### Outpatient (h20_*, h21_*, h22_*, h23_*) — 9 modules
`h20_jzzb h21_brxx h21_ylzh h22_sfjl h23_cfmx h23_cfxb h23_cfzb h23_mzzd h23_rytz`
Visits, outpatient records, medical summary, billing, prescriptions, diagnoses, admissions.

### Drugs / Pharmacy (h30_*, h31_*) — 3 modules
`ypzd kcxx lyjl`
Drug dictionary (ypzd), inventory (kcxx), usage records (lyjl).

### Diagnosis (n04_*) — 2 modules
`n04_22 n04-23`
⚠️ Naming inconsistency: snake_case vs kebab-case coexist. No migration plan.

### Infrastructure / System — 25 modules
`auth role permission module usrcat syspar_new gy_identity report ksmc ksry lis_sflb bas-opr his-tech csxz c00_fbxx fyxx jbbmicd mzff zcmc views_360 system technology-orders h40_sqzb`
Auth (JWT+RBAC), user/role/permission management, system params, reports, departments, staff, lab test categories, ICD codes, payment methods, views.

## CONVENTIONS

Standard module: `{name}.module.ts`, `{name}.controller.ts`, `{name}.service.ts`, `{name}.entity.ts`, `dto.ts`.

Some use subdirectories: `dto/`, `entity/`, `service/` (h00_tcxb, h12_xmzd).

Module prefix = hospital department code:
| Prefix | Domain |
|--------|--------|
| h00 | Registration |
| h11 | Admission / Inpatient |
| h12–h13 | Orders / Prescriptions |
| h15 / sm | Surgery |
| h20–h23 | Outpatient |
| h30–h31 | Pharmacy / Drugs |
| h40 | Applications |
| n04 | Diagnosis (ICD) |
| emr/enr | Electronic Medical Records |

Naming is inconsistent: `snake_case` (h11_brxx) and `kebab-case` (sm-ssap, n04-23) coexist. No migration planned.

## HIGH-COMPLEXITY MODULES

| Module | LOC | Notes |
|--------|-----|-------|
| `h12_yzzb` | ~7000 | Core prescriptions/orders, 15+ cross-module deps |
| `h11_brxx` | ~3200 | Patient admission hub, embedded PB legacy (`brzk/`, `zfcy/`) |
| `auth` | — | JWT + RBAC + session management |

These have their own `AGENTS.md`. See `h12_yzzb/AGENTS.md`, `h11_brxx/AGENTS.md`, `auth/AGENTS.md`.

## WARNINGS

- `h11_brxx/` contains legacy PowerBuilder code (`brzk/`) and docs (`zfcy/`). Not executable TypeScript.
- `.service_new.ts` files coexist with originals in h12_yzzb and h11_brxx. Verify which is active before modifying.
- `h12_xmzd` files are named `sfxm.*` (收费项目), not matching the directory name.
- h23 prescription modules (cfmx, cfxb, cfzb) are separate from h12/h13 order modules — different workflow stage.
