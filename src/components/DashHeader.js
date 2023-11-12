import {Link} from 'react-router-dom';

const DashHeader = () => {

    const content = (
        <header className="dash-header">
            <div className="dash-header__container">

                {/* Redirect to /dash page when a user clicked the header */}
                <Link to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                
                <nav className="dash-header__nav">
                    {/* add nav buttons later */}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader