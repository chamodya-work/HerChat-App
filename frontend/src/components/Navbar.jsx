import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  con = useLogin();
  return <div>Navbar eka wadad bn </div>;
};

export default Navbar;
