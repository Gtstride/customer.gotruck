import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginForm from "../components/Forms/Auth/LoginForm";
import PageFooter from "../components/PageFooter";
import PageTitle from "../components/PageTitle";
import AuthPageStyle from "./AuthPageStyle";
import LoginPageStyle from "./LoginPageStyle";
import { setDocumentTitle } from "../_utils/browser";
import logo from "../assets/img/logo-green.png";
import NotFound from "../components/NotFound";
import {
  capitalizeFirstLetter,
  baseurl,
  notAllowedSubDomain,
} from "../_utils/fx";
// import { Swal } from "../components/helpers/errorHandler";
// import { httpPostUrl, httpGetUrl } from "../components/helpers/api";
// import { Loader } from "../components/helpers/Loader";

function LoginPage() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [blacklisted, setBlacklisted] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [subDomain, setSubDomain] = useState(
    "UZI-Logistics-&-Trucking - Customer"
  );

  // const [notAvailable, setNotAvailable] = useState(false);

  const sub = window.location.hostname.split(".")[0];
  useEffect(() => {
    setDocumentTitle(subDomain, "Sign In");
  }, [subDomain]);
  useEffect(() => {
    (async () => {
      //  if(process.env.REACT_APP_ENVIRONMENT !== 'staging') {
      if (!notAllowedSubDomain().includes(sub)) {
        // push(`/${"admin/dashboard"}`);
        try {
          const res = await baseurl.get(`customer/account/${sub}`);

          if (res.data.data) {
            if (res.data.data.customer.image) {
              setImage(res.data.data.customer.image);
            }
            setCustomerId(res.data.data.customer.id);
            setSubDomain(res.data.data.customer.business_name || " - Customer");
            setBlacklisted(res.data.data.customer.blacklisted);
            setShow(true);
          } else {
            // window.open(`//${process.env.REACT_APP_DOMAIN}`, '_self');
            setBlacklisted(res.data.data.customer.blacklisted);
          }
        } catch (error) {
          setBlacklisted(1);
        }
      }
      //  }
    })();
  }, [sub]);

  // if (notAvailable) {
  //   return <p>Yes</p>;
  // }

  if (blacklisted === 1) {
    return <NotFound />;
  }

  // #region Returns
  return (
    <AuthPageStyle id="authPage">
      <LoginPageStyle id="loginPage loginPageStyle">
        <main>
          <div style={{ marginBottom: "1.5em" }}>
            {image ? (
              <div
                className="logoBlock"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            ) : (
              <img src={logo} alt="logo" width={170} height={80} />
            )}
          </div>
          {show ? (
            <PageTitle>
              {capitalizeFirstLetter(subDomain)}
              <div style={{ marginBottom: ".5em" }} />
            </PageTitle>
          ) : (
            <PageTitle>{"CUSTOMER SIGN IN"}</PageTitle>
          )}
          <LoginForm {...{ push, customerId }} />
          {!show && (
            <div className="alternateAuth">
              <Link to="/register">{"Don't Have An Account | Register"}</Link> <br />
              <Link to="/forgot-password">{"Forgot Password"}</Link>
            </div>
          )}
        </main>
        {/* <PageFooter /> */}
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default LoginPage;

// import React, { useEffect, useState } from "react";
// import { Link, useHistory } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import LoginForm from "../components/Forms/Auth/LoginForm";
// import PageFooter from "../components/PageFooter";
// import PageTitle from "../components/PageTitle";
// import AuthPageStyle from "../layouts/AuthPageStyle";
// import LoginPageStyle from "../layouts/LoginPageStyle";
// import { setDocumentTitle } from "../_utils/browser";
// // import logo from '../../assets/images/kobo-logo.png';
// import logo from "../assets/img/gotruck-logo.png";
// import {
//   capitalizeFirstLetter,
//   baseurl,
//   notAllowedSubDomain,
// } from "../_utils/fx";
// // import NotFound from '../../components/NotFound';

// function LoginPage() {
//   // #region Routing
//   const { push } = useHistory();
//   // #endregion
//   const [show, setShow] = useState(false);
//   const { t } = useTranslation();
//   const [image, setImage] = useState("");
//   const [blacklisted, setBlacklisted] = useState(0);
//   const [customerId, setCustomerId] = useState(0);
//   const [subDomain, setSubDomain] = useState("UZI-LOGISTICS-&-TRUCKING - ADMIN");

//   // const [notAvailable, setNotAvailable] = useState(false);

//   const sub = window.location.hostname.split(".")[0];
//   useEffect(() => {
//     setDocumentTitle(subDomain, "Sign In");
//   }, [subDomain]);
//   useEffect(() => {
//     (async () => {
//       //  if(process.env.REACT_APP_ENVIRONMENT !== 'staging') {
//       if (!notAllowedSubDomain().includes(sub)) {
//         // push(`/${}`);
//         try {
//           const res = await baseurl.get(`admin/dashboard/${sub}`);

//           if (res.data.data) {
//             if (res.data.data.customer.image) {
//               setImage(res.data.data.customer.image);
//             }
//             setCustomerId(res.data.data.customer.id);
//             setSubDomain(res.data.data.customer.business_name || " - ADMIN");
//             setBlacklisted(res.data.data.customer.blacklisted);
//             setShow(true);
//           } else {
//             setBlacklisted(res.data.data.customer.blacklisted);
//           }
//         } catch (error) {
//           setBlacklisted(1);
//         }
//       }
//       //  }
//     })();
//   }, [sub]);

//   // if (notAvailable) {
//   //   return <p>Yes</p>;
//   // }

//   if (blacklisted === 1) {
//     // return <NotFound />;
//   }

//   // #region Returns
//   return (
//     <AuthPageStyle id="authPage">
//       <LoginPageStyle id="loginPage loginPageStyle">
//         <main>
//           <div style={{ marginBottom: "1.5em" }}>
//             {image ? (
//               <div
//                 className="logoBlock"
//                 style={{ backgroundImage: `url(${image})` }}
//               ></div>
//             ) : (
//               <img src={logo} alt="logo" width={170} height={80} />
//             )}
//           </div>
//           {show ? (
//             <PageTitle>
//               {capitalizeFirstLetter(subDomain)}
//               <div style={{ marginBottom: ".5em" }} />
//             </PageTitle>
//           ) : (
//             <PageTitle>{t("ADMIN LOGIN")}</PageTitle>
//           )}
//           <LoginForm {...{ push, customerId }} />
//           {!show && (
//             <div className="alternateAuth">
//               {/* <Link to="/register">
//                 {t("DON'T HAVE AN ACCOUNT | REGISTER")}
//               </Link> */}
//             </div>
//           )}
//         </main>
//         <PageFooter />
//       </LoginPageStyle>
//     </AuthPageStyle>
//   );
//   // #endregion
// }

// export default LoginPage;
