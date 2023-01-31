import React from 'react';
import Navbar from '@theme-original/Navbar';
import NavbarCustom from '../../components/Navbar';

export default function NavbarWrapper(props) {
  return (
    <>
      <Navbar {...props} />
      <NavbarCustom {...props} />
    </>
  );
}
