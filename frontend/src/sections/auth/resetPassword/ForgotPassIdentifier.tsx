// @mui
import { Typography, Stack, Link} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import axiosPublic from "../../../config/axios";
//-------------------------------------------------------------------------------------
interface ValueType{
  username: string;
  email: string;
};

interface ForgotPassIdentifierPropsType{
  handleChange: any;
  identityValue: ValueType;
  handleChangeView: (set: 0 | 1 |2) => void;
  handleChangeOtp: (otp: string) => void;
  handleChangeToken: (token: string) => void
};

//-------------------------------------------------------------------------------------

export default function ForgotPassIdentifier({
  handleChange, 
  identityValue, 
  handleChangeView,
  handleChangeOtp,
  handleChangeToken}:ForgotPassIdentifierPropsType) {
  const {openSnackbar} = useSnackbar();

  const handleSubmit = async() => {
    try{
      handleChangeView(1);
      const response = await axiosPublic.post('/getForgotPassToken', identityValue);
      handleChangeOtp(response.data.otp);
      handleChangeToken(response.data.token);
    }catch(err: any){
      handleChangeView(0);
      openSnackbar(err.response.data.message, 'error');
    }
  };

  return(
    <>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Typography sx={{mb:5}}>
        Please enter your NIP and email address
      </Typography>

      <div>
          <Stack spacing={3}>
            <StyledTextField 
                name="username" 
                label="NIP" 
                onChange={handleChange} 
                value={identityValue.username}
              />

            <StyledTextField
              name="email"
              label="Email"
              onChange={handleChange}
              value={identityValue.email}
            />
          </Stack>

          <LoadingButton 
            fullWidth 
            size="large" 
            type="submit" 
            variant="contained" 
            sx={{mt: 3}}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>

          <Stack direction="row" alignItems="center" justifyContent="start" sx={{ my: 3 }}>
            <Iconify icon="eva:arrow-ios-back-fill" sx={{ mr: 1 }} />
            <Link variant="subtitle2" underline="hover" href="/login" sx={{zIndex:1}}>
              Back to login
            </Link>
          </Stack>
      </div>
    </>
  )
}