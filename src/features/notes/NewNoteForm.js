import { useState, useEffect } from 'react';
import { useAddNewNoteMutation} from './notesApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const NewNoteForm = ({ users }) => {

  // console.log(users)
const [addNewNote,{
  isLoading,
  isSuccess,
  isError,
  error
}] = useAddNewNoteMutation();

const navigate = useNavigate();

const [title, setTitle] = useState('');
const [text, setText] = useState('');
const [userId, setUserId] = useState(users[0].id);

useEffect(() => {
  if (isSuccess) {
    setTitle('');
    setText('');
    setUserId('');
    navigate('/dash/notes');
  }
}, [isSuccess, navigate]);

const onTitleChanged = e => setTitle(e.target.value);
const onTextChanged = e => setText(e.target.value);
const onUserIdChanged = e => setUserId(e.target.value);

const canSave = [title, text, userId].every(Boolean) && !isLoading;

const onSaveNewNoteClicked = async (e) => {
  e.preventDefault();
  if (canSave) {
    await addNewNote({ user: userId, title, text });
  }
  console.log(isSuccess);
};

const options = users.map((user) => {
  return (    
    <option key={user.id} value={user.id}>
        {user.username}
    </option>)
});

const errClass = isError ? "errmsg" : "offscreen"
const validTitleClass = !title ? "form__input--incomplete" : ''
const validTextClass = !text ? "form__input--incomplete" : ''

let content = (
  <>
    <p className={errClass}>{error?.data?.message}</p>

    <form className="form" onSubmit={onSaveNewNoteClicked}>
      <div className="form__title-row">
        <h2>New Note</h2>

        <div className="form__action-buttons">
          <button className="icon-button" title="save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </div>

      <label className="form__label" htmlFor="title">
        Title :
      </label>

      <input
        type="text"
        id="title"
        name="title"
        placeholder="Enter Title Here"
        autoComplete='off'
        className={`form__input ${validTitleClass}`}
        value={title}
        onChange={onTitleChanged}
      />

      <label className="form__label" htmlFor="text">
        Text :
      </label>

      <textarea
        id='text'
        name="text"
        placeholder='Enter the note here'
        className={`form__input form__input--text ${validTextClass}`}
        value={text}
        onChange={onTextChanged}
      >
      </textarea>

      <label className="form__label form__checkbox-container" htmlFor="username">
        ASSIGNED TO :
      </label>

      <select
        id='username'
        name='username'
        className="form__select"
        value={userId}
        onChange={onUserIdChanged}
      >
        {options}
      </select>
    </form>
  </>
);

return content;

}

export default NewNoteForm