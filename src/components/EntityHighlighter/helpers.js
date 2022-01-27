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