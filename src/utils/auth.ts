// Kiểm tra token và role hợp lệ
export const hasAccess = (allowedRoles: string[] = []): boolean => {
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  if (!token) return false;
  if (allowedRoles.length === 0) return true; // Nếu không truyền role, chỉ cần token là đủ

  return allowedRoles.includes(role || "");
};
