import React from 'react';
import { Link } from 'react-router-dom';

function PageTitle({ children }) {
  return (
    <Link className='pageTitle' to='/'>
      {children}
    </Link>
  );
}

export default PageTitle;
