import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditNoteForm = ({users,note}) => {

  const [updateNote, {
      isLoading,
      isSuccess,
      isError,
      error
  }] = useUpdateNoteMutation();

  const [deleteNote, {
      isSuccess : isDelSuccess,
      isError : isDelError,
      error : delError
  }] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle ] = useState(note.title);
  const [text, setText ] = useState(note.text);
  const [userId, setUserId ] = useState(note.user); //default state is userId not username
  const [completed, setCompleted ] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  },[isSuccess,isDelSuccess,navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onCompletedChanged = () => setCompleted(prev => !prev);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onNoteUpdateClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, title, text, user: userId, completed });
    }
  };

  const onNoteDeleteClicked = async () => {
    await deleteNote({id : note.id});
  }

  const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
  const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });


  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ''
  const validTextClass = !text ? "form__input--incomplete" : ''

  const errContent = (error?.data?.message || delError?.data?.message) ?? ''

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {/* Hearder + Buttons */}
        <div className="form__title-row">
          <h2>Edit Note</h2>

          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="save"
              disabled={!canSave}
              onClick={onNoteUpdateClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>

            <button
              className="icon-button"
              title="delete"
              onClick={onNoteDeleteClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
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
          autoComplete="off"
          className={`form__input ${validTitleClass}`}
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text :
        </label>

        <textarea
          id="text"
          name="text"
          placeholder="Enter the note here"
          className={`form__input form__input--text ${validTextClass}`}
          value={text}
          onChange={onTextChanged}
        ></textarea>

        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
}

export default EditNoteForm