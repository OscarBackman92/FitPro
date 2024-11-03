// SignInForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axios from "axios";
import styles from "../../styles/SignInUpForm.module.css";
import { useSetCurrentUser } from "../../context/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";

const SignInForm = () => {
  const setCurrentUser = useSetCurrentUser();
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/auth/login/", signInData);
      setCurrentUser(response.data.user);
      setTokenTimestamp(response.data);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={`justify-content-center ${styles.Row}`}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`p-4 ${styles.Container}`}>
          <h1 className={`${styles.Header} mb-4`}>Sign In</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Username"
                name="username"
                value={signInData.username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className="mb-3"
                type="password"
                placeholder="Password"
                name="password"
                value={signInData.password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button className={styles.Button} type="submit">
              Sign In
            </Button>
            {errors?.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className="text-center mt-3">
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignInForm;
