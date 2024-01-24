import { useSelector } from "react-redux";
import { Navigate, Outlet} from "react-router-dom";


function RequireAuth({allowedRoles}){//array of allowed roles
    const {isLoggedIn,role}=useSelector((state)=>state.auth);//to get state we gotta use useselector

    
    return isLoggedIn && allowedRoles.find((myRole)=>myRole==role)?(
       <Outlet/> //used in parent route elements to renter their child route elements ie from where this component was called
            //whatever routes given in child will be rendered
    ):isLoggedIn?(<Navigate to="/denied"/>):(<Navigate to="/login"/>)

}
export default RequireAuth;