import { useSubscription } from "@apollo/client";
import React from "react";
import { Container, Row } from "react-bootstrap";
import ChatMessages from "../components/ChatMessages";
import ChatUsers from "../components/ChatUsers";
import { useGlobleContext } from "../context/context";
import { NEW_REACTION } from "../graphql/gql";

export default function Home() {
  const { user, addReaction } = useGlobleContext();

  const { data, loading, error } = useSubscription(NEW_REACTION, {
    onSubscriptionData: (data) => {
      const reaction = data.subscriptionData.data.newReaction;
      console.log(reaction);
      const username =
        user.name === reaction.message.from
          ? reaction.message.to
          : reaction.message.from;
      // console.log(username);
      const messageId = reaction.message.uuid;
      // console.log(messageId);
      addReaction(username, messageId, reaction);
    },
  });

  // if (loading || error) return <p>loading..error</p>;

  return (
    <>
      <Container>
        <Row className="mx-auto col-sm-11 col-md-9 col-lg-7 bg-white mt-1 rounded">
          <ChatUsers />
          <ChatMessages />
        </Row>
      </Container>
    </>
  );
}
