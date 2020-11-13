import PropTypes from 'prop-types';
import React from 'react';
import { SEO } from 'gatsby-theme-apollo-core';
import { withPrefix } from 'gatsby';

export default function CustomSEO({ baseUrl, ...props }) {
  return (
    <SEO {...props} ></SEO>
  );
}

CustomSEO.propTypes = {
  baseUrl: PropTypes.string,
};
