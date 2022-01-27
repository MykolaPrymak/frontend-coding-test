import React from 'react';
import colors from './colors';
import { hashString } from './helpers';

const styles = {
  highlightText: {
    color: 'transparent',
    pointerEvents: 'none',
    padding: '0',
    whiteSpace: 'pre-wrap',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
  },
  zeroPos: {
    textAlign: 'left',
    position: 'absolute',
    top: 4,
    left: 2,
  },
};

const HighlightEntity = ({
  text = '',
  entity = null,
}) => {
  const start = text.substr(0, entity.start);
  const end = text.substr(entity.end);
  const value = text.substr(entity.start, entity.end - entity.start);
  const color = colors[hashString(entity.label) % colors.length].bg;

  return (
    <div style={{ ...styles.zeroPos, ...styles.highlightText }}>
      <span>{start}</span>
      <span style={{ opacity: 0.3, backgroundColor: color }}>{value}</span>
      <span>{end}</span>
    </div>
  );

};

export default HighlightEntity;
