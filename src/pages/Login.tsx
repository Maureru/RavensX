import React, { ChangeEvent, FormEvent, useState } from 'react';
import Developer from '../components/Developer';
import ravenlogo from '../assets/ravens_arts_compacts.png';
import Input from '../components/Tools/Input';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Tools/Toast';
import { loginUser } from '../actions/auth';
import { useAppDispatch } from '../store/hooks';
import { login_user } from '../store/reducers/authSlice';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const dispatch = useAppDispatch();

  type Form = {
    email: string;
    password: string;
  };
  const [form, setForm] = useState<Form>({
    email: '',
    password: '',
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

  const navigate = useNavigate();

  /*  ========= End of Toast =========== */

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.email && form.password) {
      console.log(form);
      const user = await loginUser({
        email: form.email,
        password: form.password,
      });
      try {
        if (user.message) {
          toast('error', user.message);
        } else {
          dispatch(
            login_user({
              user: user.result,
              token: user.token,
            })
          );
          toast('success', 'You are logged in!');
          navigate('/');
        }
      } catch (error) {
        toast('error', 'Server Error');
      }
    } else {
      toast('error', 'Please fill all fields');
    }
  };

  const change_handler = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative overflow-hidden sm:overflow-auto">
      <Toast toast={toastDetails} setToastDetails={setToastDetails} />
      <div className="w-screen min-h-screen  lg:h-screen bg-gray-950 px-12 block lg:flex justify-center items-center">
        <div className="grow flex justify-center items-center ">
          <div className=" text-white relative text-center p-8">
            <img className="mx-auto w-[300px]" alt="raven" src={ravenlogo} />
            <h1
              style={{
                WebkitTextStroke: '1px #ffff',
                textShadow: '0 0 20px #203467',
              }}
              className="leading-10 -mt-10 text-gray-950 text"
            >
              RavenX
            </h1>
            <div className="mt-8">
              <Developer />
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-center w-full lg:w-[400px] xl:w-[550px] text-white">
          <div>
            <h1 className="font-extrabold">
              Kraaa.
              <span className="uppercase hidden lg:block font-extralight text-sm">
                Be connected
              </span>
            </h1>
            <h2 className="mb-6">Join today</h2>
            <form
              onSubmit={login}
              className="w-full lg:w-[350px] flex flex-col gap-5"
            >
              <Input
                name="email"
                value={form.email}
                change_handler={change_handler}
                placeholder="Email"
                type="email"
              />
              <Input
                name="password"
                value={form.password}
                change_handler={change_handler}
                placeholder="Password"
                type="password"
              />
              <button
                type="submit"
                className="p-2 bg-white text-black font-bold rounded-full"
              >
                Log in
              </button>
              <div className="flex gap-2 items-center">
                <div className="h-[0.5px] grow bg-blue-800" />
                <span className="text-center">OR</span>
                <div className="h-[0.5px] grow bg-blue-800" />
              </div>
              <div className="">
                <Link to="/register">
                  <button className="p-2 w-full bg-blue-800 text-white font-bold rounded-full">
                    Register
                  </button>
                </Link>
                <p className="text-[0.7rem] mt-1 text-gray-400 font-thin leading-none">
                  By signing up, you agree to the Terms of Service and Privacy
                  Policy, including Cookie Use.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
