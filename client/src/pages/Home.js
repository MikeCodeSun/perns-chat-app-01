import React from "react";
import { Container, Row } from "react-bootstrap";
import ChatMessages from "../components/ChatMessages";
import ChatUsers from "../components/ChatUsers";

export default function Home() {
  // console.log(error);
  // console.log(data);
  // console.log(window.location.host);
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
