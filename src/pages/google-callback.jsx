import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const queryParams = new URLSearchParams(search);
        const email = queryParams.get("email");
        const name = queryParams.get("name");

        if (email) {
            setUser({ email: email, fullName: name });
            navigate("/koreksyon-grame");
        } else {
            navigate("/login");
        }
    }, [search, setUser, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
