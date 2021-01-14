import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import InvoicesTableStyle from '../../styles/InvoicesTableStyle';
import { formatImage, setGlobalNavBarDetails } from '../../_utils/fx';
import { InvoicesHeaders } from '../../_utils/tableheaders';
import { Card } from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import WaybillModal from '../Modals/WaybillModal';
// import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Error from '../Shared/Error';
import Table from '../Tables/Table';
import { getParams } from '../../_utils/fx';

function Invoices({ page }) {
  const { customerId: customerId2 } = useParams();
  let status, mPage;

  const params = getParams(window.location.search);
  if (params.status) {
    status = params.status;
  } else {
    mPage = parseInt(params.page, 10);
  }

  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();
  // #region States
  const [currentPage, setcurrentPage] = useState(mPage > 1 ? mPage : 1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [urls, setUrls] = useState([]);
  const [invoiceInview, setInvoiceInview] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [waybillClass, setwaybillClass] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [limit] = useState(30);
  let defaultEndpoint;
  if (currentPage > 1) {
    defaultEndpoint = `/invoice?customerId=${customerId}&page=${currentPage}&limit=${limit}`;
  } else {
    defaultEndpoint = `/invoice?customerId=${customerId}&limit=${limit}`;
  }
  const { response, error, isLoading } = useFetch(defaultEndpoint, token);
  // #endregion

  // #region Effects
  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('navTitle.invoices')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (response) {
      setInvoices(response.invoices);
      setTotalInvoices(response.total);
      setTotalPage(response.totalPages);
    }
  }, [response]);

  useEffect(() => {
    if (invoices.length > 0) {
      const currentInvoice = invoices && invoices.filter((_, index) => index === invoiceInview)[0];
      const currentInvoiceTrips = currentInvoice && currentInvoice.trips;
      const urls =
        currentInvoiceTrips &&
        currentInvoiceTrips
          .flatMap((x, i) => x.waybillImage)
          .filter(
            w =>
              w.length !== 0 &&
              ((w.tripStatus && w.tripStatus.toLowerCase() === 'at-destination') ||
                w.tripStatus.toLowerCase() === 'delivered'),
          )
          .flatMap((x, i) => (x ? formatImage(x.path) : ''));
      setUrls(urls);
    }
  }, [invoiceInview, invoices]);

  useEffect(() => {
    if (currentPage > 1) {
      push(`/${customerId2}/invoices?page=${currentPage}`);
    } else {
      push(`/${customerId2}/invoices`);
    }
  }, [currentPage, customerId2, mPage, push, status]);

  // #region Functions
  function showWaybill(index) {
    setInvoiceInview(index);
    setwaybillClass('showWaybill');
  }

  function closeWaybill() {
    setwaybillClass('');
    setCurrentImage(0);
  }

  const previousImage = () => {
    let currentIndex = currentImage;
    if (!currentIndex <= 0) {
      setCurrentImage(currentImage - 1);
      // setWaybillIndex(currentImage - 1);
    }
  };

  const nextImage = () => {
    const totalImages = urls.length;
    let currentIndex = currentImage;

    if (totalImages - 1 > currentIndex) {
      setCurrentImage(currentImage + 1);
      // setWaybillIndex(currentImage + 1);
    }
  };

  function nextPage() {
    if (currentPage < totalPage) {
      setcurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    setcurrentPage(currentPage - 1);
  }
  // #endregion

  // #region Renders
  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <Error {...{ error }} />;
  }

  return (
    <PageContent>
      <header className='pageActionsBlock'>
        <Card type='invoiceTotal' label={<>{t('invoices.invoices')}</>} totalInv={totalInvoices} />
      </header>

      <InvoicesTableStyle>
        <Table
          {...{
            headers: InvoicesHeaders,
            tableData: invoices,
            tableFor: 'invoices',
            page,
            showWaybill,
            currentPage,
            totalPage,
            nextPage,
            prevPage,
            customerId: customerId2,
            t,
          }}
        />
      </InvoicesTableStyle>
      {/* <Modal {...{ modal, setModal }}> */}
      <WaybillModal {...{ closeWaybill, waybillClass, urls, currentImage, nextImage, previousImage }} />
      {/* </Modal> */}
    </PageContent>
  );
  // #endregion
}

export default Invoices;
