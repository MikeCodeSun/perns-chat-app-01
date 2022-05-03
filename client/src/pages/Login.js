import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LOGIN } from "../graphql/gql";
import { useNavigate } from "react-router-dom";
import { useGlobleContext } from "../context/context";

export default function Login() {
  const [vars, setVars] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const context = useGlobleContext();
  const [login] = useMutation(LOGIN, {
    variables: {
      input: {
        ...vars,
      },
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      console.log(data);
      context.login(data.login);
      navigate("/");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    login();
  };
  return (
    <>
      <Container>
        <Row className="mx-auto col-sm-11 col-md-9 col-lg-7 bg-light rounded mt-2">
          <Col>
            <Form className="p-5" onSubmit={handleSubmit}>
              <h3>Log In</h3>
              {/* name */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label
                  className={`text-capitalize ${errors.name && "text-danger"}`}
                >
                  {errors.name ?? "Name"}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={vars.name}
                  onChange={(e) => setVars({ ...vars, name: e.target.value })}
                  isInvalid={errors.name}
                />
              </Form.Group>
              {/* password */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label
                  className={`text-capitalize ${
                    errors.password && "text-danger"
                  }`}
                >
                  {errors.password ?? "Password"}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={vars.password}
                  onChange={(e) =>
                    setVars({ ...vars, password: e.target.value })
                  }
                  isInvalid={errors.password}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <p className="fs-6">
                Not have a account? <Link to="/register">Register</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
