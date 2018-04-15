import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import AceEditor from 'react-ace';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';
import brace from 'brace';
import 'brace/mode/jsx';
import 'brace/theme/github';
import { setLoading } from '../../../../core/actions/actions';
import Page from '../../components/page/page';
import Icon from '../../../../core/common/lib/icon/icon';
import Add from '../../../../../../static/svg/add.svg';

class Homework extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSubject: null,
      codeEditorValue: '',
      addExpanded: false
    };

    this.saveHomework = this.saveHomework.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  }

  componentWillReceiveProps(nextProps) {
    if (isLoaded(nextProps.subject)) {
      Object.keys(nextProps.subject).map((key) => {
        this.setState({
          currentSubject: key
        });
      });

      this.props.setLoading(false);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.codeEditorValue !== nextState.codeEditorValue) {
      return false;
    }

    return true;
  }

  onChange(newValue) {
    this.setState({ codeEditorValue: newValue });
  }

  saveHomework() {
    const { codeEditorValue, currentSubject } = this.state;

    if (codeEditorValue && currentSubject) {
      this.props.firebase.push(`users/${this.props.user.uid}/subject/${currentSubject}/homework`, { code: codeEditorValue, timestamp: Date.now() })
        .then(() => {
          this.props.setNotification({ message: 'hura', type: 'success' });
          window.location.reload();
        }, (error) => {
          this.props.setNotification({ message: String(error), type: 'error' });
        });
    }
  }

  renderEditors(homework) {
    const homeworkArray = _.values(homework).reverse();

    return homeworkArray.map((version, index) => (
      <AccordionItem expanded={index === 0}>
        <AccordionItemTitle
          className={`accordion__title ${index === 0 ? 'homework__version-title--current' : ''}`}
        >
          { index === 0 &&
            <span className={'homework__current-indicator'}>Current</span>
          }
          Version {`${homeworkArray.length - index}`} (saved on {new Date(version.timestamp).toLocaleString()})
        </AccordionItemTitle>
        <AccordionItemBody
          className={`accordion__body ${index === 0 ? 'homework__version-body--current' : ''}`}
        >
          <AceEditor
            name="homework"
            mode="javascript"
            theme="github"
            value={version.code}
            fontSize={14}
            readOnly
            height={'500px'}
            width={'100%'}
            showPrintMargin
            showGutter
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </AccordionItemBody>
      </AccordionItem>
    ));
  }

  render() {
    const { currentSubject, addExpanded } = this.state;

    return (
      <Page additionalClass={'forum'} headline={'Homework'}>
        <Accordion onChange={e => e === 0 && this.setState({ addExpanded: !this.state.addExpanded })}>
          <AccordionItem
            className={`accordion__item ${addExpanded ? 'accordion__item--hole' : ''}`}
          >
            <AccordionItemTitle className={'accordion__title homework__version-title--add'}>
              <Icon glyph={Add} style={{ fill: 'white' }} /> Add new version
            </AccordionItemTitle>
            <AccordionItemBody>
              <AceEditor
                name="homework"
                mode="javascript"
                theme="github"
                onChange={this.onChange}
                fontSize={14}
                height={'500px'}
                width={'100%'}
                showPrintMargin
                showGutter
                highlightActiveLine
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2
                }}
              />
              <button className="btn btn-primary btn--homework" onClick={this.saveHomework}>
                Save version
              </button>
            </AccordionItemBody>
          </AccordionItem>
          { (!_.isEmpty(this.props.userData.subject) && currentSubject) &&
            <div>
              {this.renderEditors(this.props.userData.subject[currentSubject].homework)}
            </div>
          }
        </Accordion>
      </Page>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    userData
  }
}) => ({ isDesktop, userData });

const enhance = compose(
  firebaseConnect(props => [
    `subjects#orderByChild=slug&equalTo=${props.params.slug}`,
    'users',
    `users/${props.userID}`
  ]),
  connect(state => ({
    subject: state.firebase.data.subjects,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Homework);
