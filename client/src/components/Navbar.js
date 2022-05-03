import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGlobleContext } from "../context/context";

export default function Navbar() {
  const { user, logout } = useGlobleContext();
  return (
    <>
      <Container>
        <Row className="mx-auto col-sm-11 col-md-9 col-lg-7 mt-5 bg-light rounded  p-2 ">
          <Col className="d-flex justify-content-around">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              {user ? (
                <Link to="/">{user.name}</Link>
              ) : (
                <Link to="/register">Register</Link>
              )}
            </div>
            <div>
              {user ? (
                <Link to="/login" onClick={logout}>
                  logout
                </Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
