import React from 'react';
import {
  useVersions,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import {useDocsPreferredVersion} from '@docusaurus/theme-common';
import {useDocsVersionCandidates} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function SidebarVersionSelector({
  docsPluginId,
  dropdownActiveClassDisabled = true,
  dropdownItemsBefore = [],
  dropdownItemsAfter = [],
  className = '',
  ...props
}) {
  const {search, hash} = useLocation();
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const {savePreferredVersionName} = useDocsPreferredVersion(docsPluginId);
  
  const versionLinks = versions.map((version) => {
    const versionDoc =
      activeDocContext?.alternateDocVersions[version.name] ??
      getVersionMainDoc(version);
    
    // Add "Version" prefix if not already present
    let label = version.label;
    if (!label.toLowerCase().includes('version')) {
      label = `Version ${label}`;
    }
    
    // Add "LATEST" badge for the current version
    const isLatest = version.name === 'current';
    if (isLatest) {
      label = (
        <span className="version-item-with-badge">
          <span>{label}</span>
          <span className="version-latest-badge">LATEST</span>
        </span>
      );
    }
    
    return {
      label: label,
      to: `${versionDoc.path}${search}${hash}`,
      isActive: () => version === activeDocContext?.activeVersion,
      onClick: () => savePreferredVersionName(version.name),
      className: isLatest ? 'version-item-latest' : 'version-item'
    };
  });

  const items = [
    ...dropdownItemsBefore,
    ...versionLinks,
    ...dropdownItemsAfter,
  ];

  const dropdownVersion = useDocsVersionCandidates(docsPluginId)[0];

  let dropdownLabel = dropdownVersion?.label || 'Version';
  // Add "Version" prefix to dropdown label if not already present
  if (dropdownLabel && !dropdownLabel.toLowerCase().includes('version')) {
    dropdownLabel = `Version ${dropdownLabel}`;
  }
  const dropdownTo = getVersionMainDoc(dropdownVersion)?.path;

  // If we only have 0 or 1 versions, render a simple button instead of dropdown
  if (items.length <= 1) {
    return (
      <div className={`sidebar-version-selector ${className}`}>
        <DefaultNavbarItem
          {...props}
          mobile={false}
          label={dropdownLabel}
          to={dropdownTo}
          isActive={dropdownActiveClassDisabled ? () => false : undefined}
          className="sidebar-version-button"
        />
      </div>
    );
  }

  return (
    <div className={`sidebar-version-selector ${className}`}>
      <DropdownNavbarItem
        {...props}
        mobile={false}
        label={dropdownLabel}
        to={dropdownTo}
        items={items}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
        className="sidebar-version-dropdown"
      />
    </div>
  );
}