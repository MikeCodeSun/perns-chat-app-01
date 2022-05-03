import React from "react";
import { useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
import { GET_USERS } from "../graphql/gql";
import classnames from "classnames";

import { useGlobleContext } from "../context/context";

export default function ChatUsers() {
  const { setSelectedUser, users, setUsers } = useGlobleContext();
  const { loading, error } = useQuery(GET_USERS, {
    onCompleted(data) {
      setUsers(data.getUsers);
    },
  });
  // console.log(users);
  // check loading
  if (loading) {
    return <h1 className="text-center">Loading...</h1>;
  }
  // check error
  if (error) {
    return <h1 className="text-center">Some Thing went wrong...</h1>;
  }
  // check no users
  if (users.length === 0) {
    return <h1 className="text-center">No users</h1>;
  }
  // console.log(data.getUsers);
  return (
    <>
      <Col className="col-4 p-0 bg-light">
        {users.map((user) => {
          const { name, uuid, lastMessage } = user;
          // console.log(lastMessage);
          return (
            <article
              // role="button"
              key={uuid}
              className={classnames(
                "user-div d-flex align-items-center justify-content-center justify-content-sm-start p-1 ",
                {
                  "bg-secondary": user.selected,
                }
              )}
              onClick={() => setSelectedUser(name)}
            >
              <div>
                <Image
                  src="./img/default-user.jpg"
                  roundedCircle
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="p-1 d-none d-sm-block ">
                <p className="m-0">{name}</p>
                {lastMessage ? (
                  <p className="m-0 fw-lighter" style={{ fontSize: "5px" }}>
                    {lastMessage.content}
                  </p>
                ) : (
                  <p
                    className="m-0 fw-lighter"
                    style={{ fontSize: "5px", margin: "0" }}
                  >
                    connect successfully
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </Col>
    </>
  );
}
