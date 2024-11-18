import { Navigate } from 'react-router-dom';
import {useAuth} from "@/context/auth-context";
import {Loader2} from "lucide-react";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-[#2d2d5f]" />
                <span className="sr-only">Tann...</span>
            </div>
        )
    }

    return user ? children : <Navigate to="/koneksyon" replace={true} />;
};

export default PrivateRoute;
