import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
import NewNote from "./features/notes/NewNote";
import EditNote from "./features/notes/EditNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";
import RequireAuth from "./features/auth/RequireAuth";

function App() {
  return (
    <Routes>
      {/* Parent element for whole webpage which is rendering every child element */}
      {/* This <Layout /> component ain't displaying any of the content. it is just rendering every child element */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        {/* A user come to this / directory this will be displayed */}
        <Route index element={<Public />} />

        {/* Only showing this <Login /> component when it is required */}
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              {/* Protected spefic area for each user */}
              <Route path="dash" element={<DashLayout />}>
                {/* index page of /dash */}
                <Route index element={<Welcome />} />

                {/* Notes directory  */}
                {/* contains pages for NotesList, NewNote, EditNote, etc. */}

                <Route path="notes">
                  <Route index element={<NotesList />} />

                  <Route path=":id" element={<EditNote />} />

                  <Route path="new" element={<NewNote />} />
                </Route>

                {/* Users directory */}
                {/*  */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />

                    <Route path=":id" element={<EditUser />} />

                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
