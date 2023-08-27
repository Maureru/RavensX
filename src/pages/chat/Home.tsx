import React, { Suspense, useEffect, useState } from 'react';
import ChatMenu from '../../components/Chat/ChatMenu';

import { HiVideoCamera } from 'react-icons/hi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Tools/Loader';
import Toast from '../../components/Tools/Toast';
import { verifyUser } from '../../actions/auth';
import { AnimatePresence } from 'framer-motion';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['verify'],
    queryFn: verifyUser,
  });

  /* =========== For Toast ================ */

  const [toastDetails, setToastDetails] = useState({
    text: '',
    type: 'success',
    on: false,
  });

  const toast = (type: string, text: string) => {
    setToastDetails({
      text: text,
      type: type,
      on: true,
    });
  };

  /*  ========= End of Toast =========== */

  useEffect(() => {
    if (!userLoading) {
      if (user.error) {
        navigate('/login');
      } else {
        toast('success', 'You are logged in');
      }
    }
  }, [userLoading]);

  if (userLoading) {
    return <div></div>;
  }

  return (
    <div className="flex w-screen h-screen">
      <Toast toast={toastDetails} setToastDetails={setToastDetails} />
      <div>
        <ChatMenu />
      </div>
      <Suspense
        fallback={
          <AnimatePresence>
            <Loader />
          </AnimatePresence>
        }
      >
        <div className="grow hidden lg:block lg:px-20 lg:pt-24 xl:px-52 xl:pt-24">
          <div className="flex gap-3">
            <div
              style={{ backgroundImage: `url(${user.image})` }}
              className="w-24 aspect-square bg-white rounded-full bg-cover bg-center"
            />
            <div className="flex flex-col gap-3 justify-center">
              <p className="text-4xl">Welcome!</p>
              <p className="text-4xl font-extrabold">{user.name}</p>
            </div>
          </div>
          <p className="mt-10 text-xl">
            Here are some quick action to get you started
          </p>
          <div className="flex px-16 mt-10 gap-6">
            <div className="grow cursor-pointer hover:bg-slate-900 aspect-square border rounded-xl text-4xl flex flex-col gap-2 justify-center items-center">
              <HiVideoCamera className="" />
              <h1 className="text-3xl">Meet Now</h1>
            </div>
            <div className="grow cursor-pointer hover:bg-slate-900 aspect-square border rounded-xl text-4xl flex flex-col gap-2 justify-center items-center">
              <BsFillChatDotsFill className="" />
              <h1 className="text-3xl">Chat Now</h1>
            </div>
          </div>
          <p className="text-center mt-2 font-bold">
            You are signed in as <span className="italic">{user.email}</span>
          </p>
        </div>
      </Suspense>
    </div>
  );
};
export default Home;
