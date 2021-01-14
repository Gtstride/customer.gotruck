import React, { useState, useRef } from 'react';
import axios from 'axios';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import FileCSVSVGIcon from '../../assets/icons/upload-top.svg';
import UploadSVGIcon from '../../assets/icons/upload-big-green.svg';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ProgressUploadStyle from '../../styles/ProgressUploadStyle';
import { formatBytes, baseurl, lang } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function UploadProfileFile({ setModal, token, customerId, type, setBusinessProfile, businessProfile }) {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const fileInput = useRef(null);

  function openFileDialog() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function handleImageChange(e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    setError(false);
    setProgress(0);
    setMessage('');
    reader.onloadend = () => {
      setFile(file);
      setPreview(reader.result);
      postImage(file);
    };

    return reader.readAsDataURL(file);
  }

  async function postImage(file) {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': file.type,
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      };

      const data = new FormData();
      data.append('media', file);

      const res = await axios.post(
        `${process.env.REACT_APP_DATA_URL}/upload/customerprofile?purpose=customerprofile&tag=${customerId}`,
        data,
        config,
      );
      if (res && res.data.data && res.data.data.media) {
        setLoading(true);
        updateProfile(file.name.includes('pdf') ? res.data.data.media.url : res.data.data.media.thumb);
      }
    } catch (error) {
      setProgress(0);
      setLoading(false);
      setError(true);
    }

    async function updateProfile(image) {
      try {
        let data;
        if (type.toLowerCase() === 'cac') {
          data = { cac_thumb: image };
        } else {
          data = { tax_thumb: image };
        }
        const res = await baseurl.put(
          `/customer/${customerId}?language=${lang}`,
          { ...data },
          {
            headers: { Authorization: `Bearer ${token}`, Apptoken },
          },
        );
        if (res) {
          setLoading(false);
          setBusinessProfile({ ...businessProfile, ...data });
          setMessage(res.data.message);
          setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
        }
      } catch (error) {
        setLoading(false);
        setError(true);
        setMessage('Upload not successful, please try later');
      }
    }
  }

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <div id='createNewRouteForm'>
          <div className='formContentBlock'>
            {message && (
              <div className={error ? 'error' : 'message'}>
                <p>{message}</p>
              </div>
            )}

            <header className='formHeader'>
              <h2 className='formTitle'>Upload {type} File</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {loading ? (
                  <div className='csvLoader'>
                    <ButtonLoader />
                  </div>
                ) : preview && !loading ? (
                  <div className='preview'>
                    <img className='prevImage' src={preview} alt={type} />
                  </div>
                ) : (
                  <div className='dropZone'>
                    <div className='dropZoneIcon'>
                      <img src={UploadSVGIcon} alt='upload routes' />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='cta'>
              {!preview && (
                <>
                  <button onClick={openFileDialog}>CHOOSE FILE</button>
                  <input
                    ref={fileInput}
                    type='file'
                    accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                    onChange={handleImageChange}
                  />
                </>
              )}
              <button
                type='button'
                className='cancel'
                data-align='center-both'
                onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
              >
                <span className='actionIcon cancel'>
                  <img src={CloseSVGIcon} alt='cancel' />
                </span>
              </button>
            </div>
            {progress > 0 && !error ? (
              <ProgressUploadStyle>
                <div className='uploadProgressBlock'>
                  <div className='uploadIconBlock'>
                    <img src={FileCSVSVGIcon} alt='file' />
                  </div>
                  <div className='progressLineBlock'>
                    <div className='top dp-flex'>
                      <p className='fileTitle'>{file.name}</p>
                      <p className='fileSize'>{formatBytes(file.size)}</p>
                      {/* <p className='cancelUploadIconBlock'>X</p> */}
                    </div>

                    <div className='middle'>
                      <div className='progressBar'></div>
                      <div className='progressLine' style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className='bottom'>
                      <p className='progessPercent'>{progress}% done</p>
                    </div>
                  </div>
                </div>
              </ProgressUploadStyle>
            ) : (
              error && (
                <div className='cta'>
                  <button onClick={openFileDialog}>CHOOSE FILE</button>
                  <input
                    ref={fileInput}
                    type='file'
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    onChange={handleImageChange}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default UploadProfileFile;
