import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const CursorSpan = styled.span`
  font-weight: 100;
  color: white;
  font-size: 1em;
  padding-left: 2px;
`;


const Cursor = ({ className }) => (
  <CursorSpan className={className}>|</CursorSpan>
);

Cursor.propTypes = { className: PropTypes.string };
Cursor.defaultProps = { className: '' };

export default Cursor;
