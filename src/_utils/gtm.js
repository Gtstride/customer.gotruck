import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  // gtmId: process.env.REACT_APP_GTM_ID || '',
  gtmId: 'GTM-PXKBG6J',
};


export const initGTM = () => {
  TagManager.initialize(tagManagerArgs);
};

export const layData = (page, dataLayerName, user) => {
  const tagManagerArgs = {
    dataLayer: {
      user,
      page,
    },
    dataLayerName,
  };
  TagManager.dataLayer(tagManagerArgs);
};
