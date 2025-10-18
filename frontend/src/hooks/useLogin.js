import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { login } from '../lib/api';



const useLogin = () => {
    const queryClient = useQueryClient();
    const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    
    //newly added delay for invalidate query
  //   onSuccess: async () => {
  //     // Wait for cookie to be set
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //     // Now invalidate and refetch
  //     await queryClient.invalidateQueries({ queryKey: ["authUser"] });
  // },

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return {isPending, error, loginMutation};
}

export default useLogin;