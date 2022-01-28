import React, { useRef, useEffect } from 'react';

const ENTER_KEY_CODE = 13;

const NewEntityForm = ({
    isDisabled = false,
    entity = null,
    onSubmit = () => { }
}) => {
    const textInput = useRef(null);

    useEffect(() => {
        textInput.current.value = entity ? entity.label : '';
    }, [entity])

    const handleClick = () => {
        if (textInput.current.value) {
            // Add new entity
            onSubmit(textInput.current.value, entity);
            // Clear input value
            textInput.current.value = '';
        } else {
            textInput.current.focus();
        }
    };

    // Submit on Enter
    const handleKeyPress = (evt) => {
        if (evt.keyCode === ENTER_KEY_CODE) {
            handleClick(evt);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Entity label"
                ref={textInput}
                onKeyDown={handleKeyPress}
                
                onKeyPress={handleKeyPress}
                disabled={isDisabled} />
            <button
                onClick={handleClick}
                disabled={isDisabled}
            >{entity ? 'Update' : 'Add'} entity for selection</button>
        </div>
    );
};

export default NewEntityForm;
