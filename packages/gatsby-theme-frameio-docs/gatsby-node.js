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
    title: "Welcome",
    pages: {
      title: "Test",
      sidebarTitle: "Test Title",
      description: "Description",
      path: "/path/to/my/content"
    }
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
    pages: section.node.map(item => {
      return {
        title: item.title,
        sidebarTitle: item.section.slug,
        description: "Not sure",
        path: buildPath(item.section.slug, item.slug)
      }
    })
  })
  )
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

    allContentfulSections {
      edges {
        node {
          title
          taxonomy
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
  const { edges: sections } = data.allContentfulSections;

  // Generate the sidebar contents by parsing the sections
  const sidebarContents = buildSideBar(sections);

  // Iterate over each guide we find and generate the right kind of page
  guides.forEach(edge => {
    const {
      id,
      slug,
      section
    } = edge.node;

    actions.createPage({
      path: buildPath(section.slug, slug),
      component: require.resolve('./src/template/guide'),
      context: {
        id,
        sidebarContents,
        baseUrl
      }
    });
  });
};
