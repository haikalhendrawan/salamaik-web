/**
 * backdrop utk disable activity saat loading
 * 
 */

import {useState} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
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