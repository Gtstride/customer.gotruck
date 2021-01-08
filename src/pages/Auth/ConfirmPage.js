import React, { useState, useEffect } from 'react';
import decode from 'jwt-decode';
import gif from '../../assets/images/admin-login.gif';
import { getParams, baseurl } from '../../_utils/fx';

function ConfirmPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('Email verification not successful. Please, try again');
  const urlParams = getParams(window.location.search);

  useEffect(() => {
    const { accountId } = decode(urlParams.token);
    baseurl
      .post(`${process.env.REACT_APP_ENDPOINT}/user/otp/verify`, urlParams)
      .then(() => {
        setLoading(true);
        setError(false);
        baseurl
          .post(
            `${process.env.REACT_APP_ENDPOINT}/user/${accountId}/detail`,
            { email_verified: 1 },
            { headers: { Authorization: `Bearer ${urlParams.token}` } },
          )
          .then(() => {
            setLoading(false);
            setError(false);
          })
          .catch(err => {
            setLoading(false);
            setError(true);
            setMsg(err.response.data.message);
          });
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        setMsg(err.response ? err.response.data.message : 'No network');
      });
  }, [urlParams]);

  function continueToDashboard() {}
  if (loading) {
    return (
      <div>
        <div className='gif'>
          <img src={gif} alt='' />
        </div>
        <h3 className='confirmText'>Wait while we verify your email....</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className='confirmBody'>
        <div className='success-icon-bg' />
        <h3 style={{ color: 'red' }}>Error</h3>
        <p>{msg}</p>
        {/* <div className="continue-btn" onClick={this.resend}>
                    {this.state.status}
                </div> */}
      </div>
    );
  }
  return (
    <div>
      <div className='confirmBody'>
        <div className='success-icon-bg' />
        <h3>Awesome!</h3>
        <p>Your email has been confirmed successfully</p>
        <div className='continueBtn' onClick={continueToDashboard}>
          Continue
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
