/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';
import useStandardization from '../useStandardization';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import { useAuth } from '../../../hooks/useAuth';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface AddButtonProps{
  kppn: string,
  standardizationId: number,
  month: number
};

export default function AddButton({kppn, standardizationId, month}: AddButtonProps){
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {auth} = useAuth();

  const {getStandardization} = useStandardization();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const handleChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    try{
      e.preventDefault();
      if(!e.target.files){return}
      const selectedFile = e.target.files[0];

      setIsLoading(true);
      const formData = new FormData();
      formData.append("kppnId", kppn.toString());
      formData.append("periodId", auth?.period?.toString() || '0');
      formData.append("standardizationId", standardizationId.toString());
      formData.append("month", month.toString());
      formData.append("timeStamp", new Date().getTime().toString());
      formData.append("stdFile", selectedFile);
      const response = await axiosJWT.post("/addStandardizationJunction", formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      await getStandardization(kppn);
      e.target.value = '';
      setIsLoading(false);
      openSnackbar(response.data.message, 'success');
    }catch(err: any){
      const errorMessage = err.response?.data?.message || 'Network Error';
      openSnackbar(errorMessage, 'error');
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  return(
    <>
      <IconButton 
        component="label"
      >
        <Iconify 
          sx={{color:theme.palette.grey[500]}} 
          icon="solar:add-circle-bold"
        />
        <VisuallyHiddenInput 
          type='file'
          accept='image/*,.pdf,.zip'
          onChange={handleChange} 
        />
      </IconButton>


    </>
  )
}