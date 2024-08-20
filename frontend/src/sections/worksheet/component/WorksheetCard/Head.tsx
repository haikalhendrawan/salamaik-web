import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Iconify from "../../../../components/iconify";
import styled  from '@mui/material/styles/styled';
import { parseISO, format } from 'date-fns';
import StyledButton from '../../../../components/styledButton/StyledButton';
import { useAuth } from '../../../../hooks/useAuth';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useLoading from '../../../../hooks/display/useLoading';
import { WsJunctionType } from '../../types';
import useWsJunction from '../../useWsJunction';
// ------------------------------------------------------------
interface HeadPropInterface{
  num: number | undefined,
  title:string,
  dateUpdated: string | null,
  updatedBy: string | null,
  wsJunction: WsJunctionType | null
};

const StyledIconButton = styled(IconButton)(({}) => ({
  color: 'rgb(0, 167, 111)',
  borderRadius: '50%',
}));

const MainStack = styled(Stack)(({theme}) => ({
  justifyContent:'space-between',
  marginLeft: theme.spacing(1),
}));

const SubStack = styled(Stack)(({}) => ({
  alignItems:'center'
}));

// ------------------------------------------------------------
export default function Head(props: HeadPropInterface) {  // bagian atas dari card
  const dateUpdated = props?.dateUpdated ? format(parseISO(props.dateUpdated), 'dd/MM/yyyy - HH:mm:ss') : null;

  const tooltipText = <div>Last update: {dateUpdated} <br/> By: {props.updatedBy}</div>;

  const isUpdate = props?.dateUpdated;

  const {getWsJunctionKanwil} = useWsJunction();

  const {auth} = useAuth();

  const isAdmin = auth?.role===99 || auth?.role===4;

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const isExcluded = props?.wsJunction?.excluded===1;

  const excludeReverse = isExcluded? 0 : 1;

  const handleChangeExclude = async(exclude:number) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post("/editWsJunctionExclude", {
        junctionId: props?.wsJunction?.junction_id,
        exclude: exclude
      });
      await getWsJunctionKanwil(props?.wsJunction?.kppn_id || '');
      setIsLoading(false);
      openSnackbar(response.data.message, "success");
    }catch(err:any){
      openSnackbar(err?.response?.data?.message, "error");
    }finally{
      setIsLoading(false);
    }
  };

  return(
  <>
    <MainStack direction="row" spacing={2}>
      <SubStack direction="row" spacing={1}>
          <Typography variant="h6" fontSize={14} marginLeft={1} >{`${props.num}`}</Typography>
          <Stack >
            <Typography variant="body1" fontSize={15} >{props.title}</Typography>
          </Stack>
      </SubStack>
      <SubStack direction="row" spacing={1}>
        {
          isAdmin
          ?
            <Tooltip title={isExcluded?'Excluded':'Not excluded'}>
              <span>
                <StyledButton 
                  aria-label="edit" 
                  variant='contained' 
                  size='small' 
                  color={isExcluded?'success':'white'}
                  onClick={() => handleChangeExclude(excludeReverse)}
                >
                  <Iconify icon="solar:flag-2-bold-duotone" />
                </StyledButton>
              </span>
            </Tooltip>
          : null
        }
        {isUpdate?
          <Tooltip title={tooltipText} placement="left-start">
            <StyledIconButton disableRipple><Iconify icon={"solar:check-circle-bold"} /></StyledIconButton>
          </Tooltip>:
          null
        }
      </SubStack>
      

    </MainStack>
  </>
  )
}