import { useState, useEffect } from 'react';
import axios from 'axios';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

const GetUser = () => {
    const [user, setUser] = useState({});
    const [verify, setVerify] = useState(false);

    useEffect(() => {
        try {
            axios
                .get("https://bank-app-backend.vercel.app/api/v1/user/bulk", {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                .then((res) => {
                    setUser(res.data.user);
                    setVerify(true);
                });
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }, []);

    return { user, verify };
}

export const Dashboard = () => {
    const { user, verify } = GetUser();

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance />
                {verify && <Users userid={user._id} />}
            </div>
        </div>
    );
}
