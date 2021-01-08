import React from 'react';
import styled from 'styled-components';
import BizS1Img from '../assets/images/biz-s1.png';
import BizS2Img from '../assets/images/biz-s2.png';
import BizS3Img from '../assets/images/biz-s3.png';
import BizS4Img from '../assets/images/biz-s4.png';
import BizS5Img from '../assets/images/biz-s5.png';
import BizS6Img from '../assets/images/biz-s6.png';
import BizS7Img from '../assets/images/biz-s7.png';
import EPL from '../assets/images/epl.png';
import ETS1 from '../assets/images/ets1.png';
import ETS2 from '../assets/images/ets2.png';
import InfS1Img from '../assets/images/inf-s1.png';
import InfS2Img from '../assets/images/inf-s2.png';
import InvS1Img from '../assets/images/inv-s1.png';
import InvS2Img from '../assets/images/inv-s2.png';
import PlmS1Img from '../assets/images/plm-s1.png';
import RcmS1Img from '../assets/images/rcm-s1.png';
import SPL from '../assets/images/spl.png';
import STT from '../assets/images/stt.png';
import TrS1Img from '../assets/images/tr-s1.png';
import TrS2Img from '../assets/images/tr-s2.png';
import TrS3Img from '../assets/images/tr-s3.png';
import TrS7Img from '../assets/images/tr-s7.png';
import AC from '../assets/images/tr-s8-n.png';
import TrS8Img from '../assets/images/tr-s8.png';
import STR from '../assets/images/tr-s9-n.png';
import TrS9Img from '../assets/images/tr-s9.png';
import TransS1Img from '../assets/images/trans-s1.png';
import TransS2Img from '../assets/images/trans-s2.png';
import TrmS1Img from '../assets/images/trm-s1.png';
import TrmS2Img from '../assets/images/trm-s2.png';
import TrmS3Img from '../assets/images/trm-s3.png';
import TrmS4Img from '../assets/images/trm-s4.png';
import TrpS1Img from '../assets/images/trp-s1.png';
import TrpS2Img from '../assets/images/trp-s2.png';
import GlobalTopNav from '../components/GlobalTopNav';
import Ctruck from '../assets/images/create-truck.png';
import allTrucks from '../assets/images/all-trucks.png';
import editTruckInfo from '../assets/images/edit-truck-info.png';
import editTruckGeneralInfo from '../assets/images/editTruckGeneralInfo.png';
import editTruckInsuranceInfo from '../assets/images/editTruckInsuranceInfo.png';
import editTruckDocs from '../assets/images/editTruckDocs.png';
import enableTruck from '../assets/images/enableTruck.png';
import cdrivers from '../assets/images/cdrivers.png';
import allDrivers from '../assets/images/allDrivers.png';
import editDriverInfo from '../assets/images/edit-driver-info.png';
import editDriverDocs from '../assets/images/edit-driver-docs.png';
import enabledisabledriver from '../assets/images/enabledisabledriver.png';
import assignDrivertoTruck from '../assets/images/assign-to-truck.png';

import { uuid } from '../_utils/fx';
import Page from './Page';

