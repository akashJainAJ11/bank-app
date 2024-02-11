import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = ({userid}) => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [search, setSearch]= useState('')

    useEffect(() => {
        axios.get(`https://bank-app-backend.vercel.app/api/v1/user/bulk?filter=${search}`)
            .then(response => {
                setUsers(response.data.user)
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
            
    }, [])

    const handleSearch = (e)=>{
        setSearch(e.target.value)
    }

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input type="text" onChange={handleSearch}  placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
        {users.map((user)=> {return user._id!=userid && <User user={user}/>})}
        </div>
    </>
}


function User({user}) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}