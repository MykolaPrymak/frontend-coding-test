export function hashString(str) {
    if (str.length === 0) {
        return 0;
    }

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }

    return hash > 0 ? hash : -hash;
}

export function findEntities(entities, position) {
    return entities.filter(e => e.start <= position && e.end > position);
}

export function findEntity(entities, start, end) {
    if (start === end) {
        return null;
    }

    return entities.find(entity => entity.start === start && entity.end === end) || null;
}

export function removeEntity(entities, entity) {
    return entities.filter(({ start, end, label }) => {
        return !(start === entity.start && end === entity.end && label === entity.label);
    });
};

function findClosestStart(text, oldSelection, oldEntity, lastMatch) {
    if (lastMatch === undefined) {
        const index = text.indexOf(oldSelection);
        if (index === -1) {
            return index;
        }
        return findClosestStart(text, oldSelection, oldEntity, index);
    }

    const from = lastMatch + oldSelection.length;
    const index = text.indexOf(oldSelection, from);
    if (index === -1) {
        return lastMatch;
    }

    const prevDiff = Math.abs(oldEntity.start - lastMatch);
    const nextDiff = Math.abs(oldEntity.start - index);
    if (prevDiff < nextDiff) {
        return lastMatch;
    }

    return findClosestStart(text, oldSelection, oldEntity, index);
}

export function updateEntitiesBoudaries(newText, oldText, entities) {
    // update the entity boudaries
    return entities.map(entity => {
        const oldSelection = oldText.substr(entity.start, entity.end - entity.start);
        const start = findClosestStart(newText, oldSelection, entity);

        if (start === -1) {
            return null;
        }

        return ({
            ...entity,
            start,
            end: start + oldSelection.length,
        });
    }).filter(entity => entity !== null);
}