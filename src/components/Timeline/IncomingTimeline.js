import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TimelineStyle from '../../styles/TimelineStyle';
import { uuid } from '../../_utils/fx';

function IncomingTimeline({ truck: incomingTruck }) {
  const { t } = useTranslation();

  React.useEffect(() => {
    return () => {
      if (localStorage.getItem('truck')) {
        return localStorage.removeItem('truck');
      }
    };
  });

  function recTimeline() {
    const truck = incomingTruck || JSON.parse(localStorage.getItem('truck'));
    const timelineDetails = truck.statusHistory;
    // return;

    let statuses = [
      'available',
      'accepted',
      'positioned',
      'in premise',
      // 'loaded',
      // 'transporting',
      // 'at destination',
      // 'delivered'
    ];
    const timeDetails = timelineDetails.map(t => {
      if(t.status === 'Available') {
        t.status = 'Accepted';
        return t;
      }

      return t;
    });

    // const CONTAINER_STATUS_LENGTH = 9;
    // const NORMAL_STATUS_LENGTH = 7;

    // Settle the styles here.
    const newTimelineDetails = [{ status: 'available', date: truck.createdDate }, ...timeDetails];
    const ulStyle = `repeat(${statuses.length}, 1fr)`;
    const progLinesStyle = `repeat(${statuses.length * 2}, 1fr)`;
    // const timelineLength =
    //   newTimelineDetails.length > CONTAINER_STATUS_LENGTH
    //     ? !truck.isContainer
    //       ? NORMAL_STATUS_LENGTH
    //       : CONTAINER_STATUS_LENGTH
    //     : newTimelineDetails.length;
    const timelineLength = newTimelineDetails.length;
    const progLineStyle = `${(timelineLength === 1 && -1) || 2}/${timelineLength === 1 ? -1 : timelineLength * 2}`;
    return (
      <>
        <ul className='timeline' style={{ gridTemplateColumns: ulStyle }}>
          {statuses.map((status, index) => {
            return (
              <li
                key={uuid()}
                className={`timelineStatusBlock ${(index <= newTimelineDetails.length - 1 && 'passed') || ''}`}
              >
                <p className='status'>{t(`trips.${status}`)}</p>
                {index < newTimelineDetails.length &&
                  newTimelineDetails[index].status !== 'Flagged' &&
                  newTimelineDetails[index].status !== 'Cancelled' &&
                  (newTimelineDetails[index].date && (
                    <>
                      <p className='date'>{format(new Date(newTimelineDetails[index].date), 'dd-MM-yyyy')}</p>
                      <p className='time'>{format(new Date(newTimelineDetails[index].date), 'hh:mm a')}</p>
                    </>
                  ))}

                {(`${(index <= newTimelineDetails.length - 1 &&
                  newTimelineDetails[index].status !== 'Flagged' &&
                  newTimelineDetails[index].status !== 'Cancelled' &&
                  'passed') ||
                  ''}` && (
                  <div className='statusFlag passed'>
                    <div className='not-flagged'></div>
                  </div>
                )) || (
                  <div className='statusFlag'>
                    <div className='flagged'></div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className='prog-lines' style={{ gridTemplateColumns: progLinesStyle }}>
          <div className='prog-line'></div>
          <div className='prog-line-fill' style={{ gridColumn: progLineStyle }}></div>
        </div>
      </>
    );
  }

  return (
    <TimelineStyle>
      <div className='container'>{recTimeline()}</div>
    </TimelineStyle>
  );
}

export default IncomingTimeline;
