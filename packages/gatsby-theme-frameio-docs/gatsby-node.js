// If we wanted to add additional info to our GraphQL nodes during creation, this is where we would do it!
// I'm leaving behind the example so that we have a reference.

// async function onCreateNode(
//   { node, actions },
// ) {
//   actions.createNodeField({
//     node,
//     name: 'apiReference',
//     value: false
//   });
// };

// exports.onCreateNode = onCreateNode;

// Build the full path for this resource by combining the Section + Guide slug
function buildPath(sectionSlug, guideSlug) {
  return `${sectionSlug}/${guideSlug}`
}

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

  // Load the template in that we're feeding to actions.createPage()
  const guideTemplate = require.resolve('./src/templates/guide')

  // The createPage function is powered by a combination of the data we pass it here \
  //  and then the data that it gets with the pageQuery that runs during each pages creation step

  // Iterate over each guide we find and generate the right kind of page
  guides.forEach(edge => {
    const {
      id,
      slug,
      section
    } = edge.node;

    actions.createPage({
      // This path is going to end up being the same one that we've created for the sidebar
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
