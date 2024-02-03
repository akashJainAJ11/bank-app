import { useState } from "react"
import axios from "axios"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");
  const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />

        <InputBox onChange={e => {
          setFirstName(e.target.value)
        }} placeholder="first name" label={"First Name"} />

        <InputBox onChange={e => {
          setLastName(e.target.value)
        }} placeholder="last name" label={"Last Name"} />

        <InputBox onChange={e => {
          setEmail(e.target.value)
        }} placeholder="example@gmail.com" label={"Email "} />

        <InputBox onChange={e => {
          setUserName(e.target.value)
        }} placeholder="username" label={"Username"} />

        <InputBox onChange={e => {
          setPassword(e.target.value)
        }} placeholder="password" label={"Password"} />

        <InputBox onChange={e => {
          setRepeatPassword(e.target.value)
        }} placeholder="repeat password" label={"Repeat Password"} />

        <div className="pt-4">
        <Button onClick={async () => {
  try {
    const response = await axios.post(
      'https://bank-app-backend.vercel.app/api/v1/user/signup',
      {
        email,
        firstName,
        lastName,
        userName,
        password,
        repeat_password
      }
    );

    const token = response.data.token;
    localStorage.setItem("token", token);

    axios.interceptors.request.use(
      config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

  } catch (error) {
    console.error('Error during signup:', error);
  }
  navigate("/dashboard")
  }} label={"Sign up"} />

  </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}