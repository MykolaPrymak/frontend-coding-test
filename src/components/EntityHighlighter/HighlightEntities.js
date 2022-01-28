import React from 'react';
import HighlightEntity from './HighlightEntity';

const EntityActionList = ({
    text = '',
    entities = [],
    selectionStart,
    selectionEnd
}) => {
    let entitiesToRender = entities;
    // If we have new selection - show it 
    if (selectionStart !== selectionEnd) {
        entitiesToRender = entities.concat({start: selectionStart, end: selectionEnd, label: 'new'});
    }

    return entitiesToRender.map((entity, index) => <HighlightEntity key={index} text={text} entity={entity} />);
};

export default EntityActionList;
