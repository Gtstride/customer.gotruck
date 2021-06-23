import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import RegisterForm from "../components/Forms/Auth/RegisterForm";
// import PageFooter from "../components/PageFooter";
import PageTitle from "../components/PageTitle";
// import Toast from '../components/Shared/Toast/Toast';
import logo from "../assets/img/logo-green.png";
import AuthPageStyle from "./AuthPageStyle";
import RegisterPageStyle from "./RegisterPageStyle";
import { setDocumentTitle } from "../_utils/browser";

function RegisterPage() {
  const { push } = useHistory();
  const [image, setImage] = useState("");


  useEffect(() => {
    setDocumentTitle("Uzi Logistics -  Customer", "Register");
    setImage();
  }, [push]);

  return (
    <AuthPageStyle id="authPage">
      <RegisterPageStyle id="registerPage">
        <main className="padding-top--50 padding-bottom--100">
          <PageTitle>
            <div style={{ margin: "1.5em" }}>
              {image ? (
                <div
                  className="logoBlock"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
              ) : (
                <img src={logo} alt="logo" className="reg-img" width={100} height={80} />
              )}
            </div>
            {"Customer Register"}
          </PageTitle>
          <RegisterForm {...{ push }} />
          <div className="alternateAuth">
            <Link to="/">{"Have An Account | Sign-in"}</Link>
            {/* <Link to='/'>{('common.alreadyHaveAnAccount')}</Link> */}
          </div>
        </main>
        {/* <Toast {...{ ...toast, setToast }} /> */}
        {/* <PageFooter /> */}
      </RegisterPageStyle>
    </AuthPageStyle>
  );
}

export default RegisterPage;
