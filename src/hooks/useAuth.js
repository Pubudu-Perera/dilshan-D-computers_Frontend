import {selectCurrentToken} from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const useAuth = () => {

    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = "Employee";

    if (token) {
        const decoded = jwtDecode(token);

        // when we creating access token in the backend, we initialised cookie content "UserInfo"
        const { username, roles } = decoded.UserInfo;

        isManager = roles.includes("Manager");
        isAdmin = roles.includes("Admin");

        if (isManager) {
            status = "Manager";
        }

        if (isAdmin) {
            status = "Admin";
        }

        return { username, roles, status, isManager, isAdmin }
    }

    return { username : '', roles : [], isManager, isAdmin, status }

}

export default useAuth