import { useState, useEffect } from "react"
import axios from "axios"
export const Balance = () => {
    const[balance, setBalance] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            await axios.get("https://bank-app-backend.vercel.app/api/v1/user/account/balance")
            .then(response => {
                setBalance(response.data.balance)
            })
            axios.interceptors.request.use(
                config => {
                  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                      return config;
                  },
                  error => {
                      return Promise.reject(error);
                  }
              );
        }
        fetchData();
    }, [])
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}