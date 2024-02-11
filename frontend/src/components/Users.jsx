import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = ({ userid }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get(`https://bank-app-backend.vercel.app/api/v1/user/bulk?filter=${search}`)
            .then(response => {
                if (Array.isArray(response.data.user)) {
                    setUsers(response.data.user);
                } else {
                    console.error("Invalid response format: ", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching users: ", error);
            });
    }, [search]);

    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    return (
        <>
            <div className="font-bold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input type="text" onChange={handleSearch} placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" />
            </div>
            <div>
            {users.filter(user => String(user._id) !== String(userid)).map(user => <User key={user._id} user={user} navigate={navigate} />)}
            </div>
        </>
    );
}

function User({ user, navigate }) {
    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">{user.firstName[0]}</div>
                </div>
                <div className="flex flex-col justify-center h-ful">{user.firstName} {user.lastName}</div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <Button onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)} label="Send Money" />
            </div>
        </div>
    );
}
