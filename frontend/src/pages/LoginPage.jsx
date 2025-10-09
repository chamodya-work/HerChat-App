import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { login } from "../lib/api";

const LoginPage = () => {
  const { loginDate, setLoginData } = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogin = (e) => {
    e.preventDefault(); //this is for prevent refreshing
    loginMutation(loginDate);
  };

  return <div>LoginPage</div>;
};

export default LoginPage;
