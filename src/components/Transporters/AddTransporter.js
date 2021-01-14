import React, { useCallback, useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addTransporterAPI } from '../../APIs/Create';
import { useFetch } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close.svg';
import { useUserState } from '../../contexts/UserContext';
import AddTransporterStyle from '../../styles/AddTransporterStyle';
import FormStyle from '../../styles/FormStyle';
import TableStyle from '../../styles/TableStyle';
import { toastEnums } from '../../_utils/constants';
import { isArrayEmpty } from '../../_utils/fx';
import { transporterHeaders } from '../../_utils/tableheaders';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import Error from '../Shared/Error';
import Toast from '../Shared/Toast/Toast';
import TableContent from '../Tables/TableContent';
import TableHeader from '../Tables/TableHeader';
import { searchAllTransporters } from '../../APIs/Read';
import { getTransporters } from '../../APIs/Read';
import PopupLoader from '../Loaders/PopupLoader';
// import AddInternalTransporterForm from '../Forms/AddInternalTransporterForm';
import Modal from '../Modals/Modal';
import AddMoreTransporterForm from './AddMoreTransporterForm';

function Table({
  tableParams: { tableFor, headers },
  promises: {
    transporterPromises: { allTransporters },
  },
  page,
  customerId,
  addTransporterAsync,
  paginationData,
  pageQueryParams: { currentPageIndex },
  setQueryParams,
}) {
  const { t } = useTranslation();
  function paginateToNextPage() {
    setQueryParams({
      currentPageIndex: currentPageIndex + 1,
    });
  }

  function paginateToPrevPage() {
    setQueryParams({
      currentPageIndex: currentPageIndex - 1,
    });
  }

  return (
    <main>
      <TableStyle>
        <div className='table-wrap'>
          <table id='table' data-table-for={tableFor.toLowerCase()}>
            <TableHeader
              {...{
                headers,
              }}
            />
            <TableContent
              {...{
                tableData: allTransporters,
                tableFor,
                page,
                customerId,
                addTransporterAsync,
              }}
            />
          </table>
          {allTransporters.length > 1 && paginationData.totalPages > 1 && (
            <div id='tableFooter'>
              <div>
                {currentPageIndex > 1 && (
                  <i className='material-icons pointer' onClick={paginateToPrevPage}>
                    chevron_left
                  </i>
                )}
              </div>
              <div className='currentPage'>{currentPageIndex}</div>
              &nbsp; {t('pagination.of')} &nbsp;
              <div className='totalPages'>{paginationData.totalPages}</div>
              <div>
                {currentPageIndex < paginationData.totalPages && (
                  <i className='material-icons pointer' onClick={paginateToNextPage}>
                    chevron_right
                  </i>
                )}
              </div>
            </div>
          )}
        </div>
      </TableStyle>
    </main>
  );
}

