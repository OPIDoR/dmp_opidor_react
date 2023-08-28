import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ErrorContainer = styled.div`
  height: 100vh !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: montserrat, sans-serif;
`;

const BigText = styled.div`
  font-size: 200px;
  font-weight: 900;
  font-family: sans-serif;
  background: url(https://www.inist.fr/wp-content/uploads/2018/09/012_3132-scaled.jpg) no-repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: cover;
  background-position: center;
`;

const SmallText = styled.div`
  font-family: montserrat, sans-serif;
  color: rgb(0, 0, 0);
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
`;

const Button = styled.button`
  color: #fff;
  padding: 12px 36px;
  font-weight: 600;
  border: none;
  position: relative;
  font-family: "Raleway", sans-serif;
  display: inline-block;
  text-transform: uppercase;
  border-radius: 90px;
  margin: 2px;
  margin-top: 2px;
  background-image: linear-gradient(to right, #09b3ef 0%, #1e50e2 51%, #09b3ef 100%);
  background-size: 200% auto;
  flex: 1 1 auto;
  text-decoration: none;

  &:hover,
  &:focus {
    color: #ffffff;
    background-position: right center;
    box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
    text-decoration: none;
  }
`;

/**
 * CustomError component displays an error message and options for handling the error.
 * @param {string} code - The error code to be displayed. Defaults to '404'.
 * @param {string} message - The error message to be displayed. Defaults to a predefined message.
 * @param {any} error - The error object (if available) for further analysis.
 * @returns {JSX.Element} - A JSX component displaying the error message and options.
 */
function CustomError({ code = '500', message, error }) {
  const { t } = useTranslation();
  const defaultMessage = t("It seems that a problem has appeared");

  return (
    <ErrorContainer className="container">
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-12 text-center">
          <BigText>Oops!</BigText>
          <SmallText>{code} - {message || t("Internal Server Error")}</SmallText>
        </div>
        <div className="col-md-12 text-center">
          <p>{error || defaultMessage}.</p>
          <Button>
            <a href="/">{t("Home page")}</a>
          </Button>
        </div>
      </div>
    </ErrorContainer>
  );
}

export default CustomError;
