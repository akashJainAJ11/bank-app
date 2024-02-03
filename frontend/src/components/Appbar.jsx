import { useEffect, useState } from "react";
import axios from "axios";

export const Appbar = () => {
    const [firstName, setFirstName] = useState(" ");

    useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    
        const fetchData = async () => {
            try {
                const response = await axios.get("https://bank-app-backend.vercel.app/api/v1/user/me");
                setFirstName(response.data.user.firstName);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                Bank App
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {firstName}
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {firstName[0]}
                    </div>
                </div>
            </div>
        </div>
    );
};
