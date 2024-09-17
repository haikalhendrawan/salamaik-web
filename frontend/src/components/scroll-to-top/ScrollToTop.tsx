/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * bukan scroll to top button
 * utk mencegah not scroll to top saat navigasi antar page
 * utk scroll to top button di component scrollToTopButton
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
