import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator untuk menentukan roles yang diperlukan.
 * @param roles - Array role yang diizinkan mengakses endpoint
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
