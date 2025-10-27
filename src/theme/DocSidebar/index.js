import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import SidebarVersionSelector from '../../components/SidebarVersionSelector';

export default function DocSidebarWrapper(props) {
  return (
    <>
      <div className="sidebar-version-container">
        <SidebarVersionSelector />
      </div>
      <DocSidebar {...props} />
    </>
  );
}
