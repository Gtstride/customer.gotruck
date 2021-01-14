import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';
import Table from '../Tables/Table';
import { InvoiceHeaders } from '../../_utils/tableheaders';
import { useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import ContentLoader from '../Loaders/ContentLoader';
import { setGlobalNavBarDetails, formatImage, formatCurrency } from '../../_utils/fx';
import Error from '../Shared/Error';
import Block from '../General/Block';
import InvoiceTimeLine from '../Timeline/InvoiceTimeLine';
import InvoiceStyle from '../../styles/InvoiceStyle';
import ArrowCircleLeft from '../../assets/icons/back.svg';
import InvoiceSidePane from './InvoiceSidePane';
import WaybillModal from '../Modals/WaybillModal';
import { isNotEmptyArray } from '../../_utils/fx';

function Invoice() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { token } = useUserState();
  const [invoiceTimeline, setInvoiceTimeline] = useState([]);
  // #endregion
  const { t } = useTranslation();

  const { goBack } = useHistory();
  const [waybillClass, setwaybillClass] = useState('');
  const [urls, setUrls] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const { invoiceId } = useParams();
  const [invoiceid, setInvoiceid] = useState('');
  const [url, setUrl] = useState('');
  const [generalInformation, setGeneralInformation] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [partialInvoicePayments, setPartialPayments] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const { response, error, isLoading } = useFetch(`/invoice/${invoiceId}`, token);


  useEffect(() => {
    if (response) {
      setInvoiceid(response.invoiceId);
      setInvoice(response.trips);
      setUrl(response.url);
      setInvoiceDetails(response);
      if ('partialPayments' in response) {
        setPartialPayments(response.partialPayments);
      }
    }
  }, [response]);

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('invoices.invoice')}</>, itemId: invoiceid }, setGlobalNavDetails);
  }, [setGlobalNavDetails, invoiceid, t]);
  // #region Returns

  useEffect(() => {
    if (invoice.length > 0) {
      const urls = invoice
        .flatMap((x, i) => x.waybillImage)
        .filter(w => w.length !== 0 || w.tripStatus.toLowerCase() === 'at-destination' || w.tripStatus.toLowerCase() === 'delivered')
        .flatMap((x, i) => (x ? formatImage(x.path) : ''));
      setUrls(urls);
    }
  }, [invoice]);

  useEffect(() => {
    if (invoiceDetails) {
      setGeneralInformation([
        { title: <>{t('invoices.customer')}</>, subtitle: invoiceDetails.customerName },
        { title: <>{t('invoices.customerPhone')}</>, subtitle: invoiceDetails.customerPhone },
        {
          title: <>{t('invoices.invoiceDate')}</>,
          subtitle: <Moment date={invoiceDetails.created} format='DD MMM YYYY, hh:mm A' />,
        },
        {
          title: <>{t('invoices.invoiceDueDate')}</>,
          subtitle: <Moment date={invoiceDetails.dueDate} format='DD MMM YYYY, hh:mm A' />,
        },
        { title: <>{t('invoices.attention')}</>, subtitle: invoiceDetails.attention },
        { title: <>{t('common.emailAddress')}</>, subtitle: invoiceDetails.customerEmail },
      ]);
    }
  }, [invoiceDetails, t]);

  useEffect(() => {
    if (invoiceDetails) {
      setInvoiceTimeline([
        {
          status: <>{t('invoices.created')}</>,
          date: <Moment date={invoiceDetails.created} format='DD MMM YYYY' />,
          time: <Moment date={invoiceDetails.created} format='hh:mm A' />,
        },
        {
          status: <>{t('invoices.published')}</>,
          date: invoiceDetails.datePublished ? <Moment date={invoiceDetails.datePublished} format='DD MMM YYYY' /> : '',
          time: invoiceDetails.datePublished ? <Moment date={invoiceDetails.datePublished} format='hh:mm A' /> : '',
          // date: '22 Jan 2020',
          // time: '03:37 PM'
        },
        {
          status: <>{t('invoices.sent')}</>,
          date: invoiceDetails.dateSent ? <Moment date={invoiceDetails.dateSent} format='DD MMM YYYY' /> : '',
          time: invoiceDetails.dateSent ? <Moment date={invoiceDetails.dateSent} format='hh:mm A' /> : '',
          // date: '22 Jan 2020',
          // time: '03:37 PM'
        },
        {
          status: <>{t('invoices.partial')}</>,
          date: invoiceDetails.datePartiallyPaid ? (
            <Moment date={invoiceDetails.datePartiallyPaid} format='DD MMM YYYY' />
          ) : (
            ''
          ),
          time: invoiceDetails.datePartiallyPaid ? (
            <Moment date={invoiceDetails.datePartiallyPaid} format='hh:mm A' />
          ) : (
            ''
          ),
          // date: '22 Jan 2020',
          // time: '03:37 PM'
        },
        {
          status: <>{t('invoices.paid')}</>,
          date: invoiceDetails.datePaid ? <Moment date={invoiceDetails.datePaid} format='DD MMM YYYY' /> : '',
          time: invoiceDetails.datePaid ? <Moment date={invoiceDetails.datePaid} format='hh:mm A' /> : '',
        },
      ]);
    }
  }, [invoiceDetails, t]);

  // function showWaybill(images) {
  //   setwaybillClass('showWaybill');
  //   setUrls(images.flatMap(w => w.path));
  // }

  // function closeWaybill() {
  //   setwaybillClass('');
  // }

  function showWaybill(index) {
    setCurrentImage(index);
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

  let hasPartialPayments;
  let renderPartialInvoiceDataHeaderData = '';
  let renderInvoicePaymentsData = '';
  let totalPartialPaymentsAmount = 0;
  let balanceInvoiceAmount = 0;

    // ensure partialPayments data exist
  if (isNotEmptyArray(partialInvoicePayments)) {
    hasPartialPayments = invoiceDetails.partialPayments;
  }

  /**
   * get partial data header
   */
  if (hasPartialPayments) {

    totalPartialPaymentsAmount = partialInvoicePayments.reduce((sum, partialInvoicePayment) => sum + partialInvoicePayment.amount, 0);
    balanceInvoiceAmount = invoiceDetails.total - totalPartialPaymentsAmount;
  
    const renderPartialInvoiceDataHeader = () => {
    
      const headings = [
        {
          title: `${t('tableHeaders.sn')}`,
        },
        {
          title: `${t('tableHeaders.amount')}`,
        },
        {
          title: `${t('tableHeaders.datePaid')}`,
        },
        {
          title: `${t('tableHeaders.transactionReference')}`,
        },
        {
          title: `${t('tableHeaders.comment')}`,
        },
  
      ];

      const headingsData = headings.map(data => {
        return data.title;
      });

      return headingsData.map((key, index) => {
        return <th key={index}>{key}</th>;
      });
    };

    // re-aasined the method to make usable outside this cold block
    renderPartialInvoiceDataHeaderData = renderPartialInvoiceDataHeader();

    const renderInvoicePayments = () => {
      return partialInvoicePayments.map((partialInvoicePaymentsData, index) => {
        
        const { amount, datePaid, reference, comment } = partialInvoicePaymentsData;
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{invoiceDetails.currency}{formatCurrency(amount)}</td>
            <td>{datePaid ? <Moment date={datePaid} format='YYYY-MM-DD' /> : ''}</td>
            <td>{reference}</td>
            <td>{comment}</td>
          </tr>
        );
      });
    };

    renderInvoicePaymentsData = renderInvoicePayments();
  }
  // #region Renders
  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <Error {...{ error }} />;
  }

  return (
    <div>
      <InvoiceStyle className='dp-grid'>
        <div>
          <div data-align='align-both-div'>
            <button type='button' data-align='center-both' onClick={goBack}>
              <span className='' data-align='center-both'>
                <img src={ArrowCircleLeft} alt='go back' />
              </span>
              {/* Back to invoice list */}
            </button>

            <InvoiceTimeLine timelineDetails={invoiceTimeline} />
          </div>
          <div className='blocks dp-grid'>
            <Block blockTitle={<>{t('invoices.generalInfo')}</>} blockInfo={generalInformation} edit={false} />
            {/* <Block blockTitle='INVOICE NOTE' edit={false} /> */}
          </div>
        </div>
        <InvoiceSidePane {...{ url, invoiceDetails }} />
      </InvoiceStyle>
      
    
      <div className='tripInfoContent mg-top-20'>
        {/* Partial Payment block */}
        {hasPartialPayments ?
          <>
        <div className="invoiceTitle">{t('invoices.partialPayment')}</div>
        <div className="partialPaymentSumAndInvoiceBalanceAmount">
            <div className='partialPaymentSumContainer'>
              {t('invoices.sumofPartialPayments')}: {invoiceDetails.currency}{formatCurrency(totalPartialPaymentsAmount)}
            </div>
            <div className='invoiceBalanceAmountContainer'>
             {t('invoices.balanceInvoiceAmount')}: {invoiceDetails.currency}{formatCurrency(balanceInvoiceAmount)}
            </div>
        </div>
        <table id='partialInvoicePayments'>
          <tbody>
            <tr>{renderPartialInvoiceDataHeaderData}</tr>
            {renderInvoicePaymentsData}
          </tbody>
        </table>
          </>
          :
          '' 
          }
       </div>
         {/* invoice data block */}
      <div className='tripInfoContent mg-top-20'>
          <div className="invoiceTitle">{t('invoices.invoiceTitle')}</div>
          
        <Table headers={InvoiceHeaders} tableData={invoice} tableFor='invoice' showWaybill={showWaybill} />
      </div>
      <WaybillModal {...{ closeWaybill, waybillClass, urls, currentImage, nextImage, previousImage }} />
    </div>
  );
      
}

export default Invoice;
