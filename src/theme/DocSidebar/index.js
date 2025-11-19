import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import SidebarVersionSelector from '../../components/SidebarVersionSelector';
import { useActivePlugin } from '@docusaurus/plugin-content-docs/client';

export default function DocSidebarWrapper(props) {
  // Get the active plugin to determine the current docs instance
  const activePlugin = useActivePlugin();
  const docsPluginId = activePlugin?.pluginId;
  
  return (
    <>
      {/* Only render version selector if we have an active plugin */}
      {activePlugin && (
        <div className="sidebar-version-container">
          <SidebarVersionSelector docsPluginId={docsPluginId} />
        </div>
      )}
      <DocSidebar {...props} />
    </>
  );
}
