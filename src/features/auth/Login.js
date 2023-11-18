import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import { SquareLoader } from "react-spinners";

import usePersist from '../../hooks/usePersist';

const Login = () => {
  
  // Hooks
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  // errClass is a CSS class. value of it, will be changed according to the relevent status
  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) {
    return <SquareLoader color="white" />;
  }

  //
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  // 
  const handleToggle = () => setPersist(prev => !prev)

  // function for login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (error) {
      if (!error.status) {
        setErrMsg("No Servere Response!");
      } else if (error.status === 400) {
        //Bad request
        setErrMsg("Wrong username & password");
      } else if (error.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(error.data?.message);
      }

      errRef.current.focus();
    }
  };

  let content = (
    <section className="public">
      <header>
        <h2>Employee Login</h2>
      </header>

      <main className="login">
        <form className="form" onSubmit={handleSubmit}>
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>

          <label htmlFor="username">Username :</label>

          <input
            type="text"
            id="username"
            name="username"
            className="form__input"
            ref={userRef}
            value={username}
            onChange={onUsernameChanged}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password :</label>

          <input
            type="password"
            id="password"
            name="password"
            className="form__input"
            value={password}
            onChange={onPasswordChanged}
            required
          />

          <button className="form__submit-button">SIGN IN</button>

          <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        Trust This Device
                    </label>
        </form>
      </main>

      <footer>
        <Link to={"/"}>Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
