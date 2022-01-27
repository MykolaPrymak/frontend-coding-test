import React, { useRef } from 'react';

const ENTER_KEY_CODE = 13;

const NewEntityForm = ({
    isDisabled = false,
    onSubmit = () => { }
}) => {
    const textInput = useRef(null);

    const handleClick = () => {
        // Add new entity
        onSubmit(textInput.current.value);
        // Clear input value
        textInput.current.value = '';
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
            >Add entity for selection</button>
        </div>
    );
};

export default NewEntityForm;
