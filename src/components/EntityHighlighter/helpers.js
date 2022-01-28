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

export function updateEntitiesBoudaries(newText = '', oldText = '', entities) {
    // Create map for all entity texts to avoid diffs calculations
    const occurence_map = new Map();

    return entities.map(entity => {
        const entity_text = oldText.substring(entity.start, entity.end);

        // Skip if we already process this text
        if (occurence_map.has(entity_text)) {
            return { entity, occurencies: occurence_map.get(entity_text) };
        }

        // Collect all entity occurence
        const occurencies = [];
        // Find the first one
        let occurence_idx = newText.indexOf(entity_text);
        // If we have at least one - continue to search
        if (occurence_idx !== -1) {
            occurencies.push(occurence_idx);

            // Collect other occurencies
            while (occurence_idx !== -1) {
                occurence_idx = newText.indexOf(entity_text, occurence_idx + 1);
                if (occurence_idx !== -1) {
                    occurencies.push(occurence_idx);
                }
            }
        }
        // Save information for avoid duplication search
        occurence_map.set(entity_text, occurencies);

        // Return entity with all occurencies
        return { entity, occurencies };
    }).map(({ entity, occurencies }) => {
        // TODO: If changed text is too small (1 char) and diff is big (> text length change) and there's no more of that text occurencies - remove entity

        // No occurencies - check if change occur inside this entity
        if (occurencies.length === 0) {
            const prefix_text = oldText.substring(0, entity.start);
            const suffix_text = oldText.substring(entity.end);

            // We have the same text before (if there's one) the entity and after it (if there's one) in new text
            // And there's some text between tehem
            const preffix_text_position = newText.indexOf(prefix_text);
            const suffix_text_position = newText.indexOf(suffix_text);

            if (
                (prefix_text === '' || preffix_text_position === 0) &&
                (suffix_text === '' || suffix_text_position > prefix_text.length)
            ) {
                return ({
                    ...entity,
                    start: preffix_text_position + prefix_text.length,
                    end: suffix_text === '' ? newText.length : suffix_text_position
                });
            } else {
                return null;
            }
        }

        // One occurence - move to a new position
        if (occurencies.length === 1) {
            const start = occurencies[0];

            return ({
                ...entity,
                start,
                end: start + entity.end - entity.start
            });
        }

        // Multiple occuriencies - find the closes one
        const entity_start = entity.start;
        const { start } = occurencies // Get the closes position
            .map(start => ({ start, diff: Math.abs(start - entity_start) })) // Get the diff value for each occurency
            .sort(({ diff: diff_a }, { diff: diff_b }) => diff_b - diff_a) // Sort descending
            .pop(); // Get the last element - index with minimal diff


        return ({
            ...entity,
            start,
            end: start + entity.end - entity.start
        });
    }).filter(entity => entity !== null); // Remove missing entities
}