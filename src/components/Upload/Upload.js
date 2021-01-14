import * as React from 'react';
import { useRef } from 'react';
import './Upload.scss';
// import FilterSVGIcon from '../../assets/icons/filter.svg';
import AddSVGIcon from '../../assets/icons/add.svg';

Upload.propTypes = {};

function Upload({ label, imgDescription, className, disableFileOpener, loading, onChange }) {
  const file = useRef();

  function openDialog() {
    if (file && file.current) {
      file.current.click();
    }
  }

  return (
    <div className={`upload ${className ? className : ''}`}>
      <div className='flex border-line green mb-1 br-1 px-1 mt-1'>
        {/*<i className={`fas fa-arrow-up ${loading ? 'moveUpDown' : ''} mr-0-5`} />*/}
        <span className='add' data-align='center-both'>
          <img src={AddSVGIcon} alt='upload' />
        </span>
        <strong className='label' onClick={disableFileOpener ? e => e.preventDefault() : openDialog}>
          {loading ? 'Uploading...' : label}
        </strong>
      </div>
      <input
        type='file'
        accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
        ref={file}
        onChange={onChange}
        id='fileUpload'
      />
      <p className='description mt-1'>{imgDescription}</p>
    </div>
  );
}

export default Upload;
