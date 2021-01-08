import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { uuid } from '../_utils/fx';

function SideNavItems({ sideNavItems }) {
  return (
    <nav className='nav-sidenav'>
      {sideNavItems.map(({ navItemsTitle, navItemLinks }) => (
        <React.Fragment key={uuid()}>
          <div className='navItems'>
            {navItemsTitle && (
              <h1 className='navItem' data-role='navItemsTitle'>
                {navItemsTitle}
              </h1>
            )}
          </div>
          {navItemLinks.map(({ dataItem, title, to, exact = false }) => {
            if (
              dataItem === 'battlefield' ||
              dataItem === 'incidentManagement' ||
              dataItem === 'notifications' ||
              dataItem === 'support'
            ) {
              return (
                <h1 className='navItem' data-item={dataItem} key={uuid()}>
                  <a className='item-link' href={to} target='_blank' rel='noopener noreferrer'>
                    {title}
                  </a>
                </h1>
              );
            }
            return (
              <h1 className='navItem' data-item={dataItem} key={uuid()}>
                <NavLink
                  className='item-link'
                  activeClassName='item-link-selected'
                  exact={exact}
                  to={to}
                  title={dataItem}
                >
                  {title}
                </NavLink>
              </h1>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );
}

SideNavItems.propTypes = {
  sideNavItems: PropTypes.array.isRequired,
};

export default SideNavItems;
