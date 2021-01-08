import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowSVGIcon } from '../assets/icons/Icons';
import { useBusinessUnitsState } from '../contexts/BusinessUnitsContext';
import { useGlobalNavState } from '../contexts/GlobalNavContext';
import { useUserDispatch, useUserState } from '../contexts/UserContext';
import GlobalTopNavStyle from '../styles/GlobalTopNavStyle';
import { getCustomerIdFromToken, logOut } from '../_utils/auth';
import { getItemFromLocalStorage } from '../_utils/browser';
import { uuid, notAllowedSubDomain, capitalizeFirstLetter } from '../_utils/fx';
import logo from '../assets/images/kobo-logo.png';
import { environment } from "../_utils/environment";

function GlobalTopNav({ title = '', customerImg }) {
  const { navTitle, itemId, payout } = useGlobalNavState();
  const [isProfilePopupActive, setIsProfilePopupActive] = useState(false);
  const [isBusinessUnitPopupActive, setIsBusinessUnitPopupActive] = useState(false);
  const [customerId, setCustomerId] = useState(undefined);
  const [businessUnitName, setBusinessUnitName] = useState();
  const setUserDetails = useUserDispatch();
  const userDetails = useUserState();
  const { t } = useTranslation();

  const sub = window.location.hostname.split('.')[0];

  // #region Contexts
  const { businessUnit, image, token, adminId } = useUserState();
  const businessUnits = useBusinessUnitsState();

  const { multiTenant } = environment(sub);

  // #endregion
  useEffect(() => {
    if (token) {
      if (!notAllowedSubDomain().includes(sub)) {
        if (multiTenant) {
          setCustomerId('app');
        } else {
          setCustomerId(getCustomerIdFromToken(token));
        }
      } else {
        setCustomerId(getCustomerIdFromToken(token));
      }
    }
  }, [multiTenant, sub, token]);

  useEffect(() => {
    if (customerId && businessUnits) {
      const {
        user: { businessId },
      } = getItemFromLocalStorage(`user-${customerId}`);

      const businessUnit = businessUnits.find(businessUnit => businessUnit.id === businessId);

      if (businessUnit) {
        const { name } = businessUnit;
        setBusinessUnitName(name);
      }
    }
  }, [businessUnitName, businessUnits, customerId]);

  // #region Functions
  // \-_-/ Can we use a mouse (hover/out) event for this?
  function toggleProfilePopup() {
    setIsProfilePopupActive(!isProfilePopupActive);

    if (isBusinessUnitPopupActive) {
      setIsBusinessUnitPopupActive(false);
    }
  }

  function tooggleBusinessUnitPopup() {
    setIsBusinessUnitPopupActive(!isBusinessUnitPopupActive);

    if (isProfilePopupActive) {
      setIsProfilePopupActive(false);
    }
  }

  // #endregion
  return (
    <GlobalTopNavStyle id='globalTopNav'>
      <div className='globalNavLeftContent'>
        <div className='pageTitleBlock'>
          <h1 className='navTitle'>{title || navTitle}</h1>
        </div>
        {itemId && (
          <>
            <div className='separator'></div>
            <div className='tripDetailsBlock'>
              {navTitle !== t('truckRequests.truckRequest') && <p className='tripDetailsTitle'>{navTitle} ID</p>}
              <p className={`tripId ${itemId.toLowerCase()}`}>{itemId}</p>
            </div>
          </>
        )}
        {payout && (
          <>
            <div className='separator'></div>
            <div className='tripDetailsBlock'>
              {/* {navTitle !== t('truckRequests.truckRequest') && <p className='tripDetailsTitle'>{navTitle} ID</p>} */}
              <p className={`tripId ${itemId.toLowerCase()}`}>{capitalizeFirstLetter(payout)}</p>
            </div>
          </>
        )}
      </div>
      <div className='globalNavRightContent'>
        <div className='profileInfoBlock'>
          <div className='profileInfo'>
            <div className='profileNameBlock'>
              {typeof businessUnit === 'string' && businessUnit && businessUnit.toLowerCase() !== 'admin' ? (
                <p className='profileName'>{businessUnit}</p>
              ) : (
                <p className='profileName'>
                  <button onClick={tooggleBusinessUnitPopup}>
                    {businessUnitName ? businessUnitName : `${t('common.allUnits')}`}
                  </button>
                </p>
              )}
              {isBusinessUnitPopupActive && (
                <div className='popupBlock popBlock'>
                  <ul className='popupList'>
                    {businessUnits.map(({ name, id }) => (
                      <li key={uuid()}>
                        <p
                          className='businessUnit'
                          onClick={() => {
                            const { user, token } = getItemFromLocalStorage(`user-${customerId}`);
                            const userDetailsWithBusinessUnitId = { token, user: { ...user, businessId: id } };
                            localStorage.setItem(`user-${customerId}`, JSON.stringify(userDetailsWithBusinessUnitId));
                            setBusinessUnitName(name);
                            setIsBusinessUnitPopupActive(false);
                            setUserDetails({ ...userDetails, businessId: id });
                          }}
                        >
                          {name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className='profileRole'>
              {businessUnit && typeof businessUnit === 'string' ? (
                businessUnit.toLowerCase() !== 'admin' ? (
                  <>{t('staff')}</>
                ) : (
                  businessUnit
                )
              ) : adminId && typeof adminId === 'number' ? (
                'Admin'
              ) : (
                <>{t('staff')}</>
              )}
            </p>
          </div>
          <div className='profileAvatarBlock'>
            <button className='popupTriggerBtn dp-flex al-item-ce' onClick={toggleProfilePopup}>
              <div className='profileAvatar'>{image && <img src={image} alt='bizLogo' />}</div>
              <ArrowSVGIcon />
            </button>
            {isProfilePopupActive && (
              <div className='popupBlock'>
                <ul className='popupList'>
                  {/* {typeof businessUnit === 'string' && businessUnit && businessUnit.toLowerCase() === 'admin' ? (
                    <li>
                      <Link to={`/${customerId}/user_profile`} className='fnt-sz-14'>
                        {t('profile')}
                      </Link>
                    </li>
                  ) : (
                    ''
                  )} */}
                  <li>
                    <Link to={`/${customerId}/user_profile`} className='fnt-sz-14'>
                      {t('profile')}
                    </Link>
                  </li>
                  <li>
                    {/* <Link to='/settings' className='fnt-sz-14'>
                      settings
                    </Link> */}
                  </li>
                  <li>
                    <button className='fnt-sz-14 logOutBtn' onClick={() => logOut(customerId)}>
                      {t('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {(customerImg && <div className='logoBlock' style={{ backgroundImage: `url(${customerImg})` }}></div>) || (
            <div className='logoBlock' style={{ backgroundImage: `url(${logo})` }}></div>
          )}
        </div>
      </div>
    </GlobalTopNavStyle>
  );
}

export default GlobalTopNav;
