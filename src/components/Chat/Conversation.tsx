import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import typingSound from '../../assets/type.mp3';

import { BsFillSendFill } from 'react-icons/bs';
import { FiVideo } from 'react-icons/fi';
import { MdPermMedia } from 'react-icons/md';
import { AiFillLike } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { removeNewChat } from '../../store/reducers/newChatSlice';
import EmptyChat from './EmptyChat';
import Loading from '../Tools/Loading';
import moment from 'moment';
import socket from '../Tools/socket';

interface ConversationProps {}

const Conversation: React.FC<ConversationProps> = () => {
  const typeSound = new Audio(typingSound);

  const newChat = useAppSelector((state) => state.newChat);
  const activeChat = useAppSelector((state) => state.activeChat);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  type Messages = {
    from_user: {
      name: string;
      id: string;
    };
    user_image: string;
    message_text: string;
    message_media: {
      isMedia: boolean;
      type?: string;
      file?: string;
    };
    conversation_id: string;
    send_datetime?: Date;
    is_seen: boolean;
  };

  const [message, setMessage] = useState<Messages>({
    from_user: {
      name: auth.name,
      id: auth._id,
    },
    user_image: auth.image,
    message_text: '',
    message_media: {
      isMedia: false,
      type: 'image',
      file: '',
    },
    conversation_id: null || '',
    is_seen: false,
  });

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, message_text: e.target.value });
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSeen, setIsSeen] = useState<boolean>(false);
  const bottomDiv = useRef<HTMLDivElement | null>(null);

  const [conversations, setConversations] = useState<Messages[]>([]);

  const check = async () => {
    console.log(socket);

    setIsLoading(true);
    await axios
      .post('http://localhost:5000/chat/check_conversation', {
        user_id: auth._id,
        other_id: newChat.otherUserId,
      })
      .then((res) => {
        if (res.data.error) {
          if (res.data.type) {
            console.log('new');
            setIsNewChat(true);
          } else {
            console.log(res.data.error);
          }
        } else {
          console.log('wad');
          console.log(res.data);

          dispatch(removeNewChat());
          navigate(`/chat/${res.data}`);
        }
      });
    setIsLoading(false);
  };

  const getConvoMessage = async () => {
    await axios
      .post('http://localhost:5000/chat/get_message', {
        conversation_id: id,
      })
      .then((res) => {
        setConversations([...res.data.messages]);
      });
  };

  useEffect(() => {
    setConversations([]);
    if (id === 'new' && newChat.otherUserName) {
      check();
      console.log('2');
    } else {
      console.log(id);

      socket.emit('join_chat', id);
      getConvoMessage();
      scrollBottom();
      socket.emit('chat_seen', {
        id: activeChat.otherUserId,
        conversation_id: id,
      });
    }
  }, [id]);

  const scrollBottom = () => {
    setTimeout(() => {
      bottomDiv.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 500);
  };

  useEffect(() => {
    if (socket === null) return;

    socket.on('recieve_message', (data) => {
      setConversations((convos) => [...convos, data]);
      socket.emit('chat_seen', {
        id: activeChat.otherUserId,
        conversation_id: id,
      });
    });

    socket.on('chat_seen', () => {
      setIsSeen(true);
    });

    socket.on('typing', () => {
      typeSound.play();
      setIsTyping(true);
    });
    socket.on('stop_typing', () => {
      setIsTyping(false);
    });
  }, []);

  const sendMessage = async () => {
    if (isNewChat) {
      await axios
        .post('http://localhost:5000/chat/create_conversation_and_message', {
          members: [auth._id, activeChat.otherUserId],
          conversation_name: `${auth.name.split(' ')[0]} & ${
            newChat.otherUserName.split(' ')[0]
          }`,
          messages: message,
        })
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            setConversations([...conversations, res.data.message]);
            setIsNewChat(false);
            console.log(res.data.conversation_id);

            navigate(`/chat/${res.data.conversation_id}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post('http://localhost:5000/chat/send_message', {
          messages: { ...message, conversation_id: id },
        })
        .then((res) => {
          setConversations([...conversations, res.data]);
          socket.emit('send_message', {
            ...res.data,
            other_id: activeChat.otherUserId,
          });
          socket.emit('sent_message', activeChat.otherUserId);
          scrollBottom();
        })
        .catch((err) => console.log(err));
    }
    setMessage({ ...message, message_text: '' });
  };

  let prevTime = 0 as number;
  console.log(isTyping);

  return (
    <div className="grow flex flex-col">
      <div className="py-2 px-6 border-b border-gray-800 flex justify-between items-center">
        <div className="flex gap-2">
          <div
            style={{
              backgroundImage: `url(${activeChat.otherUserImage})`,
            }}
            className="w-11 h-11 aspect-square bg-center bg-cover rounded-full bg-white"
          />
          <div>
            <p className="font-bold">{activeChat.otherUserName}</p>
            <p className="text-sm flex gap-2 items-center">
              <span
                className={`w-2 h-2  ${
                  activeChat.otherUserIsOnline
                    ? 'bg-green-600 animate-ping'
                    : 'bg-red-600'
                }  rounded-full`}
              />
              {activeChat.otherUserIsOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="text-md cursor-pointer flex gap-2 items-center px-3 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
          <FiVideo className="text-xl" />
          Start a call
        </div>
      </div>

      <div className="grow flex flex-col overflow-hidden ">
        <div className="grow px-8 lg:px-8 xl:px-32 flex flex-col gap-1 py-2 overflow-y-auto">
          {isLoading ? (
            <Loading />
          ) : isNewChat ? (
            <EmptyChat name={activeChat.otherUserName} />
          ) : (
            conversations.map((msg: Messages, i) => {
              const showDate = moment(msg.send_datetime).fromNow();
              const send_datetime = new Date(`${msg.send_datetime}`);
              const timeNow = new Date();
              const timefromnow = Math.floor(
                (timeNow.getTime() - send_datetime.getTime()) / (1000 * 60 * 60)
              );

              let timeDifference;
              if (i !== 0) {
                timeDifference = prevTime - timefromnow;
                prevTime = timefromnow;
              } else {
                timeDifference = 1;
              }

              return (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.from_user.id === auth._id
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {msg.from_user.id === auth._id ? null : (
                    <div
                      style={{
                        backgroundImage: `url(${msg.user_image})`,
                      }}
                      className="w-10 h-10 rounded-full bg-white bg-cover bg-center"
                    />
                  )}

                  <div>
                    <p className="text-[0.8rem]">
                      {msg.from_user.id === auth._id
                        ? null
                        : `${msg.from_user.name.split(' ')[0]},`}{' '}
                      {timefromnow >= 1 ? (
                        timeDifference > 1 ? (
                          <span>{showDate}</span>
                        ) : null
                      ) : timeDifference > 1 ? (
                        <span>{showDate}</span>
                      ) : null}
                    </p>
                    <div
                      className={` ${
                        msg.from_user.id === auth._id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-800 rounded-t-md rounded-bl-md'
                          : 'bg-neutral-800 rounded-b-md rounded-tr-md'
                      } max-w-[600px]  p-2 `}
                    >
                      <p>{msg.message_text}</p>
                    </div>
                    {isSeen ? (
                      msg.from_user.id === auth._id ? (
                        conversations.length - 1 === i ? (
                          <p className="text-right text-[0.8rem] text-neutral-400">
                            seen
                          </p>
                        ) : null
                      ) : null
                    ) : msg.from_user.id === auth._id ? (
                      conversations.length - 1 === i ? (
                        msg.is_seen && (
                          <p className="text-right text-[0.8rem] text-neutral-400">
                            seen
                          </p>
                        )
                      ) : null
                    ) : null}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex gap-2">
              {activeChat.otherUserName.split(' ')[0]} is typing{' '}
              <div className="flex gap-1 items-center">
                {Array(5)
                  .fill(' ')
                  .map((_, i) => (
                    <div
                      style={{
                        animationDelay: `${i}s`,
                      }}
                      key={i}
                      className="w-1 h-1 animate-bounce delay-75 rounded-full bg-white"
                    />
                  ))}
              </div>
            </div>
          )}
          <div ref={bottomDiv} />
        </div>

        <div className="px-1 sm:px-8 lg:px-8 xl:px-32 py-4 flex items-center gap-2">
          <div className="grow flex items-center gap-2 p-2 bg-neutral-700 rounded-full">
            <input
              onFocus={() => {
                socket.emit('typing', { conversation_id: id });
              }}
              onBlur={() => {
                socket.emit('stop_typing', { conversation_id: id });
              }}
              onChange={handleMessageChange}
              value={message.message_text}
              className="grow px-2 bg-transparent outline-none"
              placeholder="Type a message"
            />
            <span className="p-2 bg-neutral-800 text-lg cursor-pointer rounded-full">
              <MdPermMedia />
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-xl p-2 rounded-full bg-neutral-800 cursor-pointer">
              <AiFillLike />
            </span>
            <span onClick={sendMessage} className="text-xl p-2 cursor-pointer">
              <BsFillSendFill />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Conversation;
