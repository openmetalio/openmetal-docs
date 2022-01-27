import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import data from './index-data';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
		<div className="custom-hero">
			<div className="container">
				<h1>Open Metal Documentation</h1>
				<h3>Browse the latest guides and tutorials.</h3>
			</div>
		</div>
      </div>
    </header>
  );
}

function getCatagory( cat ) {
	return this.documentationObject.filter( item => item.catagories.includes( cat ) );
}

function CategoryArticles() {
	return (
		<div/>
	);
}

function Categories() {
	return (
		<section class="custom-index-page catagories">
			<div>
				<div class="cat-hero admin">
					<h3>Cloud Administrators</h3>
				</div>
				<div class="desc">
					Learn how to integrate Flex Metal into an existing infrastructure or create a new one.
				</div>
				<div>
				<CategoryArticles />
				</div>
			</div>
			<div>
				<div class="cat-hero users">
					<h3>Cloud Users</h3>
				</div>
				<div class="desc">
					Guides and tutorials to help users on getting started with Flex Metal and Openstack management.
				</div>
				<div>
				<CategoryArticles />
				</div>
			</div>
			<div>
				<div class="cat-hero management">
					<h3>General Management</h3>
				</div>
				<div class="desc">
					Resources that can show how Flex Metal can improve your scalability at reduced costs of public clouds.
				</div>
				<div>
					<CategoryArticles />
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
