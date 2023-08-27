import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Developer from '../components/Developer';
import ravenlogo from '../assets/ravens_arts_compacts.png';
import Input from '../components/Tools/Input';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdArrowBack } from 'react-icons/io';
import { images } from '../data/images';
import Toast from '../components/Tools/Toast';
import { checkEmail, register } from '../actions/auth';
import { useAppDispatch } from '../store/hooks';
import { login_user } from '../store/reducers/authSlice';

interface LoginProps {}
export type Form = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  birthdate: string;
  image: File;
};

const Register: React.FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imagePrev, setImagePrev] = useState<string | null>(null);
  const [step, setStep] = useState<number | string>(
    Cookies.get('step') ? JSON.parse(Cookies.get('step') as string) : 1
  );
  const [form, setForm] = useState<Form>(
    Cookies.get('registration')
      ? JSON.parse(Cookies.get('registration') as string)
      : {
          name: '',
          email: '',
          username: '',
          password: '',
          confirm_password: '',
          birthdate: '',
          image: '',
        }
  );

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

  const form_change_handler = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const form_validation_step_1 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      form.name &&
      form.email &&
      form.username &&
      form.password &&
      form.confirm_password
    ) {
      if (form.password !== form.confirm_password) {
        toast('error', 'Password dont match!');
      } else {
        try {
          const data = await checkEmail(form.email);
          if (data.exist) {
            toast('error', data.message);
          } else {
            setStep(2);
            Cookies.set('registration', JSON.stringify(form));
            Cookies.set('step', '2');
          }
        } catch (error) {
          toast('error', 'Server Error');
        }
      }
    } else {
      toast('error', 'Please fill all fields!');
    }
  };

  const form_validation_step_2 = async () => {
    const birthdate = new Date(form.birthdate);
    const currentYear = new Date();
    const age = currentYear.getFullYear() - birthdate.getFullYear();
    if (!form.birthdate || !form.image) {
      if (!form.image) {
        toast('error', 'Please choose an image!');
      } else {
        toast('error', 'Please choose a birthday!');
      }
    } else {
      try {
        const users = await register({
          ...form,
          age: age,
        });
        Cookies.set('step', '1');

        dispatch(
          login_user({
            user: users.result,
            token: users.token,
          })
        );

        Cookies.remove('registration');
        toast('success', 'You are now registered!');
        navigate('/');
      } catch (error) {
        toast('error', 'Server Error');
      }
    }
  };
  console.log(form);

  const handleImagePrev = async (e: ChangeEvent<HTMLInputElement>) => {
    const data = new FormData();
    const files = e.target?.files;
    if (files) {
      data.append('file', files[0]);
      data.append('upload_preset', 'ravens');
      await fetch('https://api.cloudinary.com/v1_1/de6tc8i8q/image/upload', {
        method: 'POST',
        body: data,
      })
        .then(async (res) => {
          const file = await res.json();
          setForm({ ...form, image: file.secure_url });
        })
        .catch((err) => {
          console.log('Error Cloudinary', err);
          toast('error', 'Error Cloudinary');
        });
      setImagePrev(URL.createObjectURL(files[0]));
    }
  };

  const registration_form = () => {
    if (step === 1) {
      return (
        <form
          onSubmit={form_validation_step_1}
          className="w-full lg:w-[350px] flex flex-col gap-4 sm:gap-12 lg:gap-4"
        >
          <Input
            name="name"
            value={form.name}
            change_handler={form_change_handler}
            placeholder="Name"
          />
          <Input
            name="username"
            value={form.username}
            change_handler={form_change_handler}
            placeholder="Username"
          />
          <Input
            name="email"
            value={form.email}
            change_handler={form_change_handler}
            placeholder="Email"
            type="email"
          />
          <Input
            name="password"
            value={form.password}
            change_handler={form_change_handler}
            placeholder="Password"
            type="password"
          />
          <Input
            name="confirm_password"
            value={form.confirm_password}
            change_handler={form_change_handler}
            placeholder="Confirm Password"
            type="password"
          />
          <button
            type="submit"
            className="p-2 bg-white text-black font-bold rounded-full"
          >
            Next
          </button>
          <div className="flex gap-2 items-center">
            <div className="h-[0.5px] grow bg-blue-800" />
            <span className="text-center">OR</span>
            <div className="h-[0.5px] grow bg-blue-800" />
          </div>
          <div className="">
            <Link to="/login">
              <button className="p-2 w-full bg-blue-800 text-white font-bold rounded-full">
                Login
              </button>
            </Link>
          </div>
        </form>
      );
    } else if (step === 2) {
      return (
        <div className="w-full md:w-[350px] relative flex flex-col gap-5">
          <input ref={imageRef} onChange={handleImagePrev} type="file" hidden />
          <div
            onClick={() => {
              setStep(1);
              Cookies.set('step', '1');
            }}
            className="absolute -top-4 left-0 self-start p-2 text-xl cursor-pointer"
          >
            <IoMdArrowBack />
          </div>
          <div
            onClick={() => {
              imageRef.current?.click();
            }}
            className="mx-auto w-20 overflow-hidden flex justify-center items-center cursor-pointer h-20 ring-1 rounded-full"
          >
            {imagePrev ? (
              <img
                src={imagePrev}
                alt="profile_prev"
                className="w-full h-full"
              />
            ) : (
              <IoMdAdd />
            )}
          </div>
          <p className="uppercase font-bold text-[0.8rem]">Or Choose</p>
          <div className="grid grid-cols-3 gap-4 px-8 justify-items-center">
            {images.map((link, i) => (
              <div
                style={{
                  backgroundImage: `url(${link})`,
                }}
                key={i}
                className="w-14 h-14 bg-cover cursor-pointer bg-center rounded-full"
              />
            ))}
          </div>
          <div className="flex items-center gap-2 py-1 px-2 rounded-full">
            <p>Birthday</p>
            <input
              type="date"
              name="birthdate"
              onChange={(e) => {
                setForm({ ...form, birthdate: e.target.value });
              }}
              className="rounded-xl outline-none bg-gradient-to-r from-blue-950 to-blue-500 cursor-pointer py-1 text-white px-4"
            />
          </div>
          <button
            onClick={form_validation_step_2}
            className="p-2 bg-white text-black font-bold rounded-full"
          >
            Register
          </button>
          <p className="text-[0.7rem] mt-1 text-gray-400 font-thin leading-none">
            By signing up, you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <Toast toast={toastDetails} setToastDetails={setToastDetails} />
      <div className="w-screen min-h-screen lg:h-screen bg-gray-950 px-12 block lg:flex justify-center items-center">
        <div className="grow hidden lg:flex justify-center items-center ">
          <div className=" text-white relative text-center p-8">
            <img
              className="animate-pulse mx-auto w-[300px]"
              alt="raven"
              src={ravenlogo}
            />
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
          <div className="">
            <h1 className="font-extrabold">
              Kraaa.
              <span className="uppercase hidden lg:block font-extralight text-sm">
                Be connected
              </span>
            </h1>
            <h2 className="mb-6">Join today</h2>
            {registration_form()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
