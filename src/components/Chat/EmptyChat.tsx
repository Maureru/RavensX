import { MdWavingHand } from 'react-icons/md';

interface EmptyChatProps {
  name: string;
}

const EmptyChat: React.FC<EmptyChatProps> = ({ name }) => {
  return (
    <div className="mx-auto">
      <h2>Say hello to {name}!</h2>
      <h1 className="flex justify-center items-center">
        <MdWavingHand />
      </h1>
    </div>
  );
};
export default EmptyChat;
