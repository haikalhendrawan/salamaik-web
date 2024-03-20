import {useCallback} from "react";
import {Box, Fab, useScrollTrigger, Zoom, Tooltip} from "@mui/material";
import Iconify from "../iconify";
// --------------------------------------------------------------------


export default function ScrollToTopButton(){

  const trigger = useScrollTrigger({
    threshold: 100,
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return(
  <>
    <Zoom in={trigger}>
      <Tooltip title="Scroll to top" placement="left">
        <Box
          role="presentation"
          // Place the button in the bottom right corner.
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1,
          }}
        >
          <Fab
            onClick={scrollToTop}
            color="primary"
            size="small"
            aria-label="Scroll back to top"
          >
            <Iconify icon="lucide:chevron-up" />
          </Fab>
        </Box>
      </Tooltip>
      
    </Zoom>
  </>
  )
}