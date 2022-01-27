import React from 'react';
import HighlightEntities from './HighlightEntities';
import EntityActionList from './EntityActionList';
import NewEntityForm from './NewEntityForm';
import { findEntity, removeEntity, findClosestStart } from './helpers';

const styles = {
  input: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
    background: 'none',
    border: '1px solid',
    width: '100%',
    resize: 'none',
  },
};

class EntityHighlighter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectionStart: 0, selectionEnd: 0, selectedEntity: null };
  }

  handleTextChange(event) {
    const { text: oldText, entities: oldEntities, onChange } = this.props;
    const text = event.target.value;
    const entities = [];

    // update the entity boudaries

    oldEntities.forEach(oldEntity => {
      const oldSelection = oldText.substr(oldEntity.start, oldEntity.end - oldEntity.start);  
      const start = findClosestStart(text, oldSelection, oldEntity);
  
      if (start === -1) {
        return;
      }

      entities.push({
        ...oldEntity,
        start,
        end: start + oldSelection.length,
      });
    });

    onChange(text, entities);
  }

  addEntity = (entityLabel, oldEntity) => {
    const { onChange, text } = this.props;
    let entities = this.props.entities;
    const { selectionStart, selectionEnd } = this.state;

    // Remove old one if any
    if (oldEntity) {
      entities = removeEntity(entities, oldEntity);
    }

    onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityLabel }));

    this.setState({ selectionStart: 0, selectionEnd: 0, selectedEntity: null });
  }

  deleteEntity = (entity) => {
    this.props.onChange(this.props.text, removeEntity(this.props.entities, entity));
  }

  selectionChangeHandler = (event) => {
    const { selectionStart, selectionEnd } = event.target;

    this.setState({
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      selectedEntity: findEntity(this.props.entities, selectionStart, selectionEnd)
    });
  };

  render() {
    const { text, entities = [] } = this.props;
    const { selectionStart, selectionEnd, selectedEntity } = this.state;
    const isSelectionEmpty = selectionStart === selectionEnd;

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <textarea
            style={styles.input}
            onSelect={this.selectionChangeHandler}
            onClick={this.selectionChangeHandler}
            onKeyDown={this.selectionChangeHandler}
            onChange={event => this.handleTextChange(event)}
            value={text}
            rows={10}
          />

          <HighlightEntities
            text={text}
            entities={entities}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
          />
        </div>
        <br />
        <NewEntityForm
          isDisabled={isSelectionEmpty}
          entity={selectedEntity}
          onSubmit={this.addEntity}
        />

        <EntityActionList
          isVisible={!isSelectionEmpty}
          text={text}
          entities={entities}
          startIdx={selectionStart}
          onDelete={this.deleteEntity}
        />
      </div>
    );
  }
}

export default EntityHighlighter;
