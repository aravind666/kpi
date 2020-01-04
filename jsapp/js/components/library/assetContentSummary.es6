import React from 'react';
import autoBind from 'react-autobind';
import {bem} from 'js/bem';
import {getFlatQuestionsList} from 'js/assetUtils';
import {QUESTION_TYPES} from 'js/constants';
import {t} from 'js/utils';

const DISPLAY_LIMIT = 8;

class AssetContentSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isExpanded: false,
      isExpandable: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.setState({
      isExpandable: this.props.asset.content.survey.length > DISPLAY_LIMIT
    });
  }

  renderQuestion(question, itemIndex) {
    const typeDef = QUESTION_TYPES.get(question.type);
    const modifiers = ['columns', 'padding-small'];
    if (itemIndex !== 0) {
      modifiers.push('bordertop');
    }
    return (
      <bem.FormView__cell m={modifiers} key={itemIndex}>
        <bem.FormView__cell m='column-icon'>
          {/* fix icon for date time */}
          <i className={['fa', 'fa-lg', typeDef.faIcon].join(' ')}/>
        </bem.FormView__cell>

        <bem.FormView__cell m={['column-1', 'asset-content-summary-name']}>
          {question.parents.length > 0 &&
            <small>{question.parents.join(' / ') + ' /'}</small>
          }

          <div>
            {question.isRequired && <strong>*&nbsp;</strong>}
            {question.label}
          </div>
        </bem.FormView__cell>
      </bem.FormView__cell>
    );
  }

  filterRealQuestions(questions) {
    return questions.filter((question) => {
      return QUESTION_TYPES.has(question.type);
    });
  }

  toggleExpanded() {
    this.setState({isExpanded: !this.state.isExpanded});
  }

  render() {
    if (!this.props.asset) {
      return null;
    }

    let items = getFlatQuestionsList(this.props.asset.content.survey);

    if (this.state.isExpandable && !this.state.isExpanded) {
      items = items.slice(0, DISPLAY_LIMIT);
    }

    if (items.length === 0) {
      return (
        <bem.FormView__cell m={['box', 'padding-small']}>
          {t('This ##asset_type## is empty.').replace('##asset_type##', this.props.asset.asset_type)}
        </bem.FormView__cell>
      );
    }

    return (
      <bem.FormView__cell m='box'>
        {items.map(this.renderQuestion)}

        {this.state.isExpandable &&
          <bem.FormView__cell m={['bordertop', 'toggle-details']}>
            <button onClick={this.toggleExpanded}>
              {this.state.isExpanded ? <i className='k-icon k-icon-up'/> : <i className='k-icon k-icon-down'/>}
              {this.state.isExpanded ? t('Show less') : t('Show more')}
            </button>
          </bem.FormView__cell>
        }
      </bem.FormView__cell>
    );
  }
}

export default AssetContentSummary;
