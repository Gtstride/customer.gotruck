import React, { useRef } from 'react';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';
import CardStyle from '../../styles/CardStyle';
import Card from '../General/Card';
import DownloadSVGIcon from '../../assets/icons/download-green.svg';
import InvoicePaneStyle from './InvoicePaneStyle';
// import ReactDOM from 'react-dom';
import { savePDF } from '@progress/kendo-react-pdf';
import koboLogo from '../../assets/icons/logo.png';
import phone from '../../assets/icons/phone.png';
import mail from '../../assets/icons/mail.png';
import signature from '../../assets/icons/signature.png';
import { formatCurrency } from '../../_utils/fx';

function InvoiceSidePane({ invoiceDetails, url }) {
  const { t } = useTranslation();
  const download = useRef(null);
  const exportPDF = () => {
    savePDF(download.current, {
      paperSize: 'A4',
      fileName: `${invoiceDetails.customerName} - ${invoiceDetails.invoiceId}`,
    });
  };
  return (
    <div className='invoiceBlocksSidePane'>
      <CardStyle>
        <Card
          total={invoiceDetails.total}
          label={`${t('invoices.totalInvoiceAmt')}`}
          type='tripPrice'
          currency={invoiceDetails.currency}
        />
      </CardStyle>
      <div style={{ height: 0, width: 0, overflow: 'hidden' }}>
        {/* InvoiceStart */}
        <div className='invoice' ref={download}>
          <div className='invoice-header middle main-width'>
            <img src={koboLogo} alt='kobo-logo' className='' />
            <div className='title'>
              <h1>100 KOBO LOGISTICS LTD</h1>
              <p className='center caption'>22, Ikorodu Road, Jibowu, Yaba, Lagos.</p>
              <div className='contact-invoice fnt-8 flex space-between'>
                <div className='tel flex mgr-big'>
                  <img src={phone} alt='' className='icon-width mgr-small ' />
                  <p className='mgr-medium bold'>Tel:</p>
                  <p className='grey'>0803 480 1380</p>
                </div>

                <div className='email flex'>
                  <img src={mail} alt='' className='icon-width mgr-small' />
                  <p className='mgr-medium bold'>Email:</p>
                  <p className='grey'>info@kobo360.com</p>
                </div>
              </div>
            </div>
          </div>
          <section className='section main-width'>
            <h1 className='center mgb-medium title-invoice bold'>INVOICE</h1>
            <div className='section-header flex space-between mgb-medium'>
              <p className='bold'>ISSUED TO:</p>
              <p className='bold'>INVOICE DETAILS</p>
            </div>
            <div className='customer-details'>
              <div className='grid-details mgb-medium'>
                <div className='detail  flex'>
                  <p className='invoice-label bold'>CUSTOMER:</p>
                  <p className='invoice-content'>{invoiceDetails.customerName}</p>
                </div>
                <div className='detail flex'>
                  <p className='invoice-label bold'>CUSTOMER ID:</p>
                  <p className='invoice-content'>{invoiceDetails.customerId}</p>
                </div>
              </div>
              <div className='grid-details mgb-medium'>
                <div className='detail flex'>
                  <p className='invoice-label bold'>PHONE:</p>
                  <p className='invoice-content'>{invoiceDetails.customerPhone}</p>
                </div>
                <div className='detail flex '>
                  <p className='invoice-label bold'>INVOICE DATE:</p>
                  <p className='invoice-content'>
                    {invoiceDetails.created ? <Moment date={invoiceDetails.created} format='DD-MM-YYYY' /> : ''}
                  </p>
                </div>
              </div>
              <div className='grid-details mgb-medium'>
                <div className='detail flex'>
                  <p className='invoice-label bold'>EMAIL:</p>
                  <p className='invoice-content'>{invoiceDetails.customerEmail}</p>
                </div>
                <div className='detail flex'>
                  <p className='invoice-label bold'>INVOICE NUMBER:</p>
                  <p className='invoice-content'>{invoiceDetails.invoiceId}</p>
                </div>
              </div>
              <div className='grid-details mgb-medium'>
                <div className='detail flex'>
                  <p className='invoice-label bold'>ATTENTION:</p>
                  <p className='invoice-content'>{invoiceDetails.attention}</p>
                </div>
                <div className='detail flex'>
                  <p className='invoice-label bold'>ORDER PROCESS TIME:</p>
                  <p className='invoice-content'>
                    {invoiceDetails.created ? <Moment date={invoiceDetails.created} format='hh:mm A' /> : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className='table-container fnt-5 mgb-medium'>
              <div className='section-header grid-section mgb-medium bold'>
                <p className='left bold'>DATE</p>
                <p className='left bold'>DESCRIPTION</p>
                <p className='left bold'>SO/WAYBILL NUMBER</p>
                <p className='left bold'>ITEM</p>
                <p className='right bold'>AMOUNT</p>
              </div>
              {/* Table Content */}
              {invoiceDetails.trips.map((item, index) => (
                <div className='section-details grid-section mgb-medium grey' key={index}>
                  <p className='left'>
                    {' '}
                    <Moment date={item.requestDate} format='DD-MMM-YY' />
                  </p>
                  <p className='left'>
                    {' '}
                    {`${item.assetClassSize} ${item.assetClassUnit} from ${item.source} to ${item.destination}`}
                    <br />
                    {item.regNumber}
                  </p>
                  <p className='left'>
                    {item.waybillImage ? (
                      item.waybillImage.length > 0 ? (
                        item.waybillImage.map(w => w.waybillNumber).join(' / ')
                      ) : item.salesOrder ? (
                        item.salesOrder
                      ) : (
                        <span className='font-slant italics'>None</span>
                      )
                    ) : (
                      <span className='font-slant italics'>None</span>
                    )}
                  </p>
                  <p className='left'>{`${item.goodCategory ? item.goodCategory + ' - ' : ''} ${item.goodType}`}</p>
                  <p className='right'> {formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>

            <div className='summary'>
              <span className='summary-details fnt-6 mgb-small'>
                <p className='bold'>SUB TOTAL</p>
                <p className='right'>{formatCurrency(invoiceDetails.subTotal)}</p>
              </span>
              <span className='summary-details fnt-6 mgb-small'>
                <p className='bold'>VAT ({invoiceDetails.vatPercentage}%)</p>
                <p className='right'>{formatCurrency(invoiceDetails.vatAmount)}</p>
              </span>
              <span className='summary-details mgb-small'>
                <p className='bold'>TOTAL</p>
                <p className='right'> {formatCurrency(invoiceDetails.total)}</p>
              </span>
            </div>
            <p className='font-slant italics mgb-medium'>a. Always refer to your previous balance for update</p>

            <div className='bank-details mgb-medium'>
              <span className='flex mgb-medium'>
                <p className='mgr-big'>BANK NAME:</p>
                <p> {invoiceDetails.bank ? invoiceDetails.bank : invoiceDetails.bankName}</p>
              </span>
              <span className='flex mgb-medium'>
                <p className='mgr-big'>ACCOUNT NAME:</p>
                <p> {invoiceDetails.accountName}</p>
              </span>
              <span className='flex mgb-medium'>
                <p className='mgr-big'>ACCOUNT NUMBER:</p>
                <p> {invoiceDetails.accountNumber}</p>
              </span>
            </div>
            <div className='signature flex space-between'>
              <div className='mgt-small caption-font signature-section'>
                <p className='signature-top center'> Customer's Signature & Date</p>
              </div>
              <div className='mgt-small caption-font signature-section'>
                <div className='signature-image flex'>
                  <img src={signature} alt='signature' />
                  <p>
                    {' '}
                    <Moment date={new Date()} format='DD/MM/YYYY' />
                  </p>
                </div>
                <p className='signature-top center'>Accountant's Signature & Date</p>{' '}
              </div>
            </div>
            <p className='center font-slant italics caption-font mgt-big'>Thanks for your patronage</p>
          </section>
        </div>
        {/* InvoiceEnd */}
      </div>

      <InvoicePaneStyle className='paneStyle'>
        <div className='tripStatusBlock'>
          <div className='tripStatusContentBlock' onClick={exportPDF}>
            <span className='tripWaybillIcon pointer'>
              <img src={DownloadSVGIcon} alt={'subheading'} />
              <p className='tripStatusSubheading'>{t('invoices.downloadInvoice')}</p>
            </span>
          </div>
        </div>
      </InvoicePaneStyle>
    </div>
  );
}

export default InvoiceSidePane;
