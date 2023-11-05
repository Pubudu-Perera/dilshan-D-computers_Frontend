import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';

function App() {
  return (
    <Routes>

      {/* Parent element for whole webpage which is rendering every child element */}
      {/* This <Layout /> component ain't displaying any of the content. it is just rendering every child element */}
      <Route path='/' element={<Layout />}>

        {/* A user come to this / directory this will be displayed */}
          <Route index element={<Public />} />

        {/* Only showing this <Login /> component when it is required */}
          <Route path='login' element={<Login />} />

        {/* Protected spefic area for each user */}
          <Route path='dash' element={<DashLayout />} >

            {/* index page of /dash */}
              <Route index element={<Welcome />} />
            
            {/* Notes directory  */}
            {/* contains pages for NotesList, CreateNote, UpdateNote, etc. */}
              <Route path='notes'>
                <Route index element={<NotesList />}/>
              </Route>

            {/* Users directory */}
            {/*  */}
              <Route path='users'>
                <Route index element={<UsersList />}/>
              </Route>

          </Route>
      </Route>
    </Routes>
  );
}

export default App;
