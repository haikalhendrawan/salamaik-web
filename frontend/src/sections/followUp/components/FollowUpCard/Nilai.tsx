import { useMemo, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Skeleton  from "@mui/material/Skeleton";
import Tooltip from '@mui/material/Tooltip';
import StyledButton from '../../../../components/styledButton/StyledButton';
import Iconify from '../../../../components/iconify/Iconify';
import { TextField } from '@mui/material';
import styled  from '@mui/material/styles/styled';
import useWsJunction from "../../../worksheet/useWsJunction";
import useSocket from "../../../../hooks/useSocket";
import {useAuth} from "../../../../hooks/useAuth";
import useLoading from "../../../../hooks/display/useLoading";
import useSnackbar from "../../../../hooks/display/useSnackbar";
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { StandardizationType } from '../../../standardization/types';
import { FindingsResponseType } from '../../types';

// ------------------------------------------------------------
interface NilaiPropsType{
  findingResponse: FindingsResponseType | null,
  getData: () => Promise<void>,
  isDisabled: boolean
};

const StyledFormControl = styled(FormControl)(({}) => ({
  width: '100%',
  height: '100%'
}));

const StyledSelect = styled(Select)(({}) => ({
  fontSize: 12,
  typography:'body2'
}));

const StyledMenuItem = styled(MenuItem)(({}) => ({
  fontSize: 12,
}));

const StyledNumberTextField = styled(TextField)(({}) => ({
  typography:'body2',
  '& .MuiInputBase-input': {
    fontSize: 12,
    height:'1.4375em',
    borderRadius:'12px',
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  },
  width:'50%',
}));

// ------------------------------------------------------------
export default function Nilai({findingResponse, getData, isDisabled}: NilaiPropsType) {
  const [isMounted, setIsMounted] = useState(true);

  const matrixDetail = findingResponse?.matrixDetail[0] || null;

  const wsJunction = matrixDetail?.ws_junction[0] || null;

  const [stdScoreKanwil, setStdScoreKanwil] = useState(wsJunction?.kanwil_score || '');
  
  const [stdScoreKPPN, setStdScoreKPPN] = useState(wsJunction?.kppn_score || '');

  const {socket} = useSocket();

  const { auth } = useAuth();

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {getWsJunctionKanwil} = useWsJunction();

  const {openSnackbar} = useSnackbar();

  const isStandardisasi = findingResponse?.matrixDetail[0]?.standardisasi || 0;

  const isKanwil = useMemo(() =>{
    return auth?.kppn==='03010';
  }, [auth]);

  const opsiSelection = useMemo(() => matrixDetail?.opsi?.map((item, index) => (
    <StyledMenuItem key={index+1} value={item?.value?.toString() || ''}>{item?.value}</StyledMenuItem>
  ) || null), [wsJunction]);

  const handleChangeKanwilScore = async(newScore: string) => {
    setIsLoading(true);
    const score = parseInt(newScore);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKanwilScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilScore: score,
      userName: auth?.name
    }, async(response: any) => {
      try{
        if(!response?.success){
          openSnackbar(response?.message, 'error');
        };
        await getData()
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }finally{
        setIsLoading(false);
      }
    });

     await axiosJWT.post('/updateFindingsScore', {
      id: findingResponse?.id, 
      scoreBefore: wsJunction?.kanwil_score, 
      scoreAfter: score, 
      userName: auth?.name
    }).catch(err => openSnackbar(err?.response?.data?.message, 'error'));
  };

  const handleChangeKPPNScore = (newScore: string) => {
    setIsLoading(true);
    const score = parseInt(newScore);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKPPNScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kppnScore: score,
      userName: auth?.name
    }, async (response: any) => {
      try{
        if(!response?.success){
          openSnackbar(response?.message, 'error');
        };
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        await getData()
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }finally{
        setIsLoading(false);
      }
    });
  };

  const handleChangeKanwilScoreStd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const regex = /^(12(\.0{1,2})?|11(\.\d{1,2})?|10(\.\d{1,2})?|[0-9](\.\d{1,2})?|0(\.\d{1,2})?)$/;

    const newScore = e.target.value;
    
    if (!regex.test(newScore)) {
      e.target.value = '';
      setStdScoreKanwil(wsJunction?.kanwil_score || 0);
      return openSnackbar("Nilai harus berupa angka 0 - 12, (desimal gunakan titik)", "error");
    };

    const score = parseFloat(newScore);

    if (score < 0 || score > 12) {
      e.target.value = wsJunction?.kanwil_score?.toString() || '';
      setStdScoreKanwil(wsJunction?.kanwil_score || 0);
      return openSnackbar("Nilai maksimal 12", "error");
    };

    setStdScoreKanwil(newScore);
    setIsLoading(true);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKanwilScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilScore: score,
      userName: auth?.name
    }, async() => {
      try{
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }
    });
  };

  const handleChangeKPPNScoreStd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const regex = /^(12(\.0{1,2})?|11(\.\d{1,2})?|10(\.\d{1,2})?|[0-9](\.\d{1,2})?|0(\.\d{1,2})?)$/;

    const newScore = e.target.value;
    
    if (!regex.test(newScore)) {
      e.target.value = '';
      setStdScoreKPPN(wsJunction?.kppn_score || 0);
      return openSnackbar("Nilai harus berupa angka 0 - 12, (desimal gunakan titik)", "error");
    };

    const score = parseFloat(newScore);

    if (score < 0 || score > 12) {
      e.target.value = wsJunction?.kppn_score?.toString() || '';
      setStdScoreKPPN(wsJunction?.kppn_score || 0);
      return openSnackbar("Nilai maksimal 12", "error");
    };

    setStdScoreKPPN(newScore);
    setIsLoading(true);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKPPNScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kppnScore: score,
      userName: auth?.name
    }, async () => {
      try{
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        await getData()
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }
    });
  };

  const handleFetchStdScoreKanwil = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getStdWorksheet/${wsJunction?.kppn_id}`);
      const stdArray = response?.data?.rows;
      const score = stdArray?.filter((s: StandardizationType) => s?.id === wsJunction?.standardisasi_id)?.[0]?.score || 0;

      socket?.emit("updateKanwilScore", {
        worksheetId: wsJunction?.worksheet_id, 
        junctionId: wsJunction?.junction_id, 
        kanwilScore: score,
        userName: auth?.name
      }, async() => {
        try{
          setStdScoreKanwil(score.toString());
          await getWsJunctionKanwil(wsJunction?.kppn_id || '');
          await getData()
          setIsLoading(false);
        }catch(err: any){
          openSnackbar(err?.message, 'error');
          setStdScoreKanwil((prev) => prev);
        }
      });

      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Upload failed, ${err?.response?.data?.message || err.message}`, "error");
      setStdScoreKanwil((prev) => prev);
    }finally{
      setIsLoading(false);
    }
  };

  const handleFetchStdScoreKPPN = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getStdWorksheet/${wsJunction?.kppn_id}`);
      const stdArray = response?.data?.rows;
      const score = stdArray?.filter((s: StandardizationType) => s?.id === wsJunction?.standardisasi_id)?.[0]?.score || 0;

      socket?.emit("updateKPPNScore", {
        worksheetId: wsJunction?.worksheet_id, 
        junctionId: wsJunction?.junction_id, 
        kppnScore: score,
        userName: auth?.name
      }, async() => {
        try{
          await getWsJunctionKanwil(wsJunction?.kppn_id || '');
          await getData()
          setStdScoreKPPN(score.toString());
          setIsLoading(false);
        }catch(err: any){
          openSnackbar(err?.message, 'error');
          setStdScoreKPPN((prev) => prev);
        }
      });

      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Upload failed, ${err?.response?.data?.message || err.message}`, "error");
      setStdScoreKanwil(wsJunction?.kanwil_score?.toString() || '');
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return (
      <>
        <br/>
        <Skeleton variant="rounded" height={'1.4375em'} width={'100%'} />
        <br/>
        <br/>
        <Skeleton variant="rounded" height={'1.4375em'} width={'100%'} />
      </>
    );
  }

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai KPPN :</Typography>
        <StyledFormControl>
          {
            isStandardisasi === 1
            ?
              <Stack direction='row' spacing={2}>
                <StyledNumberTextField  
                  size='small'
                  type="text"
                  onChange={(e) => setStdScoreKPPN(e.target.value)}
                  onBlur={(e) => handleChangeKPPNScoreStd(e)}
                  disabled={isKanwil || isDisabled}
                  value={stdScoreKPPN}
                />
                <Tooltip title='Ambil nilai standardisasi'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      disabled={isKanwil}
                      onClick={() => handleFetchStdScoreKPPN()}
                    >
                      <Iconify icon="solar:refresh-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              </Stack>
            :
              <StyledSelect
                required 
                name="kppnScore" 
                value={wsJunction?.kppn_score !== null ? String(wsJunction?.kppn_score) : ''}
                onChange={(e) => handleChangeKPPNScore(e.target.value as string)}
                size='small' 
                disabled={isKanwil || isDisabled}
              >
                {opsiSelection}
                <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
              </StyledSelect>
          }
        </StyledFormControl>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai Kanwil :</Typography>
        <StyledFormControl>
          {
            isStandardisasi === 1
            ?
              <Stack direction='row' spacing={2}>
                <StyledNumberTextField  
                  size='small'
                  type="text"
                  onChange={(e) => setStdScoreKanwil(e.target.value)}
                  onBlur={(e) => handleChangeKanwilScoreStd(e)}
                  disabled={!isKanwil || isDisabled}
                  value={stdScoreKanwil}
                />
                <Tooltip title='Ambil nilai standardisasi'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      disabled={!isKanwil || isDisabled}
                      onClick={() => handleFetchStdScoreKanwil()}
                    >
                      <Iconify icon="solar:refresh-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              </Stack>
            :
              <StyledSelect 
                required 
                name="kanwilScore" 
                value={wsJunction?.kanwil_score !== null ? String(wsJunction?.kanwil_score) : ''} 
                onChange={(e) => handleChangeKanwilScore(e.target.value as string)}
                size='small' 
                disabled={!isKanwil || isDisabled}
              >
                {opsiSelection}
                <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
              </StyledSelect>
          }
        </StyledFormControl>
      </Stack>
    </Stack>    
  );
}
