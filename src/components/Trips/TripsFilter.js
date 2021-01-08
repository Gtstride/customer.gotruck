import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowSVGIcon } from '../../assets/icons/Icons';
import FilterStyle from '../../styles/FilterStyle';
import { uuid } from '../../_utils/fx';
import { capitalizeFirstLetter } from '../../_utils/fx';

function TripsFilter({ filterStates, tripsQueryParams, setTripsQueryParams, showFiltersDropdown }) {
  const { t } = useTranslation();
  const { handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      status: tripsQueryParams.filters.status,
      source: tripsQueryParams.filters.source,
      destination: tripsQueryParams.filters.destination,
    },
    async onSubmit(values) {
      // This doesn't do anything (in this case) but Formik requires the function to be there.
    },
  });

  return (
    <FilterStyle>
      <form onSubmit={handleSubmit}>
        <div className='filter__block'>
          <div className='dropdown filterItemDropdown__block'>
            <input id='trip-source__dropdown' className='toggle-trip__source' type='checkbox' />
            <label htmlFor='trip-source__dropdown' className='trip-Source__label'>
              <h2 className='filter__title'>
                <>{t('actions.source')}</>
              </h2>
            </label>
            <div className='collapsible-content'>
              <div className='filterForm__container'>
                <div className='formInputContainer selectContainer'>
                  <div className='select-arrow fa fa-chevron-down'>
                    <ArrowSVGIcon />
                  </div>
                  <select
                    name='source'
                    id='source'
                    value={values.source}
                    onChange={e => {
                      const targetValue = e.target.value;
                      setFieldValue('source', targetValue);
                      showFiltersDropdown(false);
                      return setTripsQueryParams({
                        currentPageIndex: 1,
                        filters: {
                          status: tripsQueryParams.filters.status || 'all',
                          source: targetValue,
                          destination: tripsQueryParams.filters.destination || 'all',
                        },
                      });
                    }}
                  >
                    <option value='all'>{`${t('actions.all')}`}</option>
                    {filterStates.map(state => (
                      <option value={state} key={uuid()}>
                        {capitalizeFirstLetter(state)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='dropdown filterItemDropdown__block'>
            <input id='trip-destination__dropdown' className='toggle-trip__destination' type='checkbox' />
            <label htmlFor='trip-destination__dropdown' className='trip-destination__label'>
              <h2 className='filter__title'>
                <>{t('actions.destination')}</>
              </h2>
            </label>
            <div className='collapsible-content'>
              <div className='filterForm__container'>
                <div className='formInputContainer selectContainer'>
                  <div className='select-arrow fa fa-chevron-down'>
                    <ArrowSVGIcon />
                  </div>
                  <select
                    name='destination'
                    id='destination'
                    value={values.destination}
                    onChange={e => {
                      const targetValue = e.target.value;
                      setFieldValue('destination', targetValue);
                      showFiltersDropdown(false);
                      return setTripsQueryParams({
                        currentPageIndex: 1,
                        filters: {
                          status: tripsQueryParams.filters.status || 'all',
                          source: tripsQueryParams.filters.source || 'all',
                          destination: targetValue,
                        },
                      });
                    }}
                  >
                    <option value='all'>{`${t('actions.all')}`}</option>
                    {filterStates.map(state => (
                      <option value={state} key={uuid()}>
                        {capitalizeFirstLetter(state)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='dropdown filterItemDropdown__block'>
            <input id='status-dropdown' className='toggle-status' type='checkbox' />
            <label htmlFor='status-dropdown' className='status-label'>
              <h2 className='filter__title'>
                <>{t('actions.status')}</>
              </h2>
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
                      const targetValue = e.target.value;
                      setFieldValue('status', targetValue);
                      showFiltersDropdown(false);
                      return setTripsQueryParams({
                        currentPageIndex: 1,
                        filters: {
                          status: targetValue,
                          source: tripsQueryParams.filters.source || 'all',
                          destination: tripsQueryParams.filters.destination || 'all',
                        },
                      });
                    }}
                  >
                    <option value='all'>{`${t('actions.all')}`}</option>
                    <option value='Accepted'>{`${t('trips.accepted')}`}</option>
                    <option value='Positioned'>{`${t('trips.positioned')}`}</option>
                    <option value='In-premise'>{`${t('trips.inPremise')}`}</option>
                    <option value='Loaded'>{`${t('trips.loaded')}`}</option>
                    <option value='Transporting'>{`${t('trips.transporting')}`}</option>
                    <option value='At-destination'>{`${t('trips.atDestination')}`}</option>
                    <option value='Delivered'>{`${t('trips.delivered')}`}</option>
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

export default TripsFilter;
