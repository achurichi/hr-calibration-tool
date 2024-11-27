import { ROLES } from '@/constants/roles';

export const isAdmin = () => {
  return import.meta.env.VITE_ROLE === ROLES.ADMIN;
};
