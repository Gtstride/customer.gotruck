import React, { useEffect, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowSVGIcon } from '../assets/icons/Icons';
import SideNavStyle from '../styles/SideNavStyle';
import SideNavItems from './SideNavItems';
import { useParams } from 'react-router-dom';
import { useUserState } from '../contexts/UserContext';
import ContentLoader from './Loaders/ContentLoader';

function GlobalSideNav({ businessName, customerId }) {
  const { customerId: customerId2 } = useParams();
  const user = JSON.parse(localStorage.getItem(`user-${customerId2}`));
  const { t, i18n } = useTranslation();
  const { businessUnit } = useUserState();
  const [isLanguagePopupActive, setIsLanguagePopupActive] = useState(false);

  let supportPortalId;
  /**
   * get country for specfic user
   * @param {*} userCountry
   */
  const getCurrentUserCountry = userCountry => {
    switch (userCountry) {
      case 'ghana':
        return 24;
      case 'togo':
        return 27;
      case 'uganda':
        return 26;
      case 'kenya':
        return 23;
      case 'kurkina Faso':
        return 29;
      default:
        return 28;
    }
  };

  /**
   * Ensure test support data doesn't get posted on production database
   * @param {*} currentUserCountry
   */
  const validateCurrentUserIsAllowedForProduction = currentUserCountry => {
    if (process.env.REACT_APP_ENVIRONMENT === 'development' || process.env.REACT_APP_ENVIRONMENT === 'staging') {
      supportPortalId = 20;
      return supportPortalId;
    }
    supportPortalId = getCurrentUserCountry(currentUserCountry);
    return supportPortalId;
  };

  const [sideNavItems, setSideNavItems] = React.useState([
    {
      navItemLinks: [
        {
          dataItem: 'dashboard',

          to: `/${customerId2}/dashboard`,

          title: <>{t('navTitle.dashboard')}</>,
        },

        {
          dataItem: 'battlefield',

          to: `${process.env.REACT_APP_BATTLEFIELD_URL}/auth?token=${user ? user.token : ''}`,

          title: <>{t('navTitle.geo')}</>,
        },
        {
          dataItem: 'incidentManagement',
          to: `${process.env.REACT_APP_BATTLEFIELD_URL}/incident-report/?token=${user ? user.token : ''}`,
          title: <>{t('navTitle.incidentManagement')}</>,
        },
        {
          dataItem: 'notifications',
          to: `${process.env.REACT_APP_BATTLEFIELD_URL}/notifications/?token=${user ? user.token : ''}`,
          title: <>{t('navTitle.notifications')}</>,
        },
        {
          dataItem: 'support',
          to: `${
            process.env.REACT_APP_SUPPORT_URL
          }/servicedesk/customer/portal/${validateCurrentUserIsAllowedForProduction(user ? user.user.country : '')}`,
          title: <>{t('navTitle.support')}</>,
        },
      ],
    },
    {
      navItemsTitle: <>{t('navTitle.operations')}</>,
      default: 'operations',
      navItemLinks: [
        { dataItem: 'truckRequest', to: `/${customerId2}/truck_requests`, title: <>{t('navTitle.truckRequests')}</> },
        {
          dataItem: 'incomingTrucks',
          to: `/${customerId2}/incoming_trucks`,
          title: <>{t('navTitle.incomingTrucks')}</>,
        },
        { dataItem: 'trips', to: `/${customerId2}/trips`, title: <>{t('navTitle.trips')}</> },
        {
          dataItem: 'waybillTracker',
          to: `/${customerId2}/waybill_tracker`,
          title: <>{t('waybillTracker.waybillTracker')}</>,
        },
      ],
    },
    {
      navItemsTitle: <>{t('navTitle.fleetManagement')}</>,
      navItemLinks: [
        {
          dataItem: 'transporters',
          to: `/${customerId2}/transporters`,
          title: <>{t('navTitle.transporters')}</>,
        },
        {
          dataItem: 'drivers',
          to: `/${customerId2}/drivers`,
          title: <>{t('tableHeaders.drivers')}</>,
        },
        {
          dataItem: 'trucks',
          to: `/${customerId2}/trucks`,
          title: <>{t('tableHeaders.trucks')}</>,
        },
      ],
    },
    {
      navItemsTitle: <>{t('navTitle.invoice')}</>,

      navItemLinks: [
        {
          dataItem: 'invoices',
          to: `/${customerId2}/invoices`,
          title: <>{t('navTitle.invoices')}</>,
        },
      ],
    },

    {
      navItemsTitle: <>{t('navTitle.insurance')}</>,
      default: 'insurance',
      navItemLinks: [
        {
          dataItem: 'addPolicy',
          to: `/${customerId2}/add_Policy`,
          title: <> {t('navTitle.addPolicy')} </>,
        },
        {
          dataItem: 'policy',
          to: `/${customerId2}/policies`,
          title: <> {t('navTitle.policies')} </>,
        },
      ],
    },
    {
      navItemsTitle: <>{t('navTitle.settings')}</>,

      default: 'settings',

      navItemLinks: [
        {
          dataItem: 'businessProfile',
          to: `/${customerId2}/business_profile`,
          title: <>{t('navTitle.businessProfile')}</>,
        },
        {
          dataItem: 'businessUnit',
          to: `/${customerId2}/business_units`,
          title: <>{t('navTitle.businessUnits')}</>,
        },
        {
          dataItem: 'generalSettings',
          to: `/${customerId2}/general_settings`,
          title: <>{t('navTitle.generalSettings')}</>,
        },
        {
          dataItem: 'pickupLocation',
          to: `/${customerId2}/pickup_locations`,
          title: <>{t('navTitle.pickup')}</>,
        },
        {
          dataItem: 'recipient',
          to: `/${customerId2}/recipients`,
          title: <>{t('navTitle.recipients')}</>,
        },
        {
          dataItem: 'manageUsers',
          to: `/${customerId2}/manage_users`,
          title: <>{t('navTitle.manageUsers')}</>,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (typeof businessUnit === 'string') {
      if (businessUnit && businessUnit.toLowerCase() !== 'admin') {
        let settings = sideNavItems.find(item => item.default === 'settings');
        const removedNav = settings.navItemLinks
          .filter(it => it.dataItem !== 'manageUsers')
          .filter(it => it.dataItem !== 'businessProfile')
          .filter(it => it.dataItem !== 'generalSettings');
        settings.navItemLinks = removedNav;

        let navs = sideNavItems.filter(i => i.default !== 'insurance').filter(i => i.default !== 'default');

        setSideNavItems(navs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnit]);

  function toggleLanguageSwitcherPopup() {
    setIsLanguagePopupActive(!isLanguagePopupActive);
  }

  function changeLang(lang) {
    toggleLanguageSwitcherPopup();
    i18n.changeLanguage(lang);
    window.location.reload();
  }

  function getCurrentLanguage(key) {
    switch (key.toLowerCase()) {
      case 'en':
        return 'English';
      case 'fr':
        return 'Français';
      case 'sw':
        return 'Kiswahili';
      case 'ha':
        return 'Hausa';
      case 'ar':
        return 'عربى';
      default:
        break;
    }
  }

  return (
    <Suspense fallback={<ContentLoader />}>
      <SideNavStyle id='sidenav'>
        <div className='logo'>
          <h1 className='customerName'>{businessName}</h1>
          <span className='customerId'>ID {customerId}</span>
        </div>
        <SideNavItems {...{ sideNavItems }} />
        <div className='languageSwitcherBlock'>
          <button className='popupTriggerBtn dp-flex al-item-ce' onClick={toggleLanguageSwitcherPopup}>
            <p className='languageSwitcherLabel'>
              {getCurrentLanguage((localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0]) || 'en')}
            </p>
            <ArrowSVGIcon />
          </button>
          <div className={`popupBlock${(isLanguagePopupActive && ' active') || ''}`}>
            <ul className='popupList'>
              <li>
                <div
                  onClick={() => changeLang('en')}
                  className='fnt-sz-14'
                  id={`${
                    localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0] === 'en' ? 'selected' : ''
                  }`}
                >
                  English
                </div>
              </li>
              <li>
                <div
                  onClick={() => changeLang('fr')}
                  className='fnt-sz-14'
                  id={`${
                    localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0] === 'fr' ? 'selected' : ''
                  }`}
                >
                  Français
                </div>
              </li>
              <li>
                <div
                  onClick={() => changeLang('sw')}
                  className='fnt-sz-14'
                  id={`${
                    localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0] === 'sw' ? 'selected' : ''
                  }`}
                >
                  Kiswahili
                </div>
              </li>
              <li>
                <div
                  onClick={() => changeLang('ha')}
                  className='fnt-sz-14'
                  id={`${
                    localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0] === 'ha' ? 'selected' : ''
                  }`}
                >
                  Hausa
                </div>
              </li>
              <li>
                <div
                  onClick={() => changeLang('ar')}
                  className='fnt-sz-14'
                  id={`${
                    localStorage.i18nextLng && localStorage.i18nextLng.split(/[-_]/)[0] === 'ar' ? 'selected' : ''
                  }`}
                >
                  عربى
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className='learnMoreBlock'>
          <Link to={`/${customerId2}/learn-more`}>
            <span className='icon'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 34.875 34.875'>
                <path
                  id='Icon_awesome-question-circle'
                  data-name='Icon awesome-question-circle'
                  d='M35.438,18A17.438,17.438,0,1,1,18,.563,17.437,17.437,0,0,1,35.438,18ZM18.468,6.328a9.107,9.107,0,0,0-8.195,4.483.845.845,0,0,0,.191,1.143L12.9,13.8a.843.843,0,0,0,1.172-.149c1.256-1.593,2.117-2.517,4.029-2.517,1.436,0,3.213.924,3.213,2.317,0,1.053-.869,1.594-2.288,2.389-1.654.927-3.843,2.081-3.843,4.968v.281a.844.844,0,0,0,.844.844h3.938a.844.844,0,0,0,.844-.844V21c0-2,5.849-2.085,5.849-7.5C26.662,9.422,22.431,6.328,18.468,6.328ZM18,23.766A3.234,3.234,0,1,0,21.234,27,3.238,3.238,0,0,0,18,23.766Z'
                  transform='translate(-0.563 -0.563)'
                />
              </svg>
            </span>
            <span className='text'>Learn More</span>
          </Link>
        </div>
      </SideNavStyle>
    </Suspense>
  );
}

export default GlobalSideNav;
