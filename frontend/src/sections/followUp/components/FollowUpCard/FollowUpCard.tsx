/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect, useCallback,useMemo} from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import InstructionPopover from "../InstructionPopover";
import styled from '@mui/material/styles/styled';
import Head from "./Head";
import Kriteria from "./Kriteria";
import Dokumen from "./Dokumen";
import Nilai from "./Nilai";
import Catatan from "./Catatan";
import Approval from "./Approval";
import { FindingsResponseType } from "../../types";
// ------------------------------------------------------------
interface FollowUpCardProps{
  findingResponse: FindingsResponseType | null,
  id?: string,
  getData: () => Promise<void>,
  isDisabled: boolean
};

const StyledCardHeader = styled(CardHeader)(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: '67px',
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0),
}));

const HeadGrid = styled(Grid)(({theme}) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textAlign: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const BodyGrid = styled(Grid)(({theme}) => ({
  marginTop: theme.spacing(0),
  maxHeight: '160px',
  textAlign: 'center',
  justifyContent: 'center',
}));

const StyledDivider = styled(Divider)(({theme}) => ({
  borderStyle: 'dashed', 
  marginTop: theme.spacing(3)
}));

// ------------------------------------------------------------
export default function FollowUpCard(props: FollowUpCardProps) {
  const [mounted, setIsMounted] = useState(false);

  const matrixDetail = props.findingResponse?.matrixDetail[0] || null;

  const wsJunction = useMemo(() => matrixDetail?.ws_junction[0], [props.findingResponse]) || null;

  console.log(matrixDetail);

  const checklist = matrixDetail?.checklist[0] || null;

  const [openInstruction, setOpenInstruction] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

  const handleOpenInstruction = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenInstruction(true);
    setAnchorEl(event.currentTarget);
  }, []); 

  const handleCloseInstruction = useCallback(() => {
    setOpenInstruction(false)
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!mounted) {
    return <FollowUpCardSkeleton />
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={12}>
        <Card sx={{ minHeight: '300px' }} id={props.id} key={props.findingResponse?.checklist_id}>
          <StyledCardHeader
            title={
              <Head
                num={checklist?.id || 0}
                title={checklist?.title || ""}
                dateUpdated={wsJunction?.last_update || null}
                updatedBy={wsJunction?.updated_by || null}
              />
            }
          />

          <HeadGrid container spacing={0}>
            {/* Table Header */}
            <Grid item xs={4.5}>
              <Typography variant="body2">
                Kriteria
              </Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography variant="body2">
                Dokumen
              </Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography variant="body2">
                Nilai
              </Typography>
            </Grid>

            <Grid item xs={1.75}>
              <Typography variant="body2">
                Tanggapan KPPN
              </Typography>
            </Grid>

            <Grid item xs={1.75}>
              <Typography variant="body2">
                Catatan Kanwil
              </Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body2">
                Approval
              </Typography>
            </Grid>
          </HeadGrid>

          <Divider flexItem />

          <BodyGrid container spacing={1}>
            <Grid item xs={4.5}>
              <Kriteria
                kriteria={checklist?.header || ""}
                opsi={matrixDetail?.opsi || []}
              />
            </Grid>

            <Grid item xs={1.5}>
              <Dokumen 
                openInstruction={handleOpenInstruction} 
                findingResponse={props.findingResponse} 
                getData={props.getData}
                isDisabled={props.isDisabled}
              />
            </Grid>

            <Grid item xs={1.5}>
              <Nilai 
                findingResponse={props.findingResponse} 
                getData={props.getData} 
                isDisabled={props.isDisabled}
              />
            </Grid>

            <Grid item xs={3.5}>
              <Catatan 
                findingResponse={props.findingResponse} 
                getData={props.getData} 
                isDisabled={props.isDisabled}
              />
            </Grid>

            <Grid item xs={1}>
              <Approval 
                findingResponse={props.findingResponse} 
                getData={props.getData} 
                isDisabled={props.isDisabled}
              />
            </Grid>
          </BodyGrid>

          <StyledDivider  />
        </Card>
      </Grid>

      <InstructionPopover
        open={openInstruction}
        anchorEl={anchorEl}
        handleClose={handleCloseInstruction}
        instruction={checklist?.instruksi || null}
        fileExample={checklist?.contoh_file || null}
      />
    </>
  );
}


// ------------------------------------------------------------------------------------------------------

function FollowUpCardSkeleton(){
  return(
    <Grid item xs={12} sm={12} md={12}>
      <Skeleton variant="rounded" height={'300px'} width={'100%'} />
    </Grid>
  )
}


