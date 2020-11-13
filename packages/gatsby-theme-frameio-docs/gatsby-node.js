async function onCreateNode(
  { node, actions },
) {
  actions.createNodeField({
    node,
    name: 'apiReference',
    value: false
  });
};

exports.onCreateNode = onCreateNode;

// This is the target shape we're going for with the sidebar
const mockSideBarContent = [
  {
    title: "Section Title",
    pages: [
      {
        title: "Page Title",
        sidebarTitle: "Not sure what this part is?",
        description: "This is a description field!",
        path: "/welcome/getting-started"
      }
    ]
  }
];

// Build the full path for this resource by combining the Section + Guide slug
function buildPath(sectionSlug, guideSlug) {
  return `${sectionSlug}/${guideSlug}`
}

// This is the function that builds the sidebar into that shape ^
function buildSideBar(sections) {
  return sections.map(section => ({
    title: section.node.title,
    pages: section.node.guide != null && (section.node.guide.length > 1) && section.node.guide.map(item => {
      // If there aren't any pages in this section, then don't return anything
      if (!item.title) {
        return null;
      }

      return {
        title: item.title,
        sidebarTitle: section.node.slug,
        description: "Not sure",
        path: buildPath(section.node.slug, item.slug)
      }
    })
      .filter(Boolean)
  }))
};


exports.createPages = async (
  { actions, graphql },
  {
    baseUrl
  }
) => {
  const { data } = await graphql(`
  {
    allContentfulGuide {
      edges {
        node {
          id
          slug
          author {
            name
          }
          section {
            ... on ContentfulSection {
              slug
            }
          }
          body {
            childMarkdownRemark {
              rawMarkdownBody
              html
              timeToRead
              wordCount {
                words
              }
            }
          }
        }
      }
    }

    allContentfulSection {
      edges {
        node {
          title
          taxonomy
          slug
          guide {
            title
            slug
          }
        }
      }
    }
  }
`);

  // Pull out guides
  const { edges: guides } = data.allContentfulGuide;

  // Pull out sections
  const { edges: sections } = data.allContentfulSection;

  // Generate the sidebar contents by parsing the sections
  const sidebarContents = buildSideBar(sections);

  const guideTemplate = require.resolve('./src/templates/guide')

  // Iterate over each guide we find and generate the right kind of page
  guides.forEach(edge => {
    const {
      id,
      slug,
      section
    } = edge.node;

    actions.createPage({
      path: buildPath(section.slug, slug),
      component: guideTemplate,
      context: {
        id,
        sidebarContents,
        baseUrl
      }
    });
  });
};
