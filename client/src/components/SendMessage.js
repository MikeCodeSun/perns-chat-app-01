import { useMutation, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { RiSendPlaneFill } from "react-icons/ri";
import { useGlobleContext } from "../context/context";
import { NEW_MESSAGE, SEND_MESSAGE } from "../graphql/gql";

export default function SendMessage({ selectedUser }) {
  const [content, setContent] = useState("");
  const context = useGlobleContext();
  // console.log(context.users);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: {
      input: {
        content,
        to: selectedUser.name,
      },
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      // console.log(data);
      // context.sendMessage(selectedUser.name, data.sendMessage);
      setContent("");
    },
  });
  // subscription
  const { data, error, loading } = useSubscription(NEW_MESSAGE, {
    onError(err) {
      console.log(err);
    },
    onSubscriptionData(data) {
      // console.log(data.subscriptionData.data.newMessage);
      const username =
        context.user.name === data.subscriptionData.data.newMessage.from
          ? data.subscriptionData.data.newMessage.to
          : data.subscriptionData.data.newMessage.from;
      // console.log(username);
      context.sendMessage(username, data.subscriptionData.data.newMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // console.log(window.location.host);
  // if (error) {
  //   console.log({ error });
  //   return <p>error ...</p>;
  // }
  // if (loading) return <p>loading ...</p>;

  if (!loading && !error && data) console.log({ data });

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          className="d-flex align-items-center"
          controlId="formBasicContent"
        >
          <Form.Control
            type="text"
            placeholder="type some message"
            className="border-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" className="bg-transparent border-0">
            <RiSendPlaneFill
              role="button"
              type="submit"
              className="fs-2 text-primary"
            />
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
