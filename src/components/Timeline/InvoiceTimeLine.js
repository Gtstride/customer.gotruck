import React from 'react';
import TimelineStyle from '../../styles/TimelineStyle';
import { uuid } from '../../_utils/fx';

function InvoiceTimeLine({ timelineDetails }) {
  function recTimeline() {
    // Settle the styles here.
    const ulStyle = `repeat(${timelineDetails.length}, 1fr)`;
    const progLinesStyle = `repeat(${timelineDetails.length * 2}, 1fr)`;
    const completeDetails = timelineDetails.filter(({ date, time }) => date !== '' || time !== '').length;
    const progLineStyle = `2/${completeDetails === 1 ? completeDetails * 4 : completeDetails * 2}`;
    return (
      <>
        <ul className='timeline' style={{ gridTemplateColumns: ulStyle }}>
          {timelineDetails.map(({ status, date, time }, index) => {
            return (
              <li
                key={uuid()}
                // className={`timelineStatusBlock ${(index <= newTimelineDetails.length - 1 && 'passed') || ''}`}
                className={`timelineStatusBlock ${(date && time && 'passed') || ''}`}
              >
                <p className='status'>{status}</p>
                {index < timelineDetails.length &&
                  (date && time && (
                    <>
                      <p className='date'>{date}</p>
                      <p className='time'>{time}</p>
                    </>
                  ))}

                {(`${(date && time && 'passed') || ''}` && (
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

export default InvoiceTimeLine;
