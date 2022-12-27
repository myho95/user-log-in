import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../Store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_EMAIL":
      return { value: action.val, isValid: action.val.includes("@") };
    case "ON_BLUR":
      return { value: state.value, isValid: state.value.includes("@") };
    default:
      return state;
  }
};
const passReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_PASSWORD":
      return { value: action.val, isValid: action.val.trim().length > 6 };
    case "ON_BLUR":
      return { value: state.value, isValid: state.value.trim().length > 6 };
    default:
      return state;
  }
};
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState(null);
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passState, dispatchPass] = useReducer(passReducer, {
    value: "",
    isValid: null,
  });
  const { isValid: emailIsValid } = emailState;
  const { isValid: passIsValid } = passState;

  const emailRef = useRef();
  const passwordRef = useRef();
  // check Form is valid
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("CHECK!!");
      setFormIsValid(emailIsValid && passIsValid);
      console.log(emailIsValid && passIsValid);
    }, 500);
    return () => {
      console.log("Clear");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passIsValid]);

  // update entered email
  const emailChangeHandler = (event) =>
    dispatchEmail({ type: "INPUT_EMAIL", val: event.target.value });
  // update entered password
  const passwordChangeHandler = (event) => {
    dispatchPass({ type: "INPUT_PASSWORD", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "ON_BLUR" });
  };
  const validatePasswordHandler = () => {
    dispatchPass({ type: "ON_BLUR" });
  };
  const auCtx = useContext(AuthContext);
  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      auCtx.onLogin(emailState.value, passState.value);
    } else if (!emailState.isValid) {
      emailRef.current.action();
    } else {
      passwordRef.current.action();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          isValid={emailState.isValid}
          label="E-Mail"
          type="email"
          id="email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        ></Input>
        <Input
          ref={passwordRef}
          isValid={passState.isValid}
          label="Password"
          type="password"
          id="password"
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        ></Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