function AddTransporter({ page, transportersQueryParams: { currentPageIndex }, setTransportersQueryParams }) {
  const { t } = useTranslation();
  const { customerId: customerId2 } = useParams();
  const { token, customerId } = useUserState();
  const [allTransporters, setAllTransporters] = useState();
  const { push } = useHistory();
  const { url } = useRouteMatch();
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const [modal, setModal] = useState({
    showModal: false,
    modalType: undefined,
    modalItemId: undefined,
  });

  const [paginationData, setPaginationData] = useState({
    totalPages: undefined,
  });

  const [defaultEndpoint, setDefaultEndpoint] = useState(`/partner/customer/${customerId}?new=1`);
  const {
    response: allTransportersFetchRes,
    error: allTransportersFetchError,
    isLoading: allTransportersFetchIsLoading,
  } = useFetch(defaultEndpoint, token);

  useEffect(() => {
    if (allTransportersFetchRes) {
      setAllTransporters(allTransportersFetchRes.partners);
    }
  }, [allTransportersFetchRes]);

  useEffect(() => {
    if (allTransportersFetchRes) {
      const { partners, ...paginationData } = allTransportersFetchRes;
      setPaginationData({ ...paginationData });
      setAllTransporters(partners);
    }
  }, [allTransportersFetchRes]);

  useEffect(() => {
    setDefaultEndpoint(`/partner/customer/${customerId}?new=1&page=${currentPageIndex}`);
    push(`${url}?page=${currentPageIndex}`);
  }, [currentPageIndex, customerId, push, url]);

  const goBackToTransporters = useCallback(() => push(`/${customerId2}/transporters`), [customerId2, push]);

  useEffect(() => {
    if (toast.toastMessage && toast.toastMessage.toLowerCase() === 'partner added') {
      goBackToTransporters();
    }
  }, [goBackToTransporters, toast, toast.toastMessage]);

  function getModalToShow() {
    switch (modal.modalType) {
      case 'add-more-transporter':
        return <AddMoreTransporterForm {...{ customerId, token, setModal, hideModalShowToast }} />;
      default:
        break;
    }
  }

  function hideModalShowToast({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType: toastType,
      toastMessage,
    });
  }

  async function addTransporterAsync({ transporterId }) {
    try {
      const res = await addTransporterAPI({ partnerId: transporterId, customerId, token });

      if (res) {
        // setToast({
        //   showToast: true,
        //   toastType: 'success',
        //   toastMessage: 'Partner added',
        // });
        setTransportersQueryParams({ currentPageIndex: 1 });
        goBackToTransporters();
      }
    } catch ({ response }) {
      if (response) {
        setToast({
          showToast: true,
          toastType: toastEnums.FAILURE,
          toastMessage: 'Transporter has already been added',
        });
      } else {
        setToast({
          showToast: true,
          toastType: toastEnums.FAILURE,
          toastMessage: 'Something went wrong. Try again.',
        });
      }
    }
  }

  const [searchIsLoading, setSearchIsLoading] = useState(false);
  async function onSearch(value) {
    try {
      setSearchIsLoading(true);
      let res;
      if (value.length > 0) {
        res = await searchAllTransporters({ value, token, customerId });
        if (res) {
          setAllTransporters(res.data.data.partners);
        }
      } else {
        res = await getTransporters({ endpoint: `/partner/customer/${customerId}?new=1`, token });
        if (res) {
          setAllTransporters(res.data.data.partners);
        }
      }
    } catch (error) {
      console.log({ err: error });
    }
    setSearchIsLoading(false);
  }

  if (allTransportersFetchIsLoading) {
    return (
      <AddTransporterStyle>
        <FormStyle position='sticky'>
          <header className='pageHeader'>
            <div className='pageTitle'>
              <h1>
                <>{t('transporters.transMarketplace')}</>
              </h1>
            </div>
            <form id='addTransporterSearchForm' noValidate>
              <div className='formContentBlock'>
                <div className='formContent'>
                  <div className='fields'>
                    <div className='search formFieldBlock'>
                      <div className='formFieldWrap'>
                        <input
                          placeholder={`${t('transporters.typeToSearchTrans')}`}
                          className='search formField'
                          type='search'
                          name='search'
                          id='searchTransporters'
                          autoComplete='off'
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className='cancelBlock'>
              <button
                className='cancelButton'
                onClick={() => {
                  setTransportersQueryParams({ currentPageIndex: 1 });
                  return push(`/${customerId2}/transporters`);
                }}
              >
                <span className='buttonIcon'>
                  <img src={CloseSVGIcon} alt='close' />
                </span>
                <span className='buttonText'>
                  <>{t('buttons.cancel')}</>
                </span>
              </button>
            </div>
          </header>
        </FormStyle>
        <ContentLoader />
      </AddTransporterStyle>
    );
  }

  if (isArrayEmpty(allTransporters)) {
    return (
      <AddTransporterStyle>
        <FormStyle position='sticky'>
          <header className='pageHeader'>
            <div className='pageTitle'>
              <h1>
                <>{t('transporters.transMarketplace')}</>
              </h1>
            </div>
            <form id='addTransporterSearchForm' noValidate>
              <div className='formContentBlock'>
                <div className='formContent'>
                  <div className='fields'>
                    <div className='search formFieldBlock'>
                      <div className='formFieldWrap'>
                        <DebounceInput
                          onChange={e => onSearch(e.target.value)}
                          minLength={0}
                          debounceTimeout={50}
                          type='search'
                          name='search'
                          autoComplete='off'
                          className='search formField'
                          placeholder={`${t('transporters.typeToSearchTrans')}`}
                        />
                        {searchIsLoading && (
                          <div className='popupItemWrap loading'>
                            <PopupLoader />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className='cancelBlock'>
              <button
                type='submit'
                className='add-trans dp-flex'
                style={{ transition: 'none' }}
                onClick={() =>
                  setModal({
                    showModal: true,
                    modalItemId: '',
                    modalType: 'add-more-transporter',
                  })
                }
              >
                {t('buttons.createNewTransporter')}
              </button>
              <button
                className='cancelButton'
                onClick={() => {
                  setTransportersQueryParams({ currentPageIndex: 1 });
                  return push(`/${customerId2}/transporters`);
                }}
              >
                <span className='buttonIcon'>
                  <img src={CloseSVGIcon} alt='close' />
                </span>
                <span className='buttonText'>
                  <>{t('buttons.cancel')}</>
                </span>
              </button>
            </div>
          </header>
        </FormStyle>
        <main className='pageContent'>
          <div className='innerMain'>
            <main>
              <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.cannotFindTransporter')}`} />
            </main>
          </div>
        </main>
        <Toast {...{ ...toast, setToast }} />
      </AddTransporterStyle>
    );
  }

  if (allTransportersFetchError) {
    return <Error {...{ error: allTransportersFetchError }} />;
  }

  return (
    <AddTransporterStyle>
      <FormStyle position='sticky'>
        <header className='pageHeader'>
          <div className='pageTitle'>
            <h1>
              <>{t('transporters.transMarketplace')}</>
            </h1>
          </div>
          <form id='addTransporterSearchForm' noValidate>
            <div className='formContentBlock'>
              <div className='formContent'>
                <div className='fields'>
                  <div className='search formFieldBlock'>
                    <div className='formFieldWrap'>
                      <DebounceInput
                        onChange={e => onSearch(e.target.value)}
                        minLength={0}
                        debounceTimeout={50}
                        type='search'
                        name='search'
                        autoComplete='off'
                        className='search formField'
                        placeholder={`${t('transporters.typeToSearchTrans')}`}
                      />
                      {searchIsLoading && (
                        <div className='popupItemWrap loading'>
                          <PopupLoader />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className='cancelBlock'>
            <button
              type='submit'
              className='add-trans dp-flex'
              style={{ transition: 'none' }}
              onClick={() =>
                setModal({
                  showModal: true,
                  modalItemId: '',
                  modalType: 'add-more-transporter',
                })
              }
            >
              {t('buttons.createNewTransporter')}
            </button>
            <button
              className='cancelButton'
              onClick={() => {
                setTransportersQueryParams({ currentPageIndex: 1 });
                return push(`/${customerId2}/transporters`);
              }}
            >
              <span className='buttonIcon'>
                <img src={CloseSVGIcon} alt='close' />
              </span>
              <span className='buttonText'>
                <>{t('buttons.cancel')}</>
              </span>
            </button>
          </div>
        </header>
      </FormStyle>
      <main className='pageContent'>
        <div className='innerMain'>
          <Table
            {...{
              tableParams: {
                tableFor: 'addTransporter',
                headers: transporterHeaders,
              },
              promises: {
                transporterPromises: {
                  allTransporters,
                },
              },
              page,
              customerId,
              addTransporterAsync,
              paginationData,
              pageQueryParams: { currentPageIndex },
              setQueryParams: setTransportersQueryParams,
            }}
          />
        </div>
      </main>
      <Toast {...{ ...toast, setToast }} />
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
    </AddTransporterStyle>
  );
}

export default AddTransporter;
