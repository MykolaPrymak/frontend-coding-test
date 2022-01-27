import React from 'react';
import HighlightEntity from './HighlightEntity';

const EntityActionList = ({
    text = '',
    entities = [],
}) => {
    return entities.map((entity, index) => <HighlightEntity key={index} text={text} entity={entity} />);
};

export default EntityActionList;
