import { Link } from 'react-router-dom';

const Public = () => {

    const content = (
        <section className="public">
            
            <header>
                <h1>Welcome to <span className="nowrap">Dilshan D. Computer Solutions!</span></h1>
            </header>

            <main className="public__main">
                <p>Located in Mulleriyawa New Town, Colombo.  <b>Dilshan D. Computer Solutions</b> provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    Dilshan D. Computer Solutions,<br />
                    No.212/A,<br />
                    Himbutana road,<br />
                    Mulleriyawa New Town<br />
                    <a href="tel:+94784358759">(+94) 78 435 8759</a>
                </address>
                <br />
                <p>Owner: Dilshan Dias</p>
            </main>

            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>
    )

    return content;
}

export default Public