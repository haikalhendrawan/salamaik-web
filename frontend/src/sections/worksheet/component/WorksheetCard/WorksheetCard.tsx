import {useState, useRef, useEffect} from "react";
import { Typography, Grid, Card, CardHeader, Grow, Divider, Skeleton} from '@mui/material';
import InstructionPopover from "../InstructionPopover";
import {useTheme} from '@mui/material/styles';
import Head from "./Head";
import Kriteria from "./Kriteria";
import Dokumen from "./Dokumen";
import Nilai from "./Nilai";
import Catatan from "./Catatan";
import { WsJunctionType } from "../../types";
// ------------------------------------------------------------
interface WorksheetCardProps{
  modalOpen: () => void,
  modalClose: () => void,
  wsJunction: WsJunctionType | null,
  id?: string
};

// ------------------------------------------------------------
export default function WorksheetCard(props: WorksheetCardProps) {
  const theme = useTheme();

  const addFileRef = useRef<HTMLInputElement>(null);

  const [mounted, setIsMounted] = useState(false)

  const openUploadFile = () => {
    addFileRef.current? addFileRef.current.click() : null
  };

  const [openInstruction, setOpenInstruction] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

  const handleOpenInstruction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenInstruction(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseInstruction = () => {
    setOpenInstruction(false)
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!mounted) {
    return <WorksheetCardSkeleton />
  };

  return (
    <>
      <Grow in>
        <Grid item xs={12} sm={12} md={12}>
          <Card sx={{ minHeight: '300px' }} id={props.id}>
            <CardHeader
              title={
                <Head
                  num={props.wsJunction?.checklist_id}
                  title={props.wsJunction?.title || ""}
                  dateUpdated={new Date()}
                />
              }
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                height: '67px',
                pl: 1,
                pt: 0,
              }}
            />

            <Grid
              container
              sx={{
                mt: 1,
                mb: 1,
                textAlign: 'center',
                justifyContent: 'center',
                color: theme.palette.text.secondary,
              }}
              spacing={0}
            >
              {/* Table Header */}
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ mr: 1 }}>
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
            </Grid>

            <Divider flexItem />

            <Grid
              container
              sx={{
                mt: 0,
                maxHeight: '160px',
                textAlign: 'center',
                justifyContent: 'center',
              }}
              spacing={1}
            >
              {/* Table Body */}
              <Grid item xs={6}>
                <Kriteria
                  kriteria={props.wsJunction?.header || ""}
                  opsi={props?.wsJunction?.opsi || []}
                />
              </Grid>

              <Grid item xs={1.5}>
                <Dokumen
                  modalOpen={props.modalOpen}
                  openUploadFile={openUploadFile}
                  openInstruction={handleOpenInstruction}
                />
              </Grid>

              <Grid item xs={1.5}>
                <Nilai wsJunction={props.wsJunction} junctionId={props?.id | ""} />
              </Grid>

              <Grid item xs={3}>
                <Catatan />
              </Grid>
            </Grid>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />
          </Card>
        </Grid>
      </Grow>

      <InstructionPopover
        open={openInstruction}
        anchorEl={anchorEl}
        handleClose={handleCloseInstruction}
        instruction={props.wsJunction?.instruksi || null}
        fileExample={props.wsJunction?.contoh_file || null}
      />
    </>
  );
}


// ------------------------------------------------------------------------------------------------------

function WorksheetCardSkeleton(){
  return(
    <Grid item xs={12} sm={12} md={12}>
      <Skeleton variant="rounded" style={{width:'100%', height:'300px'}} />
    </Grid>
  )
}


