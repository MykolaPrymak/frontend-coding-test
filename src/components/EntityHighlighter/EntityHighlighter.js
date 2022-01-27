import React from 'react';
import EntityListRenderer from './EntityListRenderer';
import NewEntityForm from './NewEntityForm';
import colors from './colors';
import { hashString, findEntity, removeEntity } from './helpers';

const styles = {
  text: {},
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

  componentDidMount() {
    // TODO: make external
    this.selectionChangeHandler = (event) => {
      const target = event.target;

      if (
        target === this.inputNode
      ) {
        const { selectionStart, selectionEnd }= this.inputNode;

        this.setState({
          selectionStart: selectionStart,
          selectionEnd: selectionEnd,
          selectedEntity: findEntity(this.props.entities, selectionStart, selectionEnd)
        });
      }
    };

    document.addEventListener('select', this.selectionChangeHandler, false);
    document.addEventListener('click', this.selectionChangeHandler, false);
    document.addEventListener('keydown', this.selectionChangeHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('select', this.selectionChangeHandler);
    document.removeEventListener('click', this.selectionChangeHandler);
    document.removeEventListener('keydown', this.selectionChangeHandler);
  }

  handleTextChange(event) {
    const { text: oldText, entities: oldEntities, onChange } = this.props;
    const text = event.target.value;
    const entities = [];

    // update the entity boudaries

    oldEntities.forEach(oldEntity => {
      const oldSelection = oldText.substr(oldEntity.start, oldEntity.end - oldEntity.start);

      function findClosestStart(lastMatch) {
        if (lastMatch == null) {
          const index = text.indexOf(oldSelection);
          if (index === -1) {
            return index;
          }
          return findClosestStart(index);
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
        return findClosestStart(index);
      }
      const start = findClosestStart();
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

  renderEntityHighlight = (text, entity, key) => {
    const start = text.substr(0, entity.start);
    const end = text.substr(entity.end);
    const value = text.substr(entity.start, entity.end - entity.start);
    const color = colors[hashString(entity.label) % colors.length].bg;

    return (
      <div key={key} style={{ ...styles.zeroPos, ...styles.highlightText }}>
        <span>{start}</span>
        <span style={{ opacity: 0.3, backgroundColor: color }}>{value}</span>
        <span>{end}</span>
      </div>
    );
  };

  addEntity = (entityLabel, oldEntity) => {
    const {onChange, text } = this.props;
    let entities = this.props.entities;
    const { selectionStart, selectionEnd } = this.state;

    // Remove old one if any
    if (oldEntity) {
      entities = removeEntity(entities, oldEntity);
    }

    onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityLabel }));

    this.setState({selectionStart: 0, selectionEnd: 0, selectedEntity: null});
  }

  deleteEntity = (entity) => {    
    this.props.onChange(this.props.text, removeEntity(this.props.entities, entity));
  }

  render() {
    const { text, entities = [] } = this.props;
    const {selectionStart, selectionEnd, selectedEntity} = this.state;
    const isSelectionEmpty = selectionStart === selectionEnd;

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <textarea
            style={styles.input}
            ref={node => {
              if (node) {
                this.inputNode = node;
              }
            }}
            onChange={event => this.handleTextChange(event)}
            value={text}
            rows={10}
          />

          {entities.map((entity, index) => this.renderEntityHighlight(text, entity, index))}
        </div>
        <br />
          <NewEntityForm
            isDisabled={isSelectionEmpty}
            entity={selectedEntity}
            onSubmit={this.addEntity}
          />

          <EntityListRenderer
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
