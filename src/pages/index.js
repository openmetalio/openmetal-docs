import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import data from '../data/index-data';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Link } from 'react-router-dom';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
		<div className="custom-hero">
			<div className="container">
				<h1>Documentation</h1>
				<h3>Browse the latest guides and tutorials.</h3>
			</div>
		</div>
      </div>
    </header>
  );
}

function getCatagory( cat ) {
	const documentationObject = data.documentationIndex;
	console.log( data );
	return documentationObject.filter( item => item.catagories.includes( cat ) );
}

function CategoryArticles( { category } ) {
	return (
		<div>
			{getCatagory(category).map((documentation, index) => (
				<div className="documentation-item" key={index}>
					<span className="material-icons">chevron_right</span>
					<div>
						{ ( documentation.pdfPath !== '' && documentation.htmlPath === '' ) &&
								<a className="title link"  target={(documentation.pdfPath !== '' && documentation.htmlPath === '') ? '_blank' : ''} href={documentation.htmlPath || documentation.pdfPath}>{documentation.title}</a>
						 }
						{ ( documentation.htmlPath !== '' ) &&
							<Link className="title link" to={documentation.htmlPath}>{documentation.title}</Link>
						 }
						{ ! ( documentation.htmlPath || documentation.pdfPath ) &&
						<div className="title">
							{documentation.title}
						</div> }
						{ documentation.pdfPath && documentation.htmlPath  === '' &&
							<span> (PDF)</span>
						}
						{ documentation.pdfPath && documentation.htmlPath &&
							<a target="_blank" href={ documentation.pdfPath }> (PDF)</a>
						}
						<div>
							{documentation.description}
							{ documentation.comingSoon &&
								<span className="soon"> Coming Soon</span>
							}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function Categories() {
	return (
		<section className="custom-index-page catagories">
			<div>
				<div className="cat-hero admin">
					<h3>Cloud Administrators</h3>
				</div>
				<div className="desc">
					Learn how to integrate Flex Metal into an existing infrastructure or create a new one.
				</div>
				<div>
				<CategoryArticles category="admin" />
				</div>
			</div>
			<div>
				<div className="cat-hero users">
					<h3>Cloud Users</h3>
				</div>
				<div className="desc">
					Guides and tutorials to help users on getting started with Flex Metal and Openstack management.
				</div>
				<div>
				<CategoryArticles category="users" />
				</div>
			</div>
			<div>
				<div className="cat-hero management">
					<h3>General Management</h3>
				</div>
				<div className="desc">
					Resources that can show how Flex Metal can improve your scalability at reduced costs of public clouds.
				</div>
				<div>
					<CategoryArticles category="management" />
				</div>
			</div>
		</section>
	);
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Open Metal documentation">
      <HomepageHeader />
      <main>
		<Categories />
      </main>
    </Layout>
  );
}
