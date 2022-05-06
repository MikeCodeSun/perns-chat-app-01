import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { FaSmile } from "react-icons/fa";

import { ADD_REACTION } from "../graphql/gql";

export default function Reactions({ message }) {
  const [show, setShow] = useState(false);

  const reactions = ["👌", "💪", "👍", "👎", "😃", "😡", "😘"];
  const [addReaction] = useMutation(ADD_REACTION, {
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      setShow(false);
      // console.log(data);
    },
  });

  const reactionIcon = reactions.map((reaction) => {
    return (
      <Button
        className="reaction-icon bg-transparent border-0 p-0 m-0"
        key={reaction}
        onClick={() => {
          addReaction({
            variables: {
              input: {
                content: reaction,
                messageId: message.uuid,
              },
            },
          });
        }}
      >
        {reaction}
      </Button>
    );
  });

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key="top"
        placement="top"
        show={show}
        onToggle={setShow}
        rootClose
        overlay={
          <Popover id="popover-positioned-top">
            <Popover.Body className="d-flex p-0 align-items-center">
              {reactionIcon}
            </Popover.Body>
          </Popover>
        }
      >
        <div role="button" className="mx-1 d-flex">
          {message.reactions && message.reactions.length > 0 ? (
            message.reactions.map((r) => {
              return <p key={r.uuid}>{r.content}</p>;
            })
          ) : (
            <FaSmile className="text-secondary" />
          )}
        </div>
      </OverlayTrigger>
    </>
  );
}
