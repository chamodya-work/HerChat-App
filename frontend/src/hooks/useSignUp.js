import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signUp } from '../lib/api';

const useSignUp = () => {
const queryClient = useQueryClient(); //this client manage query/mutation states using react query context

  const {
    mutate: signupMutation, // Function to trigger the mutation
    isPending, // Loading state (formerly called 'isLoading')
    error, // Error state
  } = useMutation({
    mutationFn: signUp, // The actual API function
    onSuccess: () => {
      // Callback after successful mutation
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // After signup, this tells React Query to refetch any queries related to authUser
    },
  });

  return {signupMutation,isPending,error};
}

export default useSignUp