import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getFriendRequests } from "../lib/api";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  return <div>NotificationPage</div>;
};

export default NotificationPage;
