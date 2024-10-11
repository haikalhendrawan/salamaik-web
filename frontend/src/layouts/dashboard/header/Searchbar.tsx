/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, 
  ClickAwayListener, MenuItem, Paper, Stack, Typography, Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }: any) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const StyledSearchDropdown = styled('div')(({ theme }: any) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 10 + HEADER_MOBILE,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5),
  },
}));

const SEARCH_ITEM = [
  {
    name: "Home",
    path: "home",
    keyword: ["salamaik", "dashboard", "home", "awal", "utama", "main", "progress", "temuan", "gallery", "data", "history", "analisis"]
  },
  {
    name: "Kertas Kerja",
    path: "worksheet",
    keyword: ["kertas kerja", "worksheet", "komponen", "subkomponen", "kppn", "kanwil", "progress", "nilai", "data dukung", "komentar", "comment", "dokumen", "instruksi", "panduan", "score", "checklist"]
  },
  {
    name: "Matriks",
    path: "matrix",
    keyword: ["matriks", "rekapitulasi", "komponen", "subkomponen", "kppn", "kanwil", "progress"]
  },
  {
    name: "Tindak Lanjut",
    path: "followUp",
    keyword: ["tindak lanjut", "permasalahan", "temuan", "komponen", "subkomponen", "kppn", "kanwil", "progress", "follow up"]
  },
  {
    name: "Standardisasi",
    path: "standardization",
    keyword: ["standardisasi", "dokumen", "kppn", "kekurangan", "file", "bulanan", "triwulanan", "mingguan"]
  },
  {
    name: "Referensi User",
    path: "reference/user",
    keyword: ["admin", "reference", "user", "role", "kppn", "kanwil", "kewenangan", "hapus", "delete", "active", "demote"]
  },
  {
    name: "Referensi Kertas Kerja",
    path: "reference/worksheet/batch",
    keyword: ["admin", "reference", "worksheet", "komponen", "subkomponen", "subsubkomponen", "checklist", "periode", "batch", "active", "pembinaan", "open period", "close period"]
  },
  {
    name: "Interface Gallery",
    path: "interface/gallery",
    keyword: ["admin", "interface", "gallery", "picture", "foto", "koleksi"]
  },
  {
    name: "Interface Notification",
    path: "interface/notification",
    keyword: ["admin", "interface", "notification", "reminder", "alert"]
  },
];
// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState<string>('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    setSearchValue(e?.target.value || '');
  };

  const filteredItems = SEARCH_ITEM.filter((item) => {
    return item.keyword.some((word) => word.toLowerCase().includes(searchValue.toLowerCase()) && searchValue.length > 0);
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (searchItem: any, e: any) => {
    e.stopPropagation();
    navigate(`/${searchItem.path}`);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              onChange={(e) => handleChange(e)}
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" onClick={handleClose}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchDropdown onClick={handleClose}>
            <Stack direction="column" width="100%" spacing={1} paddingTop={2} paddingBottom={2}>
              {
                filteredItems?.slice(0, 3).map((item, index) => (
                  <SearchItem key={index} onClick={(e) => handleClick(item, e)} title={item.name} path={item.path} />
                ))
              }
            </Stack>
          </StyledSearchDropdown>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}

// -------------------------------------------------------------------------------------------------------------------------
interface SearchItemProps{
  onClick?: (e: any) => void,
  title: string,
  path: string 
};

function SearchItem({onClick, title, path}: SearchItemProps){

  return (
    <>
      <div style={{width: '100%', height: '100%'}}>
        <Paper>
          <MenuItem onClick={onClick}>
            <Stack direction="column">
              <Link href="#"><Typography variant="body1" fontSize={12}>{title}</Typography></Link>
              <Typography variant="body3" fontSize={12}>{path}</Typography>
            </Stack>
          
          </MenuItem>
        </Paper>
      </div>
    </>
  )
}
