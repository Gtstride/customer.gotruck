import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import decode from 'jwt-decode';
// import logo from '../../assets/images/kobo-logo.png';
import logo from '../../assets/images/gotruck-logo.png';

import { getParams, baseurl, notAllowedSubDomain } from '../../_utils/fx';
import { authorizeUser } from '../../APIs/Read';
import { environment } from "../../_utils/environment";
const sub = window.location.hostname.split('.')[0];

function AuthorizePage() {
  const [loading, setLoading] = useState(true);
  const { push } = useHistory();
  const urlParams = getParams(window.location.search);
  const [blacklisted, setBlacklisted] = useState(0);

  useEffect(() => {
    localStorage.clear();
    setLoading(true);
    const { multiTenant } = environment(sub);

    (async () => {
      try {
        const res = await authorizeUser(urlParams.customerId, urlParams.token);
        const token = res.data.data.token;
        const res2 = await baseurl.post('/user/decodeToken', { token });

        let { customerId, accountName } = res2.data.data;
        if (!notAllowedSubDomain().includes(sub)) {
          const res_ = await baseurl.get(`customer/account/${sub}`);

          // If customer is blacklisted
          if (res_.data.data.customer.blacklisted) {
            setBlacklisted(res_.data.data.customer.blacklisted);
          }

          // Check for multi-tenancy
          if (multiTenant) {
            customerId = 'app';
          } else {
            if (accountName && accountName.length > 0) {
              customerId = accountName;
            }
          }
        } else {
          if (accountName && accountName.length > 0) {
            customerId = accountName;
          }
        }

        let user = {};
        user.token = token;
        user.user = res.data.data.user;
        user.details = res2.data.data;
        localStorage.setItem(`user-${customerId}`, JSON.stringify(user));
        if (blacklisted === 1) {
          push('/');
        } else {
          push(`/${customerId}/dashboard`);
        }
      } catch (error) {
        push('/');
      }
    })();
  }, [blacklisted, push, urlParams.customerId, urlParams.token]);

  if (loading) {
    return (
      <div>
        <div className='gif'>
          <img src={logo} alt='' />
        </div>
        <h3 className='confirmText'>Wait while authorizing you......</h3>
      </div>
    );
  }

  // if(error) {
  //     return (
  //         <div className="confirmBody">
  //             <div className="success-icon-bg" />
  //             <h3 style={{ color: 'red'}}>Error</h3>
  //             <div className="continue-btn" onClick={this.resend}>
  //                 {this.state.status}
  //             </div>
  //         </div>
  //     );
  // }
}

export default AuthorizePage;
