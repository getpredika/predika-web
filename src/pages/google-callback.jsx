import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { search } = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(search)
        const email = queryParams.get("email")
        const name = queryParams.get("name")

        if (email && name) {
            setUser({ email, fullName: name });
            navigate("/koreksyon-grame");
        } else {
            navigate("/koneksyon");
        }
    }, [search, setUser, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
