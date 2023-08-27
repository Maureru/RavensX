import { AnimatePresence, motion } from 'framer-motion';
import React, { RefObject, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdCallEnd } from 'react-icons/md';

interface CallPlayerProps {
  myRef: RefObject<HTMLVideoElement> | null;
}

const CallPlayer: React.FC<CallPlayerProps> = ({ myRef }) => {
  const [isHide, setIsHide] = useState<boolean>(false);

  const isHideHandler = () => {
    setIsHide((prev) => !prev);
  };

  const animation = {
    initial: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="fixed z-50 w-full h-full flex justify-center items-center bg-black/30">
      <div className="w-[85%] relative overflow-hidden flex aspect-video bg-black">
        <video
          autoPlay
          playsInline
          muted
          ref={myRef}
          className="w-full h-full "
        ></video>
        <AnimatePresence>
          {!isHide && (
            <motion.div
              variants={animation}
              initial="initial"
              animate="animate"
              exit="initial"
              className="w-60 absolute bottom-2 right-2 z-40 aspect-video"
            >
              <h1
                onClick={isHideHandler}
                className="absolute cursor-pointer z-50 text-[3rem] top-1/2 left-0 -translate-y-[50%]"
              >
                <IoIosArrowForward />
              </h1>
              <video className="w-full h-full rounded-md bg-red-600"></video>
            </motion.div>
          )}
        </AnimatePresence>
        <h1
          onClick={isHideHandler}
          className="absolute cursor-pointer z-30 text-[3rem] bottom-12  right-2"
        >
          <IoIosArrowBack />
        </h1>
        <h2 className="absolute p-3 bg-red-500 cur rounded-full bottom-2 left-[50%] -translate-x-[50%]">
          <MdCallEnd />
        </h2>
      </div>
    </div>
  );
};
export default CallPlayer;
