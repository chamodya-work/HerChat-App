import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

const HomePage = () => {
  const queryClient = useQueryClient(); //this is for invalidate some queries

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set()); // this is use to manage the friend requests button
  // Set use to store only unique values

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendsReqs } = useQuery({
    queryKey: ["outgoingFriendsReqs"],
    queryFn: getOutgoingFriendsReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendsReqs"] }),
  });

  //this is for the update the  setOutgoingRequestsIds
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendsReqs && outgoingFriendsReqs.length > 0) {
      outgoingFriendsReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendsReqs]);

  return <div>HomePage</div>;
};

export default HomePage;
