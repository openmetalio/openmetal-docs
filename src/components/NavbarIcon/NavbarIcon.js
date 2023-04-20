import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import styles from './NavbarIcon.css';


export default function NavbarIcon({iconData}) {
  const { iconType, iconStyle, icon } = iconData;
  let iconEle;
  if(iconType === 'external') {
    iconEle = getExternalIcon(icon, iconStyle);
  } else if(iconType === 'fontAwesome') {
    iconEle = getFontAwesomeIcon(icon);
  }

  return (
    <div className='icon'>
      {iconEle}
    </div>
  );
}

function getExternalIcon(icon, iconStyle) {
    return (
        <img src={icon} className={iconStyle ? iconStyle : 'solid'}/>
    );
}

function getFontAwesomeIcon(iconName) {
    const faIcon = iconName ? solidIcons[iconName] : null;
    return (
        <FontAwesomeIcon className="faIcon" icon={faIcon}/>
    );
}