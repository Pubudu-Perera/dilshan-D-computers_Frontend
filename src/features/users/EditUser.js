import { useParams } from "react-router-dom";
import { selectUserById } from "./usersApiSlice"; //one of the selectors which is created by getSelectors() in userApiSlice.js
import { useSelector } from "react-redux"; //using useSelector(), selectUserById is combined with the users state
import {ScaleLoader} from 'react-spinners';

import EditUserForm from "./EditUserForm";

// Note about this component 
// this component doesn't use any JSX for rendering the UI
// Main purpose of this component is, it ensures that user data of a certain user is existed
// then, it is helped to pre populated the <EditUserForm /> component & then it is rendered
const EditUser = () => {

  const { id } = useParams(); //Grab that particular parameter in URL. name must be same as the variable name, which is specified in its react route path

  const user = useSelector(state => selectUserById(state,id)); //Id which is grabbed by the URL

  const content = user ? <EditUserForm user={user} /> : <ScaleLoader color="white" />

  return content;
}

export default EditUser