const data = [
  {
    title: 'Creating a truck request',
    subtitle:
      'The Customer Platform allows users to request for trucks in the marketplace, they can create an open truck request or assign a request to a Transporter.',
    steps: [
      {
        step: 'STEP 1: Select truck request',
        img: TrS1Img,
      },
      {
        step: 'STEP 2: Create truck request',
        img: TrS2Img,
      },
      {
        step: 'STEP 3: Select truck type and Business unit',
        img: TrS3Img,
      },
      {
        step: 'STEP 4: Select truck type',
        img: STT,
      },
      {
        step: 'STEP 5: Select pickup location',
        img: SPL,
      },
      {
        step: 'STEP 6: Enter pickup location',
        img: EPL,
      },
      {
        step: 'STEP 7: Add document or Upload document, if applicable',
        img: TrS8Img,
      },
      {
        step: 'STEP 7: Allocate truck request to specific transporter(s)',
        img: TrS7Img,
      },
      {
        step: 'STEP 8: Set expiry date of request',
        img: TrS9Img,
      },
      {
        step: 'STEP 9: Add comment',
        img: AC,
      },
      {
        step: 'STEP 10: Save truck request',
        img: STR,
      },
    ],
  },
  {
    title: 'Truck Request Management',
    steps: [
      {
        step: 'STEP 1: Select truck request',
        img: TrmS1Img,
        imgCaption: [
          'The System displays all saved truck requests on the user account grouped into Open, Assigned and Bulk Allocation Requests',
          'Open Truck Requests: These are truck requests that have not been assigned to a Transporter and are available for pickup for any Transporter at the marketplace.',
          'Assigned Truck Requests: These are truck requests that have been assigned to a Transporter and not available for pickup for any Transporter at the marketplace.',
        ],
      },
      {
        step: 'STEP 2: Click Selected Truck Request',
        img: TrmS2Img,
        imgCaption: [
          'The System displays the selected truck request information with corresponding allocated or assigned Transporter alongside actionable links to edit, assign and cancel.',
        ],
      },
      {
        step: 'STEP 3: Click Edit Truck Request',
        img: TrmS3Img,
        imgCaption: ['Upon clicking Edit Truck Request, the user can update request information at the right pane'],
      },
      {
        step: 'STEP 4: Click Assign to Transporter',
        img: TrmS4Img,
        imgCaption: ['User updating truck request by assigning to a Transporter. '],
      },
    ],
  },
  {
    title: 'Trip Management',
    steps: [
      {
        step: 'STEP 1: Select Trips',
        img: TrpS1Img,
        imgCaption: [
          'The System displays all created trips on the user account grouped into Active, Flagged trips with an option to filter and download reports.',
          'Active Trips: These are created trips not yet delivered. It’s otherwise known as Goods in Transit',
          "Flagged Trips: These are active trips with abnormal conditions, a trip is flagged when it's taking longer than usual to reach destination or when an incident occurs.",
          'Filter Trips: Users can also filter Trip listings based on source, destination and status. E.g accepted, in-position, at-destination, delivered.',
        ],
      },
      {
        step: 'STEP 2: Click Selected Trip',
        img: TrpS2Img,
        imgCaption: [
          'The System displays the selected trip information with Transporter and fleet details, trip status history alongside actionable links to view waybill, Log issues.',
          'TridID: This is the unique identifier for the selected trip auto generated from the platform. This is assigned to every trip created on the user account.',
          'Trip Status History: this is an automated timestamp stored with a trip when notable events occur.',
          'View WayBill: User can view attached waybill to the trip once uploaded',
          'Log Issues: The Platform also allows users log issues for operational and tech support.',
        ],
        thatList: [
          'Accepted: Timestamp when a Transporter accepts the Truck Request',
          'Positioned: when the truck positions in front of the loading facility',
          'In-Premise: Timestamp generated when the truck is inside loading location',
          'Loaded: This is generated immediately the truck finish loading',
          'Transporting: it is captured when the driver starts the Trip to delivery location.',
          'At-destination: this is captured upon arrival of the truck at the recipient.',
          'Delivered: Timestamp when the goods was finally offloaded from the truck.',
        ],
      },
    ],
  },
  {
    title: 'Transporter Management',
    subtitle:
      'The Platform also allows users to manage their transporters subscribed to them. Customers can get their transporters download the Transporter app and then add them to their subscribed transporter list',
    steps: [
      {
        step: 'STEP 1: Click Transporters',
        img: TransS1Img,
        imgCaption: [
          'The System displays all subscribed transporters on the user account with an option to Add, Remove and Search for Subscribed Transporters.',
        ],
      },
      {
        step: 'STEP 2: Click Add Transporters',
        img: TransS2Img,
        imgCaption: [
          'The System displays all subscribed transporters on the user account with an option to Add, Remove and Search for Subscribed Transporters.',
        ],
      },
    ],
  },
  {
    title: 'Invoice Managment',
    subtitle:
      'The Platform also allows users to manage their invoices generated for them, users can view auto invoice generated with associated proof of delivery for processing',
    steps: [
      {
        step: 'STEP 1: Click Invoices',
        img: InvS1Img,
        imgCaption: [
          'The System displays all generated invoices on the user account with an option to view associated proof of delivery uploaded on the platform',
        ],
      },
      {
        step: 'STEP 2: Click Selected Invoice',
        img: InvS2Img,
        imgCaption: [
          'The System displays the selected invoice information with invoice status history, associated trips with proof of delivery alongside actionable links to download invoice',
          'InvoiceID: This is the unique identifier for the selected invoice auto generated from the platform. This is assigned to every invoice created on the user account.',
          'Invoice Status History: this is an automated timestamp stored with an invoice when notable events occur. ',
          'Download Invoice: Users can download E-copy invoices generated from the platform.',
          'Associated Trips: Users can view associated trips that makes up the invoice',
        ],
        thatList: [
          'Created: Timestamp when a the invoice was generated',
          'Published: when the invoice trips and proof of delivery are fully attached',
          'Sent: Timestamp generated when the invoice is sent to the customer.',
          'Partially paid: This is generated immediately a partial payment is made.',
          'Paid: it is captured when the user makes full payment for the invoice.',
        ],
      },
    ],
  },
  {
    title: 'In-field Support',
    subtitle:
      'The Platform also allows users to log issues and request support from the operations team, this helps in getting instant feedback on the operational status when platform visibility cannot suffice.',
    steps: [
      {
        step: 'STEP 1: Click Support',
        img: InfS1Img,
        imgCaption: [
          'The System displays all requested support messages requested by the user with an option to Create Support Message',
        ],
      },
      {
        step: 'STEP 2: Create Message',
        img: InfS2Img,
        imgCaption: ['The user can request for support by filling out the form on the right pane.'],
      },
    ],
  },
  {
    title: 'Business Units Management',
    subtitle:
      'The Platform also allows users to manage and configure their business units alongside departments and users onboarding.',
    steps: [
      {
        step: 'STEP 1: Click Business Units',
        img: BizS1Img,
        imgCaption: ['The System displays all registered business units with an option to add.'],
      },
      {
        step: 'STEP 2: Add Business Units',
        img: BizS2Img,
        imgCaption: ['The User can create new business unit by inserting the name then click save'],
      },
      {
        step: 'STEP 3: Update Business Units',
        img: BizS3Img,
        imgCaption: ['The User can update business unit by inserting the name then click update'],
      },
      {
        step: 'STEP 4: View Business Units',
        img: BizS4Img,
        imgCaption: [
          'The System displays the selected business unit information with invoice status history, associated trips with proof of delivery alongside actionable links to create, edit departments, add users, and resources in a department.',
        ],
      },
      {
        step: 'STEP 5: Create Department',
        img: BizS5Img,
        imgCaption: ['User can add new department in a business unit by inserting name and save'],
      },
      {
        step: 'STEP 6: Add Resource',
        img: BizS6Img,
        imgCaption: [
          'Users can add resources to a department to ensure department users have access privileges to some modules in the platform.',
        ],
      },
      {
        step: 'STEP 7: Add User to Departments',
        img: BizS7Img,
        imgCaption: ['Users can add users to a department by filling form on the right pane and save'],
      },
    ],
  },
  {
    title: 'Pickup Locations Managemeent',
    subtitle:
      'The Platform also allows users to add their Warehouse addresses and system generates their corresponding GPS Addresses.',
    steps: [
      {
        step: 'STEP 1: Click Pickup Locations',
        img: PlmS1Img,
        imgCaption: [
          'The System displays all requested support messages requested by the user with an option to Create Support Message',
        ],
      },
    ],
  },
  {
    title: 'Recipents Management',
    subtitle:
      'The Platform also allows users to add their Warehouse addresses and system generates their corresponding GPS Addresses. ',
    steps: [
      {
        step: 'STEP 1: Click Pickup Locations',
        img: RcmS1Img,
        imgCaption: [
          'The System displays all requested support messages requested by the user with an option to Create Support Message',
        ],
      },
    ],
  },
  {
    title: 'Enable Transporter',
    subtitle: 'Enable your own transporter',
    steps: [
      {
        step: 'STEP 1: Click Enable transporter',
        img: ETS1,
      },
      {
        step: 'STEP 2: Enter transporter business name',
        img: ETS2,
      },
    ],
  },
  {
    title: 'Trucks',
    subtitle: 'Create trucks',
    steps: [
      {
        step: 'STEP 1: Click Create Truck',
        img: Ctruck,
      },
      {
        step: 'STEP 2: View created trucks',
        img: allTrucks,
      },
    ],
  },
  {
    title: 'Trucks',
    subtitle: 'Edit Truck Information',
    steps: [
      {
        step: 'STEP 1: Click Edit (General Information, Insurance Information, or Truck Documents)',
        img: editTruckInfo,
      },
      {
        step: 'STEP 2: Edit General Information',
        img: editTruckGeneralInfo,
      },
      {
        step: 'STEP 3: Edit General Information',
        img: editTruckInsuranceInfo,
      },
      {
        step: 'STEP 4: Edit Truck Documents',
        img: editTruckDocs,
      },
      {
        step: 'STEP 5: Enable Truck',
        img: enableTruck,
      },
    ],
  },
  {
    title: 'Drivers',
    subtitle: 'Create drivers',
    steps: [
      {
        step: 'STEP 1: Click Create Driver',
        img: cdrivers,
      },
      {
        step: 'STEP 2: View created trucks',
        img: allDrivers,
      },
    ],
  },
  {
    title: 'Drivers',
    subtitle: 'Edit Driver Information',
    steps: [
      {
        step: 'STEP 1: Click Edit (Driver Information, Driver Documents)',
        img: editTruckInfo,
      },
      {
        step: 'STEP 2: Edit Driver Information',
        img: editDriverInfo,
      },
      {
        step: 'STEP 2: Edit Driver Documents',
        img: editDriverDocs,
      },
      {
        step: 'STEP 3: Enable or Disable Driver',
        img: enabledisabledriver,
      },
      {
        step: 'STEP 4: Assign Driver to Truck',
        img: assignDrivertoTruck,
      },
    ],
  },
  {
    title: 'General Settings',
    subtitle: 'Customer configuration dashboard for any settings',
    steps: [
      {
        step: 'STEP 1: Save Settings',
        img: cdrivers,
      },
    ],
  },
];

