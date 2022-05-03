import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { REGISTER } from "../graphql/gql";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [vars, setVars] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [register] = useMutation(REGISTER, {
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
      navigate("/login");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };
  return (
    <>
      <Container>
        <Row className="mx-auto col-sm-11 col-md-9 col-lg-7 bg-light rounded mt-2">
          <Col>
            <Form className="  p-5 " onSubmit={handleSubmit}>
              <h3>Register</h3>
              {/* email */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label
                  className={`text-capitalize ${errors.email && "text-danger"}`}
                >
                  {errors.email ?? "Email"}
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={vars.email}
                  onChange={(e) => setVars({ ...vars, email: e.target.value })}
                  isInvalid={errors.email}
                />
              </Form.Group>
              {/* name */}
              <Form.Group className="mb-3" controlId="formBasicName">
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
                Already have a account? <Link to="/login">login</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
