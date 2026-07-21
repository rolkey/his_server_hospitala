# src/common/ — Cross-Cutting Infrastructure

Imported by ALL modules. Global guards, filters, decorators, exception classes.

## STRUCTURE

```
src/common/
├── guards/          5 guards
├── interceptors/    1 interceptor
├── filters/         1 filter
├── exceptions/      2 files (custom exception + error codes)
├── decorators/      2 decorators
├── transformers/    1 transformer
└── constants/       1 file (patientInfo.ts)
```

### guards/
| File | Strategy | Purpose |
|------|----------|---------|
| `jwt.guard.ts` | JWT | Validates Bearer token, sets `req.user` |
| `local.guard.ts` | Local | Username/password login guard |
| `permission.guard.ts` | CanActivate | RBAC permission check (menus/buttons) |
| `role.guard.ts` | CanActivate | Role-based access (`@Roles()`) |
| `preview.guard.ts` | — | Blocks destructive ops in preview mode |

### interceptors/
- `transform.interceptor.ts` — Wraps all responses: `{code:0, message:'OK', data, originUrl}`

### filters/
- `all-exception.filter.ts` — Catches any unhandled → `{code, error, data, message, originUrl}`

### exceptions/
- `custom.exception.ts` — Domain errors. **ALWAYS throw this**, never raw `HttpException`.
- `error-code.ts` — Enum `ErrorCode`: `ERR_10000`–`ERR_500`, plus HTTP-like status codes.

### decorators/
- `roles.decorator.ts` — `@Roles('admin', 'doctor')` for role guard.
- `return-type.decorator.ts` — `@ReturnType('primitive')` to bypass TransformInterceptor.

### transformers/
- `date.transformer.ts` — `@DateTransformer()` for entity date formatting via `class-transformer`.

### constants/
- `patientInfo.ts` — `ryqk` (入院情况: 危重/急症/一般), `hljl` (护理级别: 一级～特级).

## WHERE TO LOOK

| Concern | File |
|---------|------|
| JWT validation / `req.user` | `guards/jwt.guard.ts` |
| Login credentials | `guards/local.guard.ts` |
| Menu/button permissions | `guards/permission.guard.ts` |
| Role checks | `guards/role.guard.ts` |
| Response format override | `decorators/return-type.decorator.ts` |
| Error codes | `exceptions/error-code.ts` |
| Exception pattern | `exceptions/custom.exception.ts` |
| Date formatting in entities | `transformers/date.transformer.ts` |
| Admission / nursing lookup | `constants/patientInfo.ts` |

## CONVENTIONS

- Guards extend `AuthGuard('strategy')` or implement `CanActivate`.
- Errors: `throw new CustomException(ErrorCode.ERR_XXXXX)`. Never raw exceptions.
- Response envelope is global via `TransformInterceptor`. Bypass with `@ReturnType('primitive')`.
- `@DateTransformer()` for entity date columns — formats via `class-transformer`.
- JWT + Permission guards are applied globally in `shared.module.ts`. Individual modules do NOT re-register them.

## ANTI-PATTERNS

- **Don't** `throw new HttpException(...)` — always `CustomException` with an error code.
- **Don't** register interceptors/filters in feature modules — they go in `shared.module.ts`.
- **Don't** bypass JWT globally. Use `@Public()` or the project's existing bypass decorator/guard pattern.
- **Don't** add business logic to guards/filters — keep them to auth and formatting concerns.
