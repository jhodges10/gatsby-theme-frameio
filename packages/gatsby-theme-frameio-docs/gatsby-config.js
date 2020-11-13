const path = require('path');
const remarkTypescript = require('remark-typescript');
const {colors} = require('gatsby-theme-apollo-core/src/utils/colors');
const {HEADER_HEIGHT} = require('./src/utils');

module.exports = ({
  contentfulSpaceId,
  contenfulAccessToken,
  siteName,
  pageTitle,
  description,
  gaTrackingId,
  checkLinksOptions,
  gatsbyRemarkPlugins = [],
  // ignore,
  // remarkPlugins = []
}) => {
  const allGatsbyRemarkPlugins = [
    {
      resolve: 'gatsby-remark-autolink-headers',
      options: {
        offsetY: HEADER_HEIGHT
      }
    },
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    {
      resolve: 'gatsby-remark-mermaid',
      options: {
        mermaidOptions: {
          themeCSS: `
            .node rect,
            .node circle,
            .node polygon,
            .node path {
              stroke-width: 2px;
              stroke: ${colors.primary};
              fill: ${colors.background};
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              fill: white;
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon {
              stroke: ${colors.secondary};
            }
            .cluster rect,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              stroke: ${colors.tertiaryLight};
            }
            .cluster rect {
              fill: none;
              stroke-width: 2px;
            }
            .label, .edgeLabel {
              background-color: white;
              line-height: 1.3;
            }
            .edgeLabel rect {
              background: none;
              fill: none;
            }
            .messageText, .noteText, .loopText {
              font-size: 12px;
              stroke: none;
            }
            g rect, polygon.labelBox {
              stroke-width: 2px;
            }
            g rect.actor {
              stroke: ${colors.tertiary};
              fill: white;
            }
            g rect.note {
              stroke: ${colors.secondary};
              fill: white;
            }
            g line.loopLine, polygon.labelBox {
              stroke: ${colors.primary};
              fill: white;
            }
          `
        }
      }
    },
    'gatsby-remark-code-titles',
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        showLineNumbers: true
      }
    },
    'gatsby-remark-rewrite-relative-links',
    {
      resolve: 'gatsby-remark-check-links',
      options: checkLinksOptions
    },
    ...gatsbyRemarkPlugins
  ];

  const plugins = [
    'gatsby-theme-apollo-core',
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: contentfulSpaceId,
        accessToken: contenfulAccessToken,
        downloadLocal: true
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: allGatsbyRemarkPlugins
      }
    },
    // {
    //   resolve: 'gatsby-plugin-mdx',
    //   options: {
    //     gatsbyRemarkPlugins: allGatsbyRemarkPlugins,
    //     remarkPlugins: [
    //       [remarkTypescript, {wrapperComponent: 'MultiCodeBlock'}],
    //       ...remarkPlugins
    //     ]
    //   }
    // },
  ];

  if (gaTrackingId) {
    plugins.push({
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: gaTrackingId
      }
    });
  }

  return {
    siteMetadata: {
      title: pageTitle || siteName,
      siteName,
      description
    },
    plugins
  };
};
