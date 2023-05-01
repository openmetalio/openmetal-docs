import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import styles from './NavbarIcon.css';


export default function NavbarIcon({iconData}) {
  const { icontype, iconstyle, icon } = iconData;
  let iconEle;
  if(icontype === 'external') {
    iconEle = getExternalIcon(icon, iconstyle);
  } else if(icontype === 'fontAwesome') {
    iconEle = getFontAwesomeIcon(icon);
  }

  return (
    <div className='icon'>
      {iconEle}
    </div>
  );
}

function getExternalIcon(icon, iconstyle) {
    return (
        <img src={icon} className={iconstyle ? iconstyle : 'solid'}/>
    );
}

function getFontAwesomeIcon(iconName) {
    const faIcon = iconName ? solidIcons[iconName] : null;
    return (
        <FontAwesomeIcon className="faIcon" icon={faIcon}/>
    );
}