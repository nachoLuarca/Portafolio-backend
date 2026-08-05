const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.jti, req.user.exp, req.body.refreshToken);
  res.json({ success: true });
});

module.exports = { login, me, refresh, logout };
