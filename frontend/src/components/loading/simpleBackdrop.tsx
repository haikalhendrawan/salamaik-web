/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */


/**
 * backdrop utk disable activity saat loading
 * 
 */
import Backdrop from '@mui/material/Backdrop';
import PuffLoader from "react-spinners/PuffLoader";

export default function SimpleBackdrop() {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <div style ={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <PuffLoader color={'white'} style={{ justifyContent: 'center', alignItems: 'center' }}/>
        </div>
      </Backdrop>
    </div>
  );
}