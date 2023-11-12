import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAddNewUserMutation } from "./usersApiSlice";
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import {ROLES} from '../../config/roles';

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

  const [ addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // this hook will execute whenever the RTK Success status changed(Ex-: isSuccess to isLoading) OR useNavigate hook executed
  useEffect(() => {
      if (isSuccess) {
        setUsername('')
        setPassword('')
        setRoles([])
        navigate(`/dash/users`)
      }
  }, [isSuccess, navigate]);


  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  // Following approach beacause we are allowing more than one option to be selected
  const onRolesChanged = e => {
    const values = Array.from(

      // e.target.selectedOptions returns an array of all selected objects in current element with modifications
      e.target.selectedOptions, //HTML Collection

      (option) => option.value
    )
    setRoles(values)
  }

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  // Function which is  executed when clicking SUBMIT button
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles})
    }
  }

  const options = Object.values(ROLES).map(role => {
    return (
      <option 
        key={role}
        value={role}
      >{role}</option>  
    )
  });

  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>

          <div className="form__title-row">
              <h2>New User</h2>
              <div className="form__action-buttons">
                  <button
                    className="icon-button"
                    title="save"
                    disabled={!canSave}
                  >
                      <FontAwesomeIcon icon={faSave} />
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


          <label className="form__label" htmlFor="roles">
              ASSIGNED ROLES : 
          </label>

          <select
            id="roles"
            name="roles"
            className={`form__select ${validRolesClass}`}
            multiple={true} //Multiple selections are allowed
            size="3" //number of values directly displays without dropdown
            value={roles}
            onChange={onRolesChanged}
          >
            {options}
          </select>


      </form>
    </>
  );
  
  return content;
}

export default NewUserForm