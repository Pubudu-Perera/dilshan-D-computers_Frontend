import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    {
      isSuccess: isDelSuccess, // Alias
      isError: isDelError, // Alias
      error: delError, //Alias
    },
  ] = useDeleteUserMutation(); //Reason for having alias in deleteUser mutation is that those statuses in deleteUser can be conflicted with statuses of updateUser as both are executed at 3rd UseEffect below.

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    // updateUser
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate(`/dash/users`);
    }

    if (isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate(`/dash/users`);
    }
  }, [isSuccess, isDelSuccess, navigate]);



  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);



  // Following approach beacause we are allowing more than one option to be selected
  // e indicates the element which is <select> 
  const onRolesChanged = (e) => {
    const values = Array.from(
      // e.target.selectedOptions returns an array of all selected objects in current element with modifications
      e.target.selectedOptions, //HTML Collection

      (option) => option.value
    );
    setRoles(values);
  };



  const onActiveChanged = () => setActive(prev => !prev);



  const onSaveUpdatedUserClicked = async () => {

    // If password can be edited
    if (password) {
      await updateUser({id : user.id, username, password, roles, active});
    } else {
      await updateUser({id : user.id, username, roles, active});
    }
  }



  const onDeleteUserClicked = async () => {
     await deleteUser({id : user.id});
  }


  const options = Object.values(ROLES).map(role => {
    return (
        <option
            key={role}
            value={role}

        > {role}</option >
    )
})

let canSave
if (password) {
    canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
} else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading
}

const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
const validUserClass = !validUsername ? 'form__input--incomplete' : ''
const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

// Combined both error from updateUser & delError from deleteUser if there is any
const errContent = (error?.data?.message || delError?.data?.message) ?? ''

let content = (
  <>
    <p className={errClass}>{errContent}</p>

    <form className="form" onSubmit={(e) => e.preventDefault()}>

        <div className="form__title-row">
          <h2>Edit User</h2>

          <div className="form__action-button">

            {/* UPDATE Button */}
              <button
                className="icon-button"
                title="save"
                onClick={onSaveUpdatedUserClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>

              {/* DELETE Button */}
              <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteUserClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
          </div>
        </div>

        <label className="form__label" htmlFor="username">
`             Username : <span className="nowrap">[3-20 letters]</span>`
          </label>

          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter Username here"
            className={`form__input ${validUserClass}`}
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
          />

          <label className="form__label" htmlFor="password">
`             Password : <span className="nowrap">[4-12 Characters include !@#$%]</span>`
          </label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password here"
            className={`form__input ${validPwdClass}`}
            autoComplete="off"
            value={password}
            onChange={onPasswordChanged}
          />

          <label className="form_label form_checkbox_container" htmlFor="user-active">
              ACTIVE :
              <input 
                type="checkbox"
                id="user-active"
                name="user-active"
                className="form__checkbox"
                checked={active}
                onChange={onActiveChanged}
              />
          </label>

          <label className="form__label" htmlFor="roles">
`             ASSIGNED ROLES :
          </label>

          <select 
            id="roles"
            name="roles"
            className={`form__select ${validRolesClass}`}
            multiple={true}
            size="3"
            value={roles}
            onChange={onRolesChanged}
          >
            {options}
          </select>
    </form>
  </>
);


return content;
};

export default EditUserForm;
