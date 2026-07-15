# AUTH MODULE

## OVERVIEW

Central auth module. JWT login via passport-local + session captcha + RBAC role switching. No own entity — delegates user persistence to `UsrcatService` (`../usrcat/`). Access tokens stored in Redis for invalidation/refresh. Token TTL renewed on every validated request.

## FILES

| File | Role |
|------|------|
| `auth.module.ts` | Registers PassportModule, JwtModule (async, JWT_SECRET from env), LocalStrategy, JwtStrategy |
| `auth.controller.ts` | login (LocalGuard), register (PreviewGuard), captcha, refresh-token, password-change, role-switch, logout (JwtGuard on last 4) |
| `auth.service.ts` | validateUser, login, generateToken (JWT sign + Redis store), switchCurrentRole, logout (Redis del), getAccessTokenKey |
| `dto.ts` | LoginDto (usid, pwrd), RegisterUserDto (usid/pwrd 3-20 chars), ChangePasswordDto (oldPassword, newPassword) |
| `jwt.strategy.ts` | Extracts Bearer token → validates vs Redis-stored token → checks role.enable → renews TTL. Returns `{usid, unam, roleCodes, currentRoleCode}` |
| `local.strategy.ts` | passport-local: validates username/password via authService. Throws ERR_10002 on mismatch |

## FLOW SUMMARY

**Login**: `POST /auth/login` → LocalStrategy calls `validateUser()` (checks usid + password) → controller checks captcha against `req.session.code` → `login()` builds payload `{usid, unam, roleCodes, currentRoleCode}` → `generateToken()` signs JWT + stores in Redis → returns `{accessToken}`.

**Each request**: JwtStrategy extracts Bearer token → finds user by `payload.usid` → verifies `currentRole.enable` → compares token vs Redis value (401 ERR_11002 if mismatch) → renews Redis TTL → attaches user to `req.user`.

**Role switch**: `POST /auth/current-role/switch/:roleCode` → verifies role belongs to user → issues new JWT with updated `currentRoleCode`.

**Logout**: deletes Redis key. **Password change**: validates old password → resets via UsrcatService → logs out.

## KEY DETAILS

- **JWT payload**: `{usid, unam, roleCodes: string[], currentRoleCode, captcha?}`. `captcha` only in preview mode.
- **Redis key**: `USER_ACCESS_TOKEN_KEY:{usid}:{captcha}` (see `@/constants/redis.contant`). TTL: `ACCESS_TOKEN_EXPIRATION_TIME`.
- **Session**: express-session, cookie name `isme.session`. Captcha in `req.session.code`.
- **Password**: plain-text compare (`password == user.pwrd.trim()`) — bcryptjs `compareSync` is imported but commented out. Passwords stored plain-text in DB.
- **Preview mode**: `IS_PREVIEW=true` skips captcha. `PreviewGuard` blocks register/password-change in preview.

## WHERE TO LOOK

| Task | File(s) |
|------|---------|
| Login end-to-end | `local.strategy.ts` → `auth.controller.ts` → `auth.service.ts` |
| JWT guard + validation | `jwt.strategy.ts` → `common/guards/jwt.guard.ts` |
| Roles/permissions post-auth | `common/guards/permission.guard.ts`, `common/guards/role.guard.ts` |
| User schema | `UsrcatService` in `src/modules/usrcat/` (NOT this module) |
| Error codes | ERR_10002, ERR_10003, ERR_10004, ERR_11002, ERR_11005, ERR_11007, ERR_11008 |

## ANTI-PATTERNS

- 7 `any` type annotations in controller (req/body/res params) — add typed interfaces
- `console.log()` in `auth.service.ts` (lines 44, 84) and `jwt.strategy.ts` (line 30) — use Logger
- Plain-text password comparison — bcrypt exists but disabled. Stored plain-text in DB.
- `authSerevice` typo in `local.strategy.ts` line 10 — should be `authService`
- Commented-out `loginMobile` endpoint — remove dead code
- Do NOT hardcode JWT secrets — always use `JWT_SECRET` from `.env`

## DEPENDENCIES

passport, passport-jwt, passport-local, @nestjs/jwt, @nestjs/passport, svg-captcha, redis (via RedisService)
