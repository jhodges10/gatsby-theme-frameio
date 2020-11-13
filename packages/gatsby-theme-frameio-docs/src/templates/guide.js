import PropTypes from 'prop-types';
import React, { Fragment, createContext, useContext } from 'react';
import rehypeReact from 'rehype-react';
import styled from '@emotion/styled';
import { ContentWrapper } from 'gatsby-theme-apollo-core';
import { graphql, navigate } from 'gatsby';
import CodeBlock from '../components/code-block';
import CustomSEO from '../components/custom-seo';
import Footer from '../components/footer';
import PageContent from '../components/page-content';
import PageHeader from '../components/page-header';
import CustomTable from '../components/Template/index';

const StyledContentWrapper = styled(ContentWrapper)({
  paddingBottom: 0
});

const CustomLinkContext = createContext();

function CustomLink(props) {
  const { pathPrefix, baseUrl } = useContext(CustomLinkContext);

  const linkProps = { ...props };
  if (props.href) {
    if (props.href.startsWith('/')) {
      linkProps.onClick = function handleClick(event) {
        const href = event.target.getAttribute('href');
        if (href.startsWith('/')) {
          event.preventDefault();
          navigate(href.replace(pathPrefix, ''));
        }
      };
    } else if (!props.href.startsWith('#') && !props.href.startsWith(baseUrl)) {
      linkProps.target = '_blank';
      linkProps.rel = 'noopener noreferrer';
    }
  }

  return <a {...linkProps} />;
}

CustomLink.propTypes = {
  href: PropTypes.string
};

function createCustomHeading(tag) {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ children, ...props }) =>
    React.createElement(
      tag,
      props,
      // eslint-disable-next-line react/prop-types
      <a className="headingLink" href={'#' + props.id}>
        {Array.isArray(children)
          ? // eslint-disable-next-line react/prop-types
          children.filter(
            child => child.type !== CustomLink && child.props?.mdxType !== 'a'
          )
          : children}
      </a>
    );
}

const components = {
  pre: CodeBlock,
  a: CustomLink,
  table: CustomTable,
  h1: createCustomHeading('h1'),
  h2: createCustomHeading('h2'),
  h3: createCustomHeading('h3'),
  h4: createCustomHeading('h4'),
  h5: createCustomHeading('h5'),
  h6: createCustomHeading('h6')
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components
}).Compiler;

export default function Template(props) {
  // Get current browser location using Gatsby prop
  const { hash, pathname } = props.location;

  // Grab Guide context
  const { contentfulGuide, site } = props.data;
  const { markdownContent } = contentfulGuide.body.childMarkdownRemark;
  const { title, description } = site.siteMetadata;
  const {
    sidebarContents,
    githubUrl,
    baseUrl,
  } = props.pageContext;

  const pages = sidebarContents
    .reduce((acc, { pages }) => acc.concat(pages), [])
    .filter(page => !page.anchor);

  return (
    <Fragment>
      <CustomSEO
        // Title comes from the Guide
        title={contentfulGuide.title}
        // Our description is an excerpt from markdown for now
        description={markdownContent.excerpt || description}
        siteName={title}
        baseUrl={baseUrl}
      />
      <StyledContentWrapper>
        <PageHeader title={contentfulGuide.title} description={markdownContent.excerpt} />
        <hr />
        <PageContent
          title={contentfulGuide.title}
          apiReference={false}
          pathname={pathname}
          pages={pages}
          headings={headings.filter(
            heading =>
              heading.depth === 2
          )}
          hash={hash}
        >
          <CustomLinkContext.Provider
            value={{
              pathPrefix: site.pathPrefix,
              baseUrl
            }}
          >{
              renderAst(markdownContent.htmlAst)
            }
          </CustomLinkContext.Provider>
        </PageContent>
        <Footer />
      </StyledContentWrapper>
    </Fragment>
  );
}

Template.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query PageQuery($id: String) {
    site {
      pathPrefix
      siteMetadata {
        title
        description
      }
    }

    contentfulGuide(id: {eq: $id}) {
      body {
        childMarkdownRemark {
          rawMarkdownBody
          excerpt(format: PLAIN, pruneLength: 100)
          id
          headings{
            value
          }
          wordCount {
            words
          }
          timeToRead
          htmlAst
        }
      }
      author {
        name
      }
      createdAt
      updatedAt
      title
      section {
        title
      }
    }
  }
`;
