import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../../features/users/usersApiSlice';
import { selectNoteById } from "../../features/notes/notesApiSlice";
import { SquareLoader } from "react-spinners";
import EditNoteForm from "./EditNoteForm";


const EditNote = () => {

  const { id } = useParams();

  const users = useSelector(selectAllUsers);

  const note = useSelector(state => selectNoteById(state,id));

  const content = note ? <EditNoteForm users={users} note={note} /> : <SquareLoader color="white" />

  return content;
}

export default EditNote