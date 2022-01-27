import React from 'react';
import colors from './colors';
import { hashString } from './helpers';

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
    this.state = { selectionStart: 0, selectionEnd: 0, text: '' };
  }

  componentDidMount() {
    // Todo: make external
    this.selectionChangeHandler = (event) => {
      const target = event.target;

      if (
        target === this.inputNode
      ) {
        this.setState({
          selectionStart: this.inputNode.selectionStart,
          selectionEnd: this.inputNode.selectionEnd
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

  findEntities = (index) => {
    return this.props.entities.filter(e => e.start <= index && e.end > index);
  };

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

  addEntity = () => {
    const {onChange, text, entities} = this.props;
    const {selectionStart, selectionEnd, text: entityLabel} = this.state;

    onChange(text, entities.concat({ start: selectionStart, end: selectionEnd, label: entityLabel }));

    this.setState({text: '', selectionStart: 0, selectionEnd: 0});
  }

  deleteEntity = (entity) => {    
    // Remove the provided entity from the list
    const entities = this.props.entities.filter(({start, end, label}) => {
      return start === entity.start && end === entity.end && label === entity.label;
    });
    
    this.props.onChange(this.props.text, entities);
  }

  render() {
    const { text, entities = [] } = this.props;

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
        <div>
          <input
            type="text"
            placeholder="Entity label"
            value={this.state.text}
            onChange={(event) => this.setState({ text: event.target.value })}
            disabled={this.state.selectionStart === this.state.selectionEnd}
          />
          <button
            onClick={this.addEntity}
            disabled={this.state.selectionStart === this.state.selectionEnd}
          >Add entity for selection</button>
        </div>
        {this.state.selectionStart === this.state.selectionEnd && this.findEntities(this.state.selectionStart).length > 0 && (
          <div style={{ marginTop: 10 }}>
            {this.findEntities(this.state.selectionStart).map((e, i) => (
              <span key={i}>
                {this.props.text.substring(e.start, e.end)} ({e.label})
                <button
                  style={{ border: '0 none', cursor: 'pointer', backgroundColor: 'transparent' }}
                  onClick={() => this.deleteEntity(e)}
                >
                  <span role="img" aria-label="Delete">🗑️</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default EntityHighlighter;
