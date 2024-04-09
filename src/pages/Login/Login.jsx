import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { Container, Form, Button } from "react-bootstrap";

import rootStore from "stores/root.store";

import styles from "./Login.module.scss";

const Login = observer(() => {
  const { realmStore } = rootStore;
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const redirectToMainPage = useCallback(() => {
    if (realmStore.getAuthenticated()) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmStore.getAuthenticated()]);

  useEffect(() => {
    redirectToMainPage();
  }, [redirectToMainPage]);

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await realmStore.init(user, password);
    redirectToMainPage();
  };

  return (
    <Container className={styles.container}>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <Form.Group controlId="formBasicUser">
          <Form.Label>User</Form.Label>
          <Form.Control
            type="user"
            placeholder="User"
            value={user}
            onChange={handleUserChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className={styles["submit-btn"]}
        >
          Log In
        </Button>
      </Form>
    </Container>
  );
});

export default Login;