const StyledLearnMore = styled.div`
  display: grid;
  grid-gap: 50px;

  .poo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 50px;
  }

  .sect {
    padding: 50px;
    background-color: #eaeaea;
    border-radius: 10px;
  }

  .title {
    font-weight: 200;
    text-transform: uppercase;
    font-size: 25px;
    font-family: var(--font-bold);
    margin-bottom: 40px;
  }

  p,
  .thatList {
    font-size: 18px;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }

  .thatList {
    list-style: disc;
  }

  .img {
    max-width: 800px;
    border-radius: 10px;
    min-height: 333px;

    img {
      border-radius: inherit;
      box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3),
        0 -12px 36px -8px rgba(0, 0, 0, 0.025);
    }
  }

  .steps {
    > h2 {
      margin-bottom: 20px;
      font-size: 18px;
    }
  }
`;

function LearnMorePage({ businessProfile }) {
  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title='Learn More' customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <StyledLearnMore>
          {data.map(d => {
            return (
              <div className='sect' key={uuid()}>
                <h1 className='title'>{d.title}</h1>
                <p className='subtitle'>{d.subtitle}</p>
                <div className='poo'>
                  {d.steps.map(step => (
                    <div className='steps' key={uuid()}>
                      <h2>{step.step}</h2>
                      <div className='img'>
                        <img src={step.img} alt={d.title} />
                      </div>
                      {step.imgCaption &&
                        step.imgCaption.map(caption => {
                          console.log(caption);
                          return (
                            <>
                              <p key={uuid()}>{caption}</p>
                              <ul>
                                {caption.toLowerCase().trim() ===
                                  'trip status history: this is an automated timestamp stored with a trip when notable events occur.' &&
                                  step.thatList.map(item => <li className='thatList'>{item}</li>)}
                              </ul>
                              <ul>
                                {caption.toLowerCase().trim() ===
                                  'invoice status history: this is an automated timestamp stored with an invoice when notable events occur.' &&
                                  step.thatList.map(item => <li className='thatList'>{item}</li>)}
                              </ul>
                               
                            </>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </StyledLearnMore>
      </Page>
    </>
  );
}

export default LearnMorePage;
