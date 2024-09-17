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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    await realmStore.init(user, password);
    setLoading(false);
    redirectToMainPage();
  };

  return (
    <Container className={styles.container}>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <Form.Group controlId="formUser">
          <Form.Label>User</Form.Label>
          <Form.Control
            onChange={handleUserChange}
            placeholder="User"
            type="user"
            value={user}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            autoComplete="on"
            onChange={handlePasswordChange}
            placeholder="Password"
            type="password"
            value={password}
          />
        </Form.Group>

        <Button
          className={styles["submit-btn"]}
          disabled={loading}
          type="submit"
          variant="primary"
        >
          {loading ? "Loading..." : "Log In"}
        </Button>
      </Form>
    </Container>
  );
});

export default Login;
