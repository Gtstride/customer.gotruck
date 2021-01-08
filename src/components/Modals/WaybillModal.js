import React from 'react';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { uuid, formatImage } from '../../_utils/fx';

function WaybillModal({ waybillClass, previousImage, nextImage, closeWaybill, currentImage, urls }) {
  return (
    <div className={`waybill ${waybillClass}`}>
      <div className='relative_container text-center'>
        <div className='close-button'>
          <div className='relative_container pointer' onClick={() => closeWaybill()}>
            <i className='material-icons center_item '>close</i>
          </div>
        </div>

        <div className='nav-button left center_item_vertically'>
          <div className='relative_container pointer' onClick={previousImage}>
            <i className='material-icons center_item'>arrow_back</i>
          </div>
        </div>
        <div className='nav-button right center_item_vertically'>
          <div className='pointer' onClick={nextImage}>
            <i className='material-icons center_item'>arrow_forward</i>
          </div>
        </div>
        <div className='wayBillBox'>
          <div className='display-inline' style={{ height: '100%' }}>
            <ReactPanZoom
              key={uuid()}
              image={urls.length > 0 ? formatImage(urls[currentImage || 0]) : ''}
              alt='Waybill'
            ></ReactPanZoom>
          </div>
        </div>
        {currentImage !== undefined && (
          <div className='wayBillNav'>
            <div className='left navs pointer' onClick={previousImage}>
              <i className='material-icons center_item'>chevron_left</i>
            </div>
            <div className='count'>
              <span className='count_bg'>
                {currentImage + 1}
                {/* of {waybillLength} */}
              </span>
            </div>
            <div className='right navs pointer' onClick={nextImage}>
              <i className='material-icons center_item'>chevron_right</i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaybillModal;
