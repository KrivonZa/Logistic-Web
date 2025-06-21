// Giải mã JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Kiểm tra token và role hợp lệ
export const hasAccess = (allowedRoles: string[] = []): boolean => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (!token) return false;

  const payload = parseJwt(token);
  const now = Math.floor(Date.now() / 1000);

  //Kiểm tra session
  if (!payload || !payload.exp || payload.exp < now) {
    localStorage.clear();
    return false;
  }

  if (allowedRoles.length === 0) return true;

  return allowedRoles.includes(role || "");
};
