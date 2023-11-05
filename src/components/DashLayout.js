import {Outlet} from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

// This is the component displayed to an user when he is logged into the system.
const DashLayout = () => {
  return (
    <>
        <DashHeader />
        <div className='dash-container'>
            <Outlet />
        </div>
        <DashFooter />
    </>
  )
}

export default DashLayout