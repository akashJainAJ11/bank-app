import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
  const navigate = useNavigate(); // useNavigate instead of useHistory
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
        email: email,
        password: password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="example@gmail.com"
            label={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputBox
            type="password"
            placeholder="password"
            label={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500">{error}</div>}
          <div className="pt-4">
            <Button label={"Sign in"} onClick={handleSignIn} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};
