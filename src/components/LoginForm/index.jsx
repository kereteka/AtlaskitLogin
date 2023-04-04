import React, { Fragment, useEffect, useState } from "react";
import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import { Checkbox } from "@atlaskit/checkbox";
import TextField from "@atlaskit/textfield";
import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  ValidMessage,
} from "@atlaskit/form";
import Flag, { FlagGroup } from "@atlaskit/flag";

const LoginForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authenticateUser = (username, password) => {
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Authentication failed.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Authentication successful:", data);
        setSuccessMessage("Authentication successful.");
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        setErrorMessage("Authentication failed.");
      });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);

      // Authenticate user with stored credentials
      authenticateUser(storedUsername, storedPassword);
    }
  }, []);

  const showSuccessFlag = () => {
    return successMessage ? (
      <FlagGroup>
        <Flag
          title="Success"
          description={successMessage}
          icon={<b>✓</b>}
          id="success-flag"
          key="success-flag"
          isDismissAllowed
          onDismiss={() => setSuccessMessage(null)}
        />
      </FlagGroup>
    ) : null;
  };
  const showErrorFlag = () => {
    return errorMessage ? (
      <FlagGroup>
        <Flag
          title="Error"
          description={errorMessage}
          icon={<b>!</b>}
          id="error-flag"
          key="error-flag"
        />
      </FlagGroup>
    ) : null;
  };

  const handleSubmit = (data) => {
    console.log(data, "data");
    let message = {
      username: username || data.username,
      password: password || data.password,
    };
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Authentication failed.");
        }
        return res.json();
      })
      .then((res) => {
        console.log("Authentication successful:", res);
        setSuccessMessage("Authentication successful.");

        if (rememberMe) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("password", data.password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        setErrorMessage("Authentication failed.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        maxWidth: "100%",
        margin: "0 auto",
        flexDirection: "column",
      }}
    >
      <Form onSubmit={handleSubmit}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <FormHeader
              title="Sign in"
              description="* indicates a required field"
            />
            <FormSection>
              <Field
                aria-required={true}
                name="username"
                label="Username"
                isRequired
                defaultValue="kminchelle"
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="off" {...fieldProps} />
                    {!error && (
                      <HelperMessage>
                        You can use letters, numbers and periods.
                      </HelperMessage>
                    )}
                    {error && (
                      <ErrorMessage>
                        This username is already in use, try another one.
                      </ErrorMessage>
                    )}
                  </Fragment>
                )}
              </Field>
              <Field
                aria-required={true}
                name="password"
                label="Password"
                defaultValue="0lelplR"
                isRequired
                onChange={(e) => setPassword(e.target.value)}
                validate={(value) =>
                  value && value.length < 7 ? "TOO_SHORT" : undefined
                }
              >
                {({ fieldProps, error, valid, meta }) => {
                  return (
                    <Fragment>
                      <TextField type="password" {...fieldProps} />
                      {error && !valid && (
                        <HelperMessage>
                          Use 8 or more characters with a mix of letters,
                          numbers and symbols.
                        </HelperMessage>
                      )}
                      {error && (
                        <ErrorMessage>
                          Password needs to be more than 7 characters.
                        </ErrorMessage>
                      )}

                      {valid && meta.dirty ? (
                        <ValidMessage>Awesome password!</ValidMessage>
                      ) : null}
                    </Fragment>
                  );
                }}
              </Field>
              <CheckboxField
                name="remember"
                label="Remember me"
                defaultIsChecked={rememberMe}
              >
                {({ fieldProps }) => (
                  <Checkbox
                    {...fieldProps}
                    label="Always sign in on this device"
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                )}
              </CheckboxField>
            </FormSection>

            <FormFooter>
              <ButtonGroup>
                <Button appearance="subtle">Cancel</Button>
                <LoadingButton
                  type="submit"
                  appearance="primary"
                  isLoading={submitting}
                >
                  Sign in
                </LoadingButton>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>
      {showSuccessFlag()}
      {showErrorFlag()}
    </div>
  );
};

export default LoginForm;
