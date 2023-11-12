import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import {ScaleLoader} from 'react-spinners';

const UsersList = () => {

  const {
    data : users,
    isLoading,
    isSuccess,
    isError,
    error
 } = useGetUsersQuery(undefined, {
        pollingInterval : 60000, //60s
        refetchOnFocus : true,
        refetchOnMountOrArgChange : true
 }); //These changes couldn't be able to make if that "setupListeners" wasn't added to the store

 let content; 

 if (isLoading) {
    content = <ScaleLoader color="white" />
 }

 if (isError) {
    content = <p className="errmsg">{error?.data}</p>
 }

 if(isSuccess){
    const {ids} = users;

    const tableContent = ids?.length ? ids.map(userId => <User key={userId} userId={userId} />)  : null

    content = (
      <table className="table table--users">
        <thead className="table_thead">
            <tr>
              <th scope="col" className="table__th user_username">Username</th>
              <th scope="col" className="table__th user_roles">Roles</th>
              <th scope="col" className="table__th user_edit">Edit</th>
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

export default UsersList