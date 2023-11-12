import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

import { SquareLoader } from 'react-spinners';

// Why user feature does not contain component like NewUser??
// Answer -: When adding a new user, all the data which is required to submit the user form(NewUserForm) is NEW. but in NewNoteForm you need to contain existing data from different modules. Ex-: Every note must be assigned to a user. 

const NewNote = () => {
    const users = useSelector(selectAllUsers)

    // Why?
    if (!users?.length) return <p>Not Currently Available</p>

    const content = users ? <NewNoteForm users={users} /> : <SquareLoader color='white' />

    return content
}
export default NewNote