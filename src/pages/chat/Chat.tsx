import React from 'react';
import ChatMenu from '../../components/Chat/ChatMenu';
import Conversation from '../../components/Chat/Conversation';

interface HomeProps {}

const Chat: React.FC<HomeProps> = () => {
  return (
    <div className="flex w-screen h-screen">
      <div className="hidden lg:block">
        <ChatMenu />
      </div>
      <Conversation />
    </div>
  );
};
export default Chat;
