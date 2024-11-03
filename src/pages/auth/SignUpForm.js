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

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
  });
  const { username, password, confirm_password, email } = signUpData;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if passwords match before sending
    if (password !== confirm_password) {
      setErrors({ confirm_password: ['Passwords do not match'] });
      return;
    }

    try {
      // Only send username, password and email to the API
      const registrationData = {
        username,
        password,
        email,
      };
      
      console.log("Sending registration data:", registrationData);
      const response = await axios.post("/api/auth/register/", registrationData);
      console.log("Registration successful:", response.data);
      navigate("/signin");
    } catch (err) {
      console.log("Registration error:", err.response?.data);
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={`justify-content-center ${styles.Row}`}>
      <Col xs={12} md={8} lg={6} className="my-auto py-2 p-md-4">
        <Container className={`p-4 ${styles.Container}`}>
          <h1 className={`${styles.Header} mb-4`}>Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label className="visually-hidden">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                className="shadow-sm"
              />
              {errors?.username?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label className="visually-hidden">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
                className="shadow-sm"
              />
              {errors?.email?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label className="visually-hidden">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                className="shadow-sm"
              />
              {errors?.password?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="confirm_password" className="mb-3">
              <Form.Label className="visually-hidden">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                value={confirm_password}
                onChange={handleChange}
                className="shadow-sm"
              />
              {errors?.confirm_password?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Button type="submit" className={`${styles.Button} w-100`}>
              Sign Up
            </Button>
            {errors?.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className="text-center mt-3">
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignUpForm;