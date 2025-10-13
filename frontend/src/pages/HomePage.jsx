import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const HomePage = () => {
  const queryClient = useQueryClient(); //this is for invalidate some queries

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState([]); // this is use to manage the friend requests button

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  return <div>HomePage</div>;
};

export default HomePage;
