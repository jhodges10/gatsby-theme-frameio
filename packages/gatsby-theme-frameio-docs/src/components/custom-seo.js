import PropTypes from 'prop-types';
import React from 'react';
import { SEO } from 'gatsby-theme-apollo-core';
import { withPrefix } from 'gatsby';

export default function CustomSEO({ image, baseUrl, twitterHandle, ...props }) {
  const imagePath = withPrefix('/' + image);
  return (
    <SEO {...props} ></SEO>
  );
}

CustomSEO.propTypes = {
  baseUrl: PropTypes.string,
  image: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string
};
