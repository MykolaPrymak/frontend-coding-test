import React from 'react';
import { findEntities } from './helpers';

const styles = {
    listContainer: { marginTop: 10 },
    listItem: {
        border: '0 none',
        cursor: 'pointer',
        backgroundColor: 'transparent'
    },
};

const EntityListRenderer = ({
    isVisible = false,
    text = '',
    entities = [],
    startIdx = 0,
    onDelete = () => { }
}) => {
    if (isVisible || entities.length === 0) {
        return null;
    }

    const foundEntities = findEntities(entities, startIdx);

    if (foundEntities.length === 0) {
        return null;
    }

    return (
        <div style={styles.listContainer}>
            {foundEntities.map((entity, idx) => (
                <span key={`${idx}_${entity.label}`}>
                    {text.substring(entity.start, entity.end)} ({entity.label})

                    <button style={styles.listItem} onClick={() => onDelete(entity)}>
                        <span role="img" aria-label="Delete">🗑️</span>
                    </button>
                </span>
            ))}
        </div>
    )
};

export default EntityListRenderer;
