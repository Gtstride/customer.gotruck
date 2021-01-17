import React from 'react';
import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';
import moment from 'moment';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import Page from '../../pages/Page';
import GlobalTopNav from '../GlobalTopNav';
import ContentLoader from '../Loaders/ContentLoader';
import { baseurl } from '../../_utils/fx';
import { getUserDetails } from '../../_utils/auth';
import { withTranslation } from 'react-i18next';
import CustomerNamePromptForm from '../Forms/CustomerNamePromptForm';
import Modal from '../Modals/Modal';

var QuicksightDashboard;

class Dashboard extends React.Component {
  // constructor(props, context) {
  //   super(props, context);
  //   this.state = {
  //     showingDatePicker: false,
  //     dateFrom: moment().subtract(30, 'd').format('YYYY-MM-DD hh:mm'),
  //     dateTo: moment().format('YYYY-MM-DD hh:mm'),
  //     startDateDisplay: moment().subtract(30, 'd'),
  //     endDateDisplay: moment(),
  //     loadingAnalytics: true,
  //     showModal: true,
  //     modal: {
  //       showModal: true, // true or false
  //       modalType: 'form', // string: create, read, update, or delete,
  //       modalItemId: undefined, // Used in times of updating or deleting.
  //     },
  //   };
  // }

  onFocusChange = ({ focused }) => {
    this.setState({ focused });
  };

  onDatesChange({ startDate, endDate }, src) {
    this.setState(
      {
        //startDateDisplay: startDate ? startDate : undefined,
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD hh:mm') : undefined,
        endDateDisplay: endDate ? endDate : undefined,
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD hh:mm') : undefined,
      },
      () => {
        if (this.state.startDate && this.state.endDate) {
          let params = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
          };

          QuicksightDashboard.setParameters(params);
        }
      },
    );
  }

  userId = window.location.pathname.split('/')[1];
  // componentDidMount() {
  //   this.setState({
  //     loadingAnalytics: true,
  //   });

  //   const user = JSON.parse(localStorage.getItem(`user-${this.userId}`));
  //   const userObj = getUserDetails(this.userId);
  //   if (userObj.accountName && userObj.accountName.length > 0) {
  //     this.setState({
  //       modal: {
  //         showModal: false, // true or false
  //         modalType: undefined, // string: create, read, update, or delete,
  //         modalItemId: undefined, // Used in times of updating or deleting.
  //       },
  //       loadingAnalytics: false,
  //     });
  //   }

  //   baseurl
  //     .get(`analytics/getDashboardUrl?dashboard=CustomerDashboard&email=${user.user.email}`, {
  //       headers: { Authorization: `Bearer ${user.token}` },
  //     })
  //     .then(res => {
  //       const url = `${res.data.data.data.EmbedUrl}&UndoRedoDisabled=true`;
  //       let parameters = {
  //         customerId: userObj.customerId.toString(),
  //         startDate: this.state.dateFrom,
  //         endDate: this.state.dateTo,
  //       };
  //       this.setState({
  //         loadingAnalytics: false,
  //       });

  //       if (userObj.businessId > 0) {
  //         parameters.businessId = userObj.businessId.toString();
  //       }

  //       let options = {
  //         url,
  //         container: '#dashboardContainer',
  //         scrolling: 'yes',
  //         height: 'AutoFit',
  //         loadingHeight: '700px',
  //         width: '100%',
  //         parameters,
  //       };

  //       QuicksightDashboard = QuickSightEmbedding.embedDashboard(options);

  //       QuicksightDashboard.on('error', () => null);

  //       QuicksightDashboard.on('load', () => {
  //         const that = this;
  //         that.setState({
  //           loadingAnalytics: false,
  //         });
  //       });
  //     })
  //     .catch(err => null);
  // }

  setModal = () => {
    this.setState({
      modal: {
        showModal: false, // true or false
        modalType: undefined, // string: create, read, update, or delete,
        modalItemId: undefined, // Used in times of updating or deleting.
      },
    });
  };

  // getModalToShow = () => {
  //   if (!this.state.loadingAnalytics) {
  //     return (
  //       <CustomerNamePromptForm
  //         {...{
  //           setModal: this.setModal,
  //           document,
  //         }}
  //       />
  //     );
  //   }
  // };

  render() {
    const { t } = this.props;
    // if(this.state.showModal) {
    //   return <CustomerNamePromptForm />;
    // }

    return (
      <>
        <div className='globalNavBlock'>
          {/* <GlobalTopNav customerImg={this.props.businessProfile.customerImg} title={<>{t('navTitle.dashboard')}</>} /> */}
        </div>
        <Page>
          <header className='dashboardHeader'>
            <h1>{t('dashboard.customerAnalytics')}</h1>
            <div className='date'>
              <p>{t('dashboard.startAndEndDate')}</p>
              {/* <DateRangePicker
                startDate={this.state.startDateDisplay}
                startDateId='created_start_date'
                endDate={this.state.endDateDisplay}
                endDateId='created_end_date'
                onDatesChange={date => this.onDatesChange(date)}
                focusedInput={this.state.focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
                minimumNights={0}
                isOutsideRange={isInclusivelyBeforeDay}
                displayFormat='DD-MM-YYYY'
                startDatePlaceholderText='Start Date'
                endDatePlaceholderText='End Date'
                isRTL={localStorage.i18nextLng === 'ar'}
              /> */}
            </div>
          </header>

          {/* {this.state.loadingAnalytics ? <ContentLoader /> : <div id='dashboardContainer'></div>}
          {!this.state.loadingAnalytics && (
            <Modal {...{ modal: this.state.modal, setModal: this.setModal }}>{this.getModalToShow()}</Modal>
          )} */}
        </Page>
      </>
    );
  }
}

export default withTranslation()(Dashboard);
