import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardHeader, Grid, Grow, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';

export default function KPPNSelectionCardCK({
  header,
  image,
  link,
  completedKPPN,
  completedKanwil,
  total,
}: {
  header: string;
  image: string;
  link: string;
  completedKPPN: number;
  completedKanwil: number;
  total: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const kanwilPercent = total ? (completedKanwil / total) * 100 : 0;
  const kppnPercent = total ? (completedKPPN / total) * 100 : 0;

  return (
    <Grow in>
      <Card>
        <Grid container>
          <Grid item xs={6}>
            <CardHeader
              title={header}
              subheader={(
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">{`${kanwilPercent.toFixed(0)}% complete`}</Typography>
                  <Tooltip title={`Progress KPPN: ${completedKPPN}/${total} (${kppnPercent.toFixed(0)}%)`}>
                    <span><Iconify icon="solar:info-circle-bold-duotone" /></span>
                  </Tooltip>
                </Stack>
              )}
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <Box sx={{ p: 3, pt: 12 }}>
              <Button
                variant="contained"
                component={Link}
                to={link}
                endIcon={<Iconify icon="solar:book-2-bold-duotone" />}
              >
                Open
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              {!imageLoaded && <Skeleton variant="rounded" sx={{ width: '100%', height: 220 }} />}
              <img
                src={`/image/${image}`}
                alt={header}
                onLoad={() => setImageLoaded(true)}
                style={{ display: imageLoaded ? 'block' : 'none', height: 220, width: '100%', borderRadius: 12, objectFit: 'cover' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grow>
  );
}
