import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { RiSendPlaneFill } from "react-icons/ri";
import { useGlobleContext } from "../context/context";
import { SEND_MESSAGE } from "../graphql/gql";

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
      console.log(data);
      context.sendMessage(selectedUser.name, data.sendMessage);
      setContent("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

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

          <RiSendPlaneFill
            role="button"
            className="fs-2 text-primary"
            type="submit"
          />
        </Form.Group>
      </Form>
    </div>
  );
}
