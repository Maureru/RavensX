import axios from "axios";
import Cookies from "js-cookie";

interface Form {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    age: number;
    image: File;
  }

// verify user
const verifyUser = async () => {
    const { data } = await axios.get('http://localhost:5000/auth', {
      headers: {
        accessToken: Cookies.get('accessToken'),
      },
    });
    return data;
}

// Register
const register = async (form: Form) => {
    const {data} = await axios
    .post('http://localhost:5000/auth/signup', form)

    return data
}

// login
const loginUser = async (form: {
    email: string,
    password: string,
  }) => {
    const {data} = await axios
    .post('http://localhost:5000/auth/login', form)

    return data
}


// check email if exist
const checkEmail = async (email: string) => {
    const {data} = await axios
            .post('http://localhost:5000/auth/email_check', {
              email: email,
            })
    return data
}



export {
    verifyUser,
    checkEmail,
    loginUser,
    register,

}