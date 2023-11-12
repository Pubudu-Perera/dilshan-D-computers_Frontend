import { useGetNotesQuery} from '../notes/notesApiSlice'
import { ScaleLoader } from "react-spinners";
import Note from './Note';

const NotesList = () => {

    const {
        data : notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery(undefined, {
        pollingInterval : 15000, //15s
        refetchOnFocus : true,
        refetchOnMountOrArgChange : true
 });
    // console.log(notes);
    let content;

    if (isLoading) {
        content = <ScaleLoader color='white' />
    }

    if(isError){
        content = <p className='errMsg'>{error?.data}</p>
    }

    if (isSuccess) {
        
        const { ids } = notes;

        const tableContent = ids?.length ? ids.map(noteId => <Note noteId={noteId} />) : null

        content = (
            <table className='table table--notes'>
                <thead className='table__head'>
                    <tr>
                        <th scope='col' className='table__th note__status'>Username</th>
                        <th scope='col' className='table__th note__created'>Created</th>
                        <th scope='col' className='table__th note__updated'>Updated</th>
                        <th scope='col' className='table__th note__title'>Title</th>
                        <th scope='col' className='table__th note__username'>Owner</th>
                        <th scope='col' className='table__th note__edit'>Edit</th>
                    </tr>
                </thead>

                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;

}

export default NotesList