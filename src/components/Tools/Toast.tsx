/* eslint-disable react-refresh/only-export-components */
import { motion, useAnimation } from 'framer-motion';
import React, { Dispatch, useEffect } from 'react';
import { BiSolidErrorCircle } from 'react-icons/bi';
import { BsFillCheckCircleFill } from 'react-icons/bs';
interface ToastProps {
  toast: {
    text: string;
    type: string;
    on: boolean;
  };
  setToastDetails: Dispatch<{
    text: string;
    type: string;
    on: boolean;
  }>;
}

const Toast: React.FC<ToastProps> = ({
  toast = { text: '', type: 'success', on: false },
  setToastDetails,
}) => {
  const toastAnim = {
    hide: {
      opacity: 0,
    },
    show: {
      y: [-200, 0],
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
    exit: {
      y: [0, -200],
      opacity: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const control = useAnimation();

  useEffect(() => {
    if (toast.on) {
      control.start('show');
      const timeout = setTimeout(() => {
        control.start('exit');
        setToastDetails({ ...toast, on: false });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast.on]);

  return (
    <div className="fixed top-2 left-[50%] z-50 -translate-x-[50%]">
      <motion.div
        variants={toastAnim}
        initial="hide"
        animate={control}
        className="flex items-center justify-center gap-1 pr-3 rounded-full bg-white text-black"
      >
        {toast.type === 'success' ? (
          <div className="text-4xl animate-pulse text-green-600">
            <BsFillCheckCircleFill />
          </div>
        ) : (
          <div className="text-4xl animate-pulse text-red-600">
            <BiSolidErrorCircle />
          </div>
        )}
        <p className="font-bold">{toast.text}</p>
      </motion.div>
    </div>
  );
};
export default Toast;
