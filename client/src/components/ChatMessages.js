import { useMutation } from "@apollo/client";
import classNames from "classnames";
import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useGlobleContext } from "../context/context";
import { GET_MESSAGES } from "../graphql/gql";
import SendMessage from "./SendMessage";

export default function ChatMessages() {
  const { users, setUserMessages, user } = useGlobleContext();
  const selectedUser = users
    ? users.find((user) => user.selected === true)
    : "";
  const to = selectedUser ? selectedUser.name : "";
  const [getMessages] = useMutation(GET_MESSAGES, {
    variables: {
      to,
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      // console.log(data);
      setUserMessages(data.getMessages, to);
    },
  });
  // console.log(users);
  useEffect(() => {
    if (to) {
      getMessages();
    }
  }, [to]);

  if (!selectedUser || !selectedUser.messages) {
    return (
      <Col className="chat-messages col-8 p-0">
        <div className="">
          <div className="chat-messages d-flex flex-column-reverse">
            <p className="text-center">No Message</p>
          </div>
        </div>
      </Col>
    );
  }

  // console.log(selectedUser);

  return (
    <>
      <Col className=" col-8 p-1">
        <div className="">
          <div className="chat-messages d-flex flex-column-reverse">
            {selectedUser.messages.map((message) => {
              return (
                <div
                  className={classNames("text-white d-flex m-1 ", {
                    "justify-content-end": message.from === user.name,
                  })}
                  key={message.uuid}
                >
                  <div
                    className={classNames("rounded-pill bg-primary p-1", {
                      "bg-secondary": message.from !== user.name,
                    })}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </div>
          <SendMessage selectedUser={selectedUser} />
        </div>
      </Col>
    </>
  );
}
