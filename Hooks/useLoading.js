import { useState, useCallback, useEffect } from 'react';

import { createPortal } from 'react-dom';
import useScrollBlock from './useScrollBlock';

export default function useLoading (initValue) {
  const hasWindow = typeof window !== 'undefined';

  const [blockScroll, allowScroll] = useScrollBlock();
  const [loading, setLoading] = useState(initValue);
  // const [loading, setLoading] = useLocalStorage("loading", initValue)
  const size = 35;

  useEffect(() => {
    if (loading) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [loading]);

  const LoadingElement =
    hasWindow && loading
      ? () =>
          createPortal(
            <>
              <div
                style={{
                  content: '',
                  display: 'block',
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: '999',
                }}
              >
                <div className='flex h-screen items-center justify-center '>
                  <div className='relative'>
                    <div className='flex justify-center items-center min-h-screen'>
                      <div className='loader'></div>
                    </div>
                  </div>
                </div>
              </div>
            </>,
            document.body,
          )
      : () => null;

  return {
    loading,
    setLoading,
    LoadingElement,
  };
}
