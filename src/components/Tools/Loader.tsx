import React from 'react';
import ravenlogo from '../../assets/ravens_arts_compact.png';
import Developer from '../Developer';
import { motion } from 'framer-motion';

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      }}
      className="w-screen h-screen fixed top-0 left-0 bg-gray-950 flex justify-center items-center "
    >
      <div className=" text-white relative text-center p-8">
        <img
          className="mx-auto w-[300px] animate-pulse"
          alt="raven"
          src={ravenlogo}
        />
        <h1
          style={{
            WebkitTextStroke: '1px #ffff',
            textShadow: '0 0 20px #203467',
          }}
          className="leading-10 -mt-8 text-gray-950 text"
        >
          RavenX
        </h1>
        <div className="mt-8">
          <Developer />
        </div>
      </div>
    </motion.div>
  );
};
export default Loader;
