import React from 'react';
import { useTranslation } from 'react-i18next';
import { uuid, isArrayEmpty, getDash } from '../../_utils/fx';
import BlockStyle from '../../styles/BlockStyle';

function Block({ blockTitle, blockInfo = [], type }) {
  const { t } = useTranslation();

  if (isArrayEmpty(blockInfo)) {
    return (
      <BlockStyle>
        <div className='block'>
          <header className='blockHeader dp-flex'>
            <div className='blockTitleBlock'>
              <h1 className='blockTitle bold'>{blockTitle || getDash()}</h1>
            </div>
          </header>
          <div className='emptyBlock'>
            <h1 className='emptyBlockMessage'>{<>{t('common.noDataAvailable')}</>}</h1>
          </div>
        </div>
      </BlockStyle>
    );
  }

  if (type && type === 'summary') {
    return (
      <BlockStyle>
        <div className='block'>
          <header className='blockHeader dp-flex'>
            <div className='blockTitleBlock'>
              <h1 className='blockTitle bold'>{blockTitle}</h1>
            </div>
          </header>
          <ul className='blockInfo'>
            {blockInfo.map(
              ({ title, subtitle }) =>
                title !== 'recipientId' && (
                  <li key={uuid()} className='dp-flex'>
                    <p className='blockInfoTitle'>{title ? title : ''}</p>
                    <p
                      className={`${
                        typeof title === 'string' &&
                        (title.toLowerCase().includes('remaining') || title.toLowerCase().includes('not assigned'))
                          ? 'remaining'
                          : typeof title !== 'string' &&
                            (title.props.children.toLowerCase().includes('remaining') ||
                              title.props.children.toLowerCase().includes('not assigned'))
                          ? 'remaining'
                          : 'blockInfoSubtitle'
                      }`}
                    >
                      {subtitle ? subtitle : ''}
                    </p>
                  </li>
                ),
            )}
          </ul>
        </div>
      </BlockStyle>
    );
  }

  return (
    <BlockStyle>
      <div className='block'>
        <header className='blockHeader dp-flex'>
          <div className='blockTitleBlock'>
            <h1 className='blockTitle bold'>{blockTitle}</h1>
          </div>
        </header>
        <ul className='blockInfo'>
          {blockInfo !== undefined &&
            blockInfo.map(
              ({ title, subtitle }, index) =>
                title !== 'recipientId' && (
                  <li
                    key={uuid()}
                    className='dp-flex'
                    data-color={`${
                      (blockTitle === 'Container Information' && blockInfo.length - 1 === index && 'red') ||
                      // ((typeof blockTitle === 'object' && blockTitle.props.children.includes('Truck Type') )&& index === 2 && 'red') ||
                      (typeof title === 'string'
                        ? title.toLowerCase().includes('remaining')
                        : title.props.children.toLowerCase().includes('remaining') && 'red') ||
                      'black'
                    }`}
                  >
                    <p className='blockInfoTitle'>{title ? title : ''}</p>
                    <p className='blockInfoSubtitle'>{subtitle ? subtitle : ''}</p>
                  </li>
                ),
            )}
        </ul>
      </div>
    </BlockStyle>
  );
}

export default Block;
