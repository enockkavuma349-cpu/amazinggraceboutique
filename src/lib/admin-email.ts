export const ADMIN_EMAIL = "enockkavuma349@gmail.com";

export function isAdminEmail(email: string | null | undefined) {
  return !!email && email.trim().toLowerCase() === ADMIN_EMAIL;
}
