import React, { ChangeEvent, useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

interface InputProps {
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  change_handler: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder = 'Email',
  type = 'text',
  value,
  name,
  change_handler,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="relative rounded-md ring-1 bg-gray-950">
      <span
        className={`absolute text-gray-400 leading-2 transition-all px-1 bg-inherit z-10 ${
          isFocus
            ? '-top-[50%] translate-y-[60%] left-2 text-[0.8rem] font-bold'
            : value
            ? '-top-[50%] translate-y-[60%] left-2 text-[0.8rem] font-bold'
            : 'top-[50%] left-2 -translate-y-[50%]'
        }`}
      >
        {placeholder}
      </span>
      <input
        type={`${type === 'password' ? (showPassword ? 'text' : type) : type}`}
        name={name}
        value={value}
        onChange={change_handler}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="w-full relative z-20 bg-transparent outline-none p-3 "
      />
      {type === 'password' && (
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute z-30 text-lg cursor-pointer text-gray-400 top-[50%] right-2 -translate-y-[50%]"
        >
          {showPassword ? <BsEyeSlash /> : <BsEye />}
        </span>
      )}
    </div>
  );
};
export default Input;
