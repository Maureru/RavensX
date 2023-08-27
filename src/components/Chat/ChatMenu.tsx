import React, { ChangeEvent, useEffect, useState } from 'react';

import { BsBell, BsFillChatTextFill, BsSearch } from 'react-icons/bs';
import { MdOutlineDialpad } from 'react-icons/md';
import { RiContactsBookLine } from 'react-icons/ri';
import { TiVideo } from 'react-icons/ti';
import { BiEdit } from 'react-icons/bi';
import { useAppSelector } from '../../store/hooks';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { newChat } from '../../store/reducers/newChatSlice';
import { useNavigate } from 'react-router-dom';
import { activeChat } from '../../store/reducers/activeChatSlice';
import moment from 'moment';
import socket from '../Tools/socket';

import { Convo } from '../../data/types';

interface ChatMenuProps {}

const ChatMenu: React.FC<ChatMenuProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState<string>('');
  const [searched, setSearched] = useState([]);
  const [conversationss, setConversationss] = useState<Convo[]>([]);

  // For WebRTC VIDEO CALL

  const getConvos = async () => {
    await axios
      .post('http://localhost:5000/chat/get_conversation', {
        user_id: auth._id,
      })
      .then((res) => {
        setConversationss(
          res.data.sort((a: Convo, b: Convo) => {
            const sendDatetimeA = new Date(a.last_message.send_datetime);
            const sendDatetimeB = new Date(b.last_message.send_datetime);

            return sendDatetimeB.getTime() - sendDatetimeA.getTime();
          })
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    socket.emit('user_online', { user_id: auth._id });
    socket.on(`${auth._id} self`, () => {
      getConvos();
    });
    socket.on(auth._id, () => {
      getConvos();
    });
    getConvos();
  }, []);

  useEffect(() => {
    const getSearch = async () => {
      await axios
        .post('http://localhost:5000/auth/search', {
          query: search,
        })
        .then((res) => {
          setSearched(res.data);
        });
    };

    getSearch();
  }, [search]);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div
      style={{
        boxShadow: '-13px 2px 19px 4px rgba(0,0,0,0.75)',
      }}
      className="w-screen  lg:w-[20rem] relative flex flex-col h-full bg-gray-950]"
    >
      <div className="bg-blue-950 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex grow gap-2">
            <img
              alt="profile"
              src={auth.image}
              className="w-11 aspect-square rounded-full bg-white"
            />
            <div className="grow">
              <p className="max-w-[150px] font-bold text-ellipsis whitespace-nowrap overflow-hidden">
                {auth.name}
              </p>
              <p className="text-sm">Set status</p>
            </div>
          </div>
          <div className="text-xl font">
            <BsBell />
          </div>
        </div>
        <div className="flex mt-4 items-center justify-between gap-2">
          <div className="flex relative grow gap-1 items-center bg-neutral-950 px-2 py-1  rounded-lg">
            <BsSearch />
            {search && (
              <div className="absolute flex flex-col gap-4 left-0 top-[110%] px-4 py-2 z-50 rounded-md bg-black w-[calc(100%)]">
                {searched.map(
                  (
                    user: {
                      _id: string;
                      username: string;
                      name: string;
                      image: string;
                      email: string;
                      isOnline: boolean;
                      age: number | null;
                    },
                    i
                  ) => {
                    console.log(user);
                    return (
                      <div
                        onClick={() => {
                          dispatch(
                            newChat({
                              otherUserId: user._id,
                              otherUserName: user.name,
                              otherUserImage: user.image,
                              otherUserAge: user.age,
                              otherUserUsername: user.username,
                              otherUserEmail: user.email,
                              otherUserIsOnline: user.isOnline,
                            })
                          );

                          dispatch(
                            activeChat({
                              otherUserId: user._id,
                              otherUserName: user.name,
                              otherUserImage: user.image,
                              otherUserAge: user.age,
                              otherUserUsername: user.username,
                              otherUserEmail: user.email,
                              otherUserIsOnline: user.isOnline,
                            })
                          );

                          navigate(`/chat/new`);
                        }}
                        key={i}
                        className="flex gap-2 items-center"
                      >
                        <div
                          style={{
                            backgroundImage: `url(${user.image})`,
                          }}
                          className="bg-white bg-cover bg-center w-10 h-10 aspect-square rounded-full"
                        />
                        <div className="grow overflow-hidden">
                          <p className="w-full overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
                            {user.name}
                          </p>
                          <p className="text-[0.7rem]">@{user.username}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
            <input
              value={search}
              onChange={handleChangeSearch}
              className="grow outline-none bg-inherit"
              placeholder="People, group, message, web"
            />
          </div>
          <div className="p-2 bg-neutral-950 rounded-md">
            <MdOutlineDialpad />
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 mt-3">
          <div className="grow flex text-md flex-col gap-1 justify-center items-center">
            <BsFillChatTextFill />
            <p className="text-[0.8rem] leading-none">Chat</p>
          </div>
          <div className="grow flex text-md flex-col gap-1 justify-center items-center">
            <RiContactsBookLine />
            <p className="text-[0.8rem] leading-none">Contact</p>
          </div>
        </div>
        <div className="flex my-3 gap-3 justify-between">
          <div className="grow gap-1 rounded-full text-[0.8rem] bg-gray-800 py-1 px-3 flex justify-center items-center">
            <TiVideo />
            <p className="">Meet Now</p>
          </div>
          <div className="grow gap-1 rounded-full py-1 text-[0.8rem] bg-gray-800 px-3 flex justify-center items-center">
            <BiEdit />
            <p className="">New Chat</p>
          </div>
        </div>
      </div>

      <div className=" grow flex flex-col overflow-hidden">
        <p className="px-4">Chats</p>
        <div className="mt-3 chat grow flex flex-col overflow-y-auto">
          {conversationss.map((convo, i) => {
            const user = convo.conversation_members.filter(
              (mem) => mem._id !== auth._id
            );

            const time = moment(convo.last_message.send_datetime).fromNow();
            return (
              <div
                onClick={() => {
                  socket.emit('leave_chat', convo._id);

                  dispatch(
                    newChat({
                      otherUserId: user[0]._id,
                      otherUserName: user[0].name,
                      otherUserImage: user[0].image,
                      otherUserAge: user[0].age,
                      otherUserUsername: user[0].username,
                      otherUserEmail: user[0].email,
                      otherUserIsOnline: user[0].isOnline,
                    })
                  );

                  dispatch(
                    activeChat({
                      otherUserId: user[0]._id,
                      otherUserName: user[0].name,
                      otherUserImage: user[0].image,
                      otherUserAge: user[0].age,
                      otherUserUsername: user[0].username,
                      otherUserEmail: user[0].email,
                      otherUserIsOnline: user[0].isOnline,
                    })
                  );

                  navigate(`/chat/${convo._id}`);
                }}
                key={i}
                className={`flex justify-between ${
                  convo.last_message.from_user.id !== auth._id
                    ? convo.last_message.is_seen
                      ? ''
                      : 'bg-neutral-800'
                    : ''
                } px-4 py-3 cursor-pointer`}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundImage: `url(${user[0].image})`,
                    }}
                    className="relative w-10 aspect-square bg-white rounded-full border border-white bg-cover bg-center"
                  >
                    <div
                      className={`w-2 h-2 absolute bottom-0 right-0 ${
                        user[0].isOnline ? 'bg-green-600' : 'bg-red-600'
                      } rounded-full`}
                    />
                  </div>
                  <div className="">
                    <p className="w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {user[0].name}
                    </p>
                    <p className="text-[0.8rem] text-neutral-400 w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {convo.last_message.from_user.id === auth._id && 'You: '}
                      {convo.last_message.message_text}
                    </p>
                  </div>
                </div>
                <p className="text-[0.6rem] font-thin">{time}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ChatMenu;
