import { useNavigate } from "react-router";

function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div>
            <h2>404 - PageNotFound bro. Give a correct Address bro ?</h2>
            <button onClick={() => {navigate('/login')}}>Login</button>
        </div>
    )
}

export default PageNotFound;