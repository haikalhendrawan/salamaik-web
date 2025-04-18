/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState, useEffect, useCallback } from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import InstructionPopover from "./InstructionPopover";
import styled from '@mui/material/styles/styled';
import Head from "./Head";
import Kriteria from "./Kriteria";
import Dokumen from "./Dokumen";
import Nilai from "./Nilai";
import Catatan from "./Catatan";
import CommentPopover from "./CommentPopover";
import { WsJunctionType, WorksheetType } from "../../types";
import { debounce } from 'lodash';
// ------------------------------------------------------------
interface WorksheetCardProps {
  modalOpen: () => void,
  modalClose: () => void,
  wsJunction: WsJunctionType | null,
  wsDetail: WorksheetType | null,
  id?: string
};

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: '67px',
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0),
}));

const HeadGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textAlign: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const BodyGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(0),
  maxHeight: '160px',
  textAlign: 'center',
  justifyContent: 'center',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderStyle: 'dashed',
  marginTop: theme.spacing(3)
}));

// ------------------------------------------------------------
export default function WorksheetCard(props: WorksheetCardProps) {
  const [mounted, setIsMounted] = useState(false);

  const [renderNilai, setRenderNilai] = useState(false);

  const [openInstruction, setOpenInstruction] = useState<boolean>(false);

  const [openComment, setOpenComment] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

  const [anchorElComment, setAnchorElComment] = useState<EventTarget & HTMLButtonElement | null>(null);

  const handleOpenInstruction = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenInstruction(true);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseInstruction = useCallback(() => {
    setOpenInstruction(false);
  }, []);

  const handleOpenComment = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenComment(true);
    setAnchorElComment(event.currentTarget);
  }, []);

  const handleCloseComment = useCallback(() => {
    setOpenComment(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const debounceRenderNilai = debounce(() => setRenderNilai(true), 500);  
    debounceRenderNilai();

    return () => {
      debounceRenderNilai.cancel();
    };
  }, []);

  const isExcluded = props?.wsJunction?.excluded ===1;
  const disableStyle = {opacity: 0.6, pointerEvents: 'none'};

  if (!mounted) {
    return <WorksheetCardSkeleton />;
  }



  return (
    <>
      <Grid item xs={12} sm={12} md={12}>
        <Card sx={{minHeigth:'300px'}} id={props.id} key={props.wsJunction?.checklist_id}>
          <StyledCardHeader
            title={
              <Head
                num={props?.wsJunction?.checklist_id}
                title={props?.wsJunction?.title || ""}
                dateUpdated={props?.wsJunction?.last_update || null}
                updatedBy={props?.wsJunction?.updated_by || null}
                wsJunction={props?.wsJunction}
                wsDetail={props?.wsDetail} 
                openComment={handleOpenComment}
              />
            }
          />

          <HeadGrid container spacing={0}>
            {/* Table Header */}
            <Grid item xs={6}>
              <Typography variant="body2">
                Kriteria
              </Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography variant="body2">Dokumen</Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Typography variant="body2">Nilai</Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body2">Catatan Kanwil</Typography>
            </Grid>
          </HeadGrid>

          <Divider flexItem />

          <BodyGrid
            container
            spacing={1}
            sx={isExcluded ? disableStyle : null}
          >
            <Grid item xs={6}>
              <Kriteria
                kriteria={props?.wsJunction?.header || ""}
                opsi={props?.wsJunction?.opsi || []}
              />
            </Grid>

            <Grid item xs={1.5}>
              <Dokumen 
                openInstruction={handleOpenInstruction} 
                wsJunction={props?.wsJunction} 
                wsDetail={props?.wsDetail}
              />
            </Grid>

            <Grid item xs={1.5}>
              {renderNilai && 
                <Nilai 
                  wsJunction={props?.wsJunction} 
                  wsDetail={props?.wsDetail} 
                  isExcluded={isExcluded}
                />
              }
            </Grid>

            <Grid item xs={3}>
              <Catatan wsJunction={props?.wsJunction} wsDetail={props?.wsDetail}/>
            </Grid>
          </BodyGrid>

          <StyledDivider />
        </Card>
      </Grid>

      <InstructionPopover
        open={openInstruction}
        anchorEl={anchorEl}
        handleClose={handleCloseInstruction}
        instruction={props.wsJunction?.instruksi || null}
        fileExample={props.wsJunction?.contoh_file || null}
      />

      <CommentPopover
        open={openComment}
        anchorEl={anchorElComment}
        handleClose={handleCloseComment}
        wsJunctionId={props.wsJunction?.junction_id || 0}
      />

    </>
  );
}

// ------------------------------------------------------------------------------------------------------

function WorksheetCardSkeleton() {
  return (
    <Grid item xs={12} sm={12} md={12}>
      <Skeleton variant="rounded" height={'300px'} width={'100%'} />
    </Grid>
  );
}
