import React from 'react';
import Content from '@theme-original/DocItem/Content';
import { DiscussionEmbed } from 'disqus-react';
import { useDoc } from '@docusaurus/theme-common/internal';

export default function ContentWrapper(props) {
	const { metadata } = useDoc();
	const { frontMatter, slug, title } = metadata;
	const { comments = true } = frontMatter;

	return (
		<>
			<Content {...props} />
			{comments && (
				<DiscussionEmbed
					style={{ marginTop: '2rem' }}
					shortname="openmetal"
					config={{
						identifier: slug,
						title,
					}}
				/>
			)}
		</>
	);
}
