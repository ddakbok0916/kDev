import { useAnimationControls, motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

// import ActionSheet from '@/app/ui/ActionSheet';

const useBottomSheet = (dragYn) => {
  // const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimationControls();
  // const [startY, setStartY] = useState(0); // 드래그 시작 Y 좌표

  let startY = useRef();
  let isOpen = useRef();
  const onDragStart = (event, info) => {
    // setStartY(info.y); // 드래그 시작 시점의 Y 좌표 저장
    window.testInfo = event;
    startY.current = event.y;
  };

  const onDragEnd = (event, info) => {
    const endY = event?.y;
    const shouldClose = endY > startY.current + 50;

    if (shouldClose) {
      isOpen.current = false;
      controls.start('hidden');
    }
  };

  const ActionSheetOpen = () => {
    isOpen.current = true;
    controls.start('visible');
  };

  const ActionSheetClose = () => {
    isOpen.current = false;
    controls.start('hidden');
  };

  const backgroundVariants = {
    hidden: { opacity: 0, zIndex: -1 },
    visible: { opacity: 1, zIndex: 10 },
  };

  const boxVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
  };

  // Wrapper 스타일 정의
  const wrapperStyle = {
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    // borderRadius: '30px',
    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.6)',
    height: 'auto',
    overflow: 'auto',
    margin: '0 auto',
  };
  const backgroundOpen = () => {
    isOpen.current = false;
    controls.start('hidden');
  };

  const Sheet = ({ children }) => {
    return (
      <>
        <AnimatePresence>
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              // backdropFilter: 'blur(0.5px)', // 배경 블러
              zIndex: -1, // 배경 Z 인덱스 설정
            }}
            onClick={backgroundOpen}
            initial='hidden'
            animate={controls}
            exit='hidden'
            variants={backgroundVariants}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            style={wrapperStyle}
            drag={dragYn === 'N' ? false : 'y'}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            initial='hidden'
            animate={controls}
            exit='hidden'
            transition={{ duration: 0.3 }}
            variants={boxVariants}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
          >
            <div>{children}</div>
          </motion.div>
        </AnimatePresence>
      </>
    );
  };

  return { Sheet, ActionSheetOpen, ActionSheetClose };
};

export default useBottomSheet;
