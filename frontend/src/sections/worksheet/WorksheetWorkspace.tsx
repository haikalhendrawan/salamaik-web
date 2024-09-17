/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import WorksheetKPPN from './WorksheetKPPN';
import WorksheetKanwil from './WorksheetKanwil';
import { useAuth } from '../../hooks/useAuth';

export default function WorksheetWorkspace() {
  const {auth} = useAuth();

  const isKanwil = auth?.kppn?.length === 5;

  return isKanwil? <WorksheetKanwil/> : <WorksheetKPPN/>
}
