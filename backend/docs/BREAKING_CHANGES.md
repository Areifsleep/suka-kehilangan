# Breaking Changes Summary: Migration from Permission-based to Role-based Authorization

## Database Schema Changes

### Removed Tables
- `permissions` - Table untuk menyimpan individual permissions
- `role_permissions` - Junction table untuk many-to-many relationship antara roles dan permissions

### Modified Tables
- `roles` - Tetap ada, hanya menghapus relasi ke `role_permissions`

## Code Changes

### Deleted Files
- `src/common/constants/permissions.enum.ts` - Enum untuk permissions
- `src/common/decorators/permissions.decorator.ts` - Decorator untuk permission-based authorization
- `src/common/decorators/permissions.decorator.spec.ts` - Test file untuk permissions decorator
- `src/auth/guards/permissions/permissions.guard.ts` - Guard untuk permission-based authorization
- `src/auth/guards/permissions/permissions.guard.spec.ts` - Test file untuk permissions guard
- `src/user/user.service.spec.ts` - Test file yang menggunakan permission logic
- `src/auth/auth.service.spec.ts` - Test file yang menggunakan permission logic

### New Files
- `src/common/constants/roles.enum.ts` - Enum untuk roles (ADMIN, USER, PETUGAS)
- `src/common/decorators/roles.decorator.ts` - Decorator untuk role-based authorization
- `src/common/decorators/roles.decorator.spec.ts` - Test file untuk roles decorator
- `src/auth/guards/roles/roles.guard.ts` - Guard untuk role-based authorization
- `src/auth/guards/roles/roles.guard.spec.ts` - Test file untuk roles guard

### Modified Files

#### AuthUserObject Type
**Before:**
```typescript
export type AuthUserObject = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  permissions: string[]; // REMOVED
  jti?: string;
};
```

**After:**
```typescript
export type AuthUserObject = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  jti?: string;
};
```

#### UserService Methods
**Removed Methods:**
- `findByUsernameWithAllPermissions(username: string)`
- `findByIdWithAllPermissions(id: string)`

**New Methods:**
- `findByUsernameWithRole(username: string)`
- `findByIdWithRole(id: string)`

#### JWT Strategy
**Before:**
```typescript
const user = await this.userService.findByIdWithAllPermissions(payload.sub);
// ... 
permissions: user.role.role_permissions.map((p) => p.permission.name),
```

**After:**
```typescript
const user = await this.userService.findByIdWithRole(payload.sub);
// permissions property removed from userToSendinRequest object
```

#### AuthService
**Before:**
```typescript
const existingUser = await this.userService.findByUsernameWithAllPermissions(username);
```

**After:**
```typescript
const existingUser = await this.userService.findByUsernameWithRole(username);
```

#### Controllers (Example: UserController)
**Before:**
```typescript
import { PermissionsGuard } from 'src/auth/guards/permissions/permissions.guard';
import { Permission } from 'src/common/constants/permissions.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  @Permissions([Permission.ManageUsers])
  async getUser() { ... }
}
```

**After:**
```typescript
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Roles(Role.ADMIN)
  async getUser() { ... }
}
```

#### SeederService
**Removed Methods:**
- `seedPermissions()`
- `seedRolePermissions()`

**Removed Imports:**
- `PERMISSIONS_DATA` from config-seed

## Migration Applied
- Database migration: `20251204135348_remove_permissions_system`
- Successfully dropped `permissions` and `role_permissions` tables

## Authorization Model

### Before (Permission-based)
- Complex granular permissions (CREATE-REPORT-LOST, VIEW-ALL-REPORTS, etc.)
- Many-to-many relationship: Role ↔ Permission
- User authorization checked against specific permissions

### After (Role-based)
- Simple role-based authorization (ADMIN, USER, PETUGAS)
- Direct relationship: User → Role  
- User authorization checked against role names directly

## Usage Examples

### Before
```typescript
@Permissions([Permission.ManageUsers, Permission.ViewDashboard])
@Get('/admin-only')
adminEndpoint() { ... }
```

### After
```typescript
@Roles(Role.ADMIN)
@Get('/admin-only') 
adminEndpoint() { ... }

// Or for multiple roles
@Roles(Role.ADMIN, Role.PETUGAS)
@Get('/staff-only')
staffEndpoint() { ... }
```

## Benefits
1. **Simplified Architecture** - Removed complex permission system
2. **Better Performance** - No need to query permissions tables
3. **Easier Maintenance** - Role-based is more straightforward to manage
4. **Reduced Complexity** - Less code to maintain and test

## Next Steps
1. Update any remaining controllers to use `@Roles()` decorator instead of `@Permissions()`
2. Update frontend authorization logic to work with roles instead of permissions
3. Update any API documentation to reflect role-based endpoints