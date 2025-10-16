import React, { useState } from "react";
import { useParams } from "react-router";
import { getAuthUser, getStreamToken } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const ChatPage = () => {
  const { id } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = getAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //now this query is only run when authUser is available
  });

  return <div>ChatPage</div>;
};

export default ChatPage;
