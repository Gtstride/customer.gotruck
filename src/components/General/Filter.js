import { useFormik } from 'formik';
import React from 'react';
import { ArrowSVGIcon } from '../../assets/icons/Icons';
import FilterStyle from '../../styles/FilterStyle';

function Filter({ ordersQueryParams, setOrderQueryParams, showFiltersDropdown }) {
  const { handleSubmit, values } = useFormik({
    initialValues: {
      status: ordersQueryParams.filters.status || 'all',
    },
    async onSubmit(values) {
      console.log('filter values', values);
    },
  });

  return (
    <FilterStyle>
      <form onSubmit={handleSubmit}>
        <div className='filter__block'>
          <div className='dropdown filterItemDropdown__block'>
            <input id='status-dropdown' className='toggle-status' type='checkbox' />
            <label htmlFor='status-dropdown' className='status-label'>
              <h2 className='filter__title'>Status</h2>
            </label>
            <div className='collapsible-content'>
              <div className='filterForm__container'>
                <div className='formInputContainer selectContainer'>
                  <div className='select-arrow fa fa-chevron-down'>
                    <ArrowSVGIcon />
                  </div>
                  <select
                    name='status'
                    id='status'
                    value={values.status}
                    onChange={e => {
                      showFiltersDropdown(false);
                      const targetValue = e.target.value;
                      // setShow(false);
                      return setOrderQueryParams({
                        currentPageIndex: 1,
                        filters: {
                          status: targetValue === 'all' ? null : targetValue,
                        },
                      });
                    }}
                  >
                    <option value='all'>All</option>
                    <option value='pending'>Pending</option>
                    <option value='accepted'>Accepted</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FilterStyle>
  );
}

export default Filter;
