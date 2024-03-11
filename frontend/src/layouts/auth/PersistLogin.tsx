import {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
// layout
// import Footer from '../dashboard/footer';
import PuffLoader from "react-spinners/PuffLoader";
// hooks
import useRefreshToken from "../../hooks/useRefreshToken";


const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }catch(err){
                console.log(err);
            }finally {
                setIsLoading(false);
            }
        }
        
        verifyRefreshToken();

        return (() => {isMounted = false}) 
    }, []);

    return (
        <>
        {isLoading? 
            <div style ={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <PuffLoader color={'blue'}  style={{ justifyContent: 'center', alignItems: 'center' }}/>
            </div>
        :
            <> 
                <Outlet />
            </>
        }
        </>
    )
}

export default PersistLogin;