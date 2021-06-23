import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowSVGIcon } from '../assets/icons/Icons';

function PageFooter() {
  const { t, i18n } = useTranslation();

  const [isLanguagePopupActive, setIsLanguagePopupActive] = useState(false);

  function toggleLanguageSwitcherPopup() {
    setIsLanguagePopupActive(!isLanguagePopupActive);
  }
  const lang = {
    en: 'English',
    fr: 'Français',
    sw: 'Kiswahili',
    ha: 'Hausa',
    ar: 'عربى',
  };

  function changeLang(lang) {
    toggleLanguageSwitcherPopup();
    i18n.changeLanguage(lang);
    window.location.reload();
  }

  return (
    <footer className='pageFooter'>
      <div className='linksBlock'>
        <Link to=''>
          <>{t('pageFooter.privacy')}</>
        </Link>
        <Link to=''>
          <>{t('pageFooter.terms')}</>
        </Link>
        <Link to=''>
          <>{t('pageFooter.help')}</>
        </Link>
      </div>

      <div className='copyBlock' style={{ display: 'flex', alignItems: 'center' }}>
        <p>
          &copy; <>{t('pageFooter.copyright')}</> Gotruck, {new Date().getFullYear()}
        </p>

        <div className='languageSwitcherBlock'>
          <button className='popupTriggerBtn_ dp-flex al-item-ce' onClick={toggleLanguageSwitcherPopup}>
            {/* <p className='languageSwitcherLabel'>{lang[localStorage.i18nextLng.split(/[-_]/)[0]]}</p> */}
            <ArrowSVGIcon />
          </button>
          {isLanguagePopupActive && (
            <div className='popupBlock_'>
              <ul className='popupList'>
                <li>
                  <div onClick={() => changeLang('en')} className='fnt-sz-14'>
                    English
                  </div>
                </li>
                <li>
                  <div onClick={() => changeLang('fr')} className='fnt-sz-14'>
                    Français
                  </div>
                </li>
                <li>
                  <div onClick={() => changeLang('sw')} className='fnt-sz-14'>
                    Kiswahili
                  </div>
                </li>
                <li>
                  <div onClick={() => changeLang('ha')} className='fnt-sz-14'>
                    Hausa
                  </div>
                </li>
                <li>
                  <div onClick={() => changeLang('ar')} className='fnt-sz-14'>
                    عربى
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;
