import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [disablePassword, setDisablePassword] = useState(true)
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if(credential.length >= 4
      && password.length >=6){
        setDisablePassword(false)
      } else {
        setDisablePassword(true)
      }
  },[credential, password])

  const demoUser = (e) => {
    e.preventDefault()

    return dispatch(sessionActions.login({credential: 'demo@user.io', password: 'password'}))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if(data && data.errors) {
          setErrors(data.errors);
        }
      })
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={disablePassword}>Log In</button>
      </form>
      <button onClick={demoUser}>Demo User</button>
    </>
  );
}

export default LoginFormModal;
