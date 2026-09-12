import { Fragment, useMemo } from 'react';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useDictionary from '../../../../../hooks/useDictionary';
import formatOrderedTitle from '../../../../../utils/formatOrderedTitle';

const LoadingDataCells = () => (
  <>
    <TableCell><Skeleton variant="text" width="95%" /><Skeleton variant="text" width="72%" /></TableCell>
    <TableCell><Skeleton variant="rounded" height={32} /></TableCell>
    <TableCell><Skeleton variant="rounded" height={32} /></TableCell>
    <TableCell><Skeleton variant="rounded" height={30} /><Skeleton variant="rounded" height={30} sx={{ mt: 0.75 }} /></TableCell>
    <TableCell><Skeleton variant="rounded" height={54} /></TableCell>
    <TableCell align="center"><Skeleton variant="circular" width={30} height={30} sx={{ mx: 'auto' }} /></TableCell>
  </>
);

export default function WorksheetSPMLTableSkeleton() {
  const theme = useTheme();
  const {
    komponenSpmlRef,
    subKomponenSpmlRef,
    aspekSpmlRef,
    checklistSpmlRef,
  } = useDictionary();

  const hierarchy = useMemo(() => {
    if (!komponenSpmlRef || !subKomponenSpmlRef || !aspekSpmlRef || !checklistSpmlRef) {
      return null;
    }

    const subKomponenByKomponen = new Map<number, typeof subKomponenSpmlRef>();
    const aspekBySubKomponen = new Map<number, typeof aspekSpmlRef>();
    const checklistByAspek = new Map<number, typeof checklistSpmlRef>();

    subKomponenSpmlRef.forEach((item) => {
      const rows = subKomponenByKomponen.get(item.komponen_spml_id) ?? [];
      rows.push(item);
      subKomponenByKomponen.set(item.komponen_spml_id, rows);
    });
    aspekSpmlRef.forEach((item) => {
      const rows = aspekBySubKomponen.get(item.subkomponen_spml_id) ?? [];
      rows.push(item);
      aspekBySubKomponen.set(item.subkomponen_spml_id, rows);
    });
    checklistSpmlRef.forEach((item) => {
      const rows = checklistByAspek.get(item.aspek_spml_id) ?? [];
      rows.push(item);
      checklistByAspek.set(item.aspek_spml_id, rows);
    });

    return komponenSpmlRef.map((komponen) => ({
      komponen,
      subKomponen: (subKomponenByKomponen.get(komponen.id) ?? []).map((subKomponen) => ({
        subKomponen,
        aspek: (aspekBySubKomponen.get(subKomponen.id) ?? []).map((aspek) => ({
          aspek,
          checklist: checklistByAspek.get(aspek.id) ?? [],
        })),
      })),
    }));
  }, [aspekSpmlRef, checklistSpmlRef, komponenSpmlRef, subKomponenSpmlRef]);

  if (!hierarchy) {
    return (
      <>
        {Array.from({ length: 6 }, (_, index) => (
          <TableRow key={index}>
            <TableCell colSpan={8}>
              <Skeleton variant="rounded" height={48} />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  return (
    <>
      {hierarchy.map(({ komponen, subKomponen }) => (
        <Fragment key={komponen.id}>
          <TableRow>
            <TableCell
              colSpan={8}
              sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {formatOrderedTitle(komponen.urut, komponen.title)}
            </TableCell>
          </TableRow>
          {subKomponen.map(({ subKomponen: subKomponenItem, aspek }) => (
            <Fragment key={subKomponenItem.id}>
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{
                    bgcolor: theme.palette.text.main,
                    color: theme.palette.text.main,
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {formatOrderedTitle(subKomponenItem.urut, subKomponenItem.title)}
                </TableCell>
              </TableRow>
              {aspek.map(({ aspek: aspekItem, checklist }) => (
                <Fragment key={aspekItem.id}>
                  {checklist.map((item, index) => (
                    <TableRow key={item.id}>
                      {index === 0 && (
                        <>
                          <TableCell rowSpan={checklist.length} sx={{ fontSize: '12px' }}>
                            {aspekItem.urut}
                          </TableCell>
                          <TableCell rowSpan={checklist.length} sx={{ fontSize: '12px' }}>
                            {aspekItem.title}
                          </TableCell>
                        </>
                      )}
                      <LoadingDataCells />
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}
