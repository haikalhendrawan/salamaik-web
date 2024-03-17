import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Iconify from '../components/iconify/Iconify';
// @mui
import { Container, Stack, Typography, Box, Button, Tabs, Tab } from '@mui/material';


// ----------------------------------------------------------------------

export default function WorksheetPage() {
  const [tabValue, setTabValue] = useState(0); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const override=  {
    display: "block",
    margin: "0 auto",
  };

  return (
    <>
      <Helmet>
        <title> Salamaik | Worksheet</title>
      </Helmet>

      <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Kertas Kerja
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center " mb={5}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<Iconify icon="lucide:briefcase-business" />} label="Treasurer" value={0} />
              <Tab icon={<Iconify icon="lucide:castle" />} label="PF, RKKD, SM " value={1} />
              <Tab icon={<Iconify icon="lucide:badge-dollar-sign" />} label="Financial Advisor" value={2} />
              <Tab icon={<Iconify icon="lucide:tower-control" />} label="Tata Kelola Internal" value={3} />
              {/* <Tab icon={<Iconify icon="material-symbols:send" />} label="Kirim" value={4} /> */}
            </Tabs>
          </Stack>

          
          
      </Container>
    </>
  );
}
