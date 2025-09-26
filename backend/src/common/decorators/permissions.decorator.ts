import { SetMetadata } from '@nestjs/common';

import { Permission } from '../constants/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator untuk menentukan permissions yang diperlukan.
 * Bisa menerima argumen sebagai string terpisah atau sebagai array string.
 */
export const Permissions = (...args: (Permission | Permission[])[]) => {
  // Gunakan .flat() untuk meratakan array jika ada array di dalam array
  const permissions = args.flat();
  return SetMetadata(PERMISSIONS_KEY, permissions);
};
