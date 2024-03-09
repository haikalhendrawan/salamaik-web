import React, { useState } from 'react';
import { Document, Page, pdfjs} from 'react-pdf';
import {IconButton, Button, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Scrollbar from '../scrollbar';
import Iconify from '../iconify';
import "./Sample.css";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFViewer {
  fileName: string;
}

export default function PDFViewer(props: PDFViewer) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const theme = useTheme();

  const onDocumentLoadSuccess = ({ numPages }:{ numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };
  return (
        <>
          <Scrollbar>
          <Document
            file={props.fileName}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          
          </Scrollbar>
          <div style={{position:'absolute', bottom:0, right:'45%', zIndex:100, justifyContent:'center', alignContent:'center'}}>
            <Typography variant='body2' color={theme.palette.common.black}>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </Typography>
            <IconButton disabled={pageNumber <= 1} onClick={previousPage}>
              <Iconify icon="solar:alt-arrow-left-bold-duotone" color={theme.palette.primary.light}/>
            </IconButton>
            <IconButton  disabled={pageNumber >= numPages} onClick={nextPage}>
              <Iconify icon="solar:alt-arrow-right-bold-duotone" color={theme.palette.primary.light}/>
            </IconButton>
            {/* <Button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              variant='contained'
              size='small'
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              variant='contained'
              size='small'
            >
              Next
            </Button> */}
          </div>
          </>
  );
}