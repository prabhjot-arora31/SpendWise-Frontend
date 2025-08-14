export const onLogout = (logout, dispatch, navigate) => {
  dispatch(logout());
  navigate("/");
};
