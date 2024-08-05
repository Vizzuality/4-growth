export const getAuthHeader = (token: string | undefined) => {
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};
