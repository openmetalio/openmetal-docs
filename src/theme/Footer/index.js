import React from 'react';
import Footer from '@theme-original/Footer';
import FooterCustom from '../../components/Footer';

export default function FooterWrapper(props) {
  return (
    <>
      {/* <Footer {...props} /> */}
      <FooterCustom {...props} />
    </>
  );
}
