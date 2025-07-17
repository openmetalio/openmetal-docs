/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import IconExternalLink from '@theme/Icon/ExternalLink';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function FooterLink({to, href, label, prependBaseUrlToHref, ...props}) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
            target: '_self'
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {href && !isInternalUrl(href) ? (
        <span>
          {label}
        </span>
      ) : (
        label
      )}
    </Link>
  );
}

function FooterLogo({sources, alt, width, height}) {
  return (
    <ThemedImage
      className="footer__logo"
      alt={alt}
      sources={sources}
      width={width}
      height={height}
    />
  );
}

function ColumnLinks({linkItem}) {
  return (
    <ul className="footer__items">
      {linkItem.items.map((item, key) =>
        item.html ? (
          <li
            key={key}
            className="footer__item" // Developer provided the HTML, so assume it's safe.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: item.html,
            }}
          />
        ) : (
          <li key={item.href || item.to} className="footer__item">
            <FooterLink {...item} />
          </li>
        ),
      )}
    </ul>
  );
}

function MultiColumnLinks({links}) {
  return (
    <>
      {links.map((linkItem, i) => (
        <div key={i} className="col footer__col">
          {
            linkItem.title && (
              <div className="footer__title">{linkItem.title}</div>
            )
          }
          {
            linkItem.type === 'section' && linkItem.items ? 
              linkItem.items.map((subLinkItem, i) => (
                <div className='footerSection' key={i}>
                  <div className='footer__title'>{subLinkItem.title}</div>
                  <ColumnLinks linkItem={subLinkItem} />
                </div>
              )) :
            (
              <ColumnLinks linkItem={linkItem} />
            )
          }
        </div>
      ))}
    </>
  );
}

function SimpleLinks({links}) {
  return (
    <div className="footer__links">
      {links.map((item, key) => (
        <>
          {item.html ? (
            <span
              key={key}
              className="footer__link-item" // Developer provided the HTML, so assume it's safe.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: item.html,
              }}
            />
          ) : (
            <FooterLink {...item} />
          )}
          {links.length !== key + 1 && (
            <span className="footer__link-separator">·</span>
          )}
        </>
      ))}
    </div>
  );
}

function isMultiColumnFooterLinks(links) {
  return 'title' in links[0];
}

function FooterCustom() {
  const {footer} = useDocusaurusContext().siteConfig.customFields;
  const {copyright, links = [], logo = {}} = footer || {};
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };

  if (!footer) {
    return null;
  }

  return (
    <footer
      className={clsx('omi-footer footer', {
        'footer--dark': footer.style === 'dark',
      })}>
      <div className="container container-fluid">
        {links &&
          links.length > 0 &&
          (isMultiColumnFooterLinks(links) ? (
            <div className="row footer__links">
              <MultiColumnLinks links={links} />
            </div>
          ) : (
            <div className="footer__links text--center">
              <SimpleLinks links={links} />
            </div>
          ))}
        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            {logo && (logo.src || logo.srcDark) && (
              <div className="margin-bottom--sm">
                {logo.href ? (
                  <Link href={logo.href} className={styles.footerLogoLink}>
                    <FooterLogo
                      alt={logo.alt}
                      sources={sources}
                      width={logo.width}
                      height={logo.height}
                    />
                  </Link>
                ) : (
                  <FooterLogo alt={logo.alt} sources={sources} width={logo.width}/>
                )}
              </div>
            )}
            {copyright ? (
              <div
                className="footer__copyright" // Developer provided the HTML, so assume it's safe.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: copyright,
                }}
              />
            ) : null}
          </div>
        )}
        <div className={styles.footerContact}>
          <p>2 Constitution Drive, Suite 101, Virginia Beach, VA 23462</p>
          <div className={styles.contactLinks}>
            <a href="tel:+18777289664">877-7-BUY-OMI</a>
            <a href="mailto:sales@openmetal.io">sales@openmetal.io</a>
            <a href="https://openmetal.io/schedule-meeting/">Schedule a Demo</a>
          </div>
          <p>
            <strong>OpenMetal Central:</strong> <a target="_blank" href='https://central.openmetal.io/auth/sign-in'>Login</a> or <a target="_blank" href='https://central.openmetal.io/sign-up'>Create New Account</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(FooterCustom);
