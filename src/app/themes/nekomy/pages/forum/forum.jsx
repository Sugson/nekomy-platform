import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';
import { setLoading } from '../../../../core/actions/actions';
import Page from '../../components/page/page';
import Form from './subcomponents/form/form';
import Icon from '../../../../core/common/lib/icon/icon';
import Add from '../../../../../../static/svg/add.svg';

class Forum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSubject: null,
      expandedAccordionId: null,
      updated: 0
    };
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

  handleToggling(id) {
    const { expandedAccordionId, updated } = this.state;

    this.setState({
      expandedAccordionId: expandedAccordionId === id ? null : id,
      updated: updated + 1
    });
  }

  addThread(e) {
    e.preventDefault();
    const { currentSubject } = this.state;
    const { name } = this.refs;

    if (currentSubject) {
      this.props.firebase.push(`subjects/${currentSubject}/forum`, { name: name.value, created: Date.now() })
        .then(() => {
          this.props.setNotification({ message: 'New thread added successfully', type: 'info' });
          name.value = '';
        }, (error) => {
          this.props.setNotification({ message: String(error), type: 'error' });
        });
    }
  }

  renderThreads(threads) {
    if (!_.isEmpty(threads)) {
      const threadsWithID = _.map(threads, (val, key) => {
        val.id = key;
        return val;
      });

      const threadsInOrder = _.sortBy(threadsWithID, item => item.created).reverse();
      const { currentSubject, expandedAccordionId } = this.state;
      const { firebase, userData } = this.props;

      return threadsInOrder.map((thread, index) => (
        <AccordionItem key={index}>
          <AccordionItemTitle
            className={`accordion__title thread__title ${expandedAccordionId === (index + 1) ? 'is-opened' : ''}`}
          >
            <div>{thread.name}</div>
            <div>created on {new Date(thread.created).toLocaleString()}</div>
          </AccordionItemTitle>
          <AccordionItemBody>
            <Form
              messages={thread.messages || []}
              forum={thread.id}
              subject={currentSubject}
              user={userData.info}
              firebase={firebase}
              update={this.state.updated}
            />
          </AccordionItemBody>
        </AccordionItem>
      ));
    }

    return null;
  }

  render() {
    const { currentSubject } = this.state;

    return (
      <Page additionalClass={'forum'} headline={'Discussion'}>
        <Accordion onChange={id => this.handleToggling(id)}>
          { (!_.isEmpty(this.props.subject) && currentSubject) &&
            <div>
              {this.renderThreads(this.props.subject[currentSubject].forum)}
            </div>
          }
          <AccordionItem>
            <AccordionItemTitle className={'accordion__title accordion__title--add'}>
              <Icon glyph={Add} style={{ fill: 'white' }} /> Add new thread
            </AccordionItemTitle>
            <AccordionItemBody>
              <form className="user-form add-thread" onSubmit={e => this.addThread(e)}>
                <input type="text" className="input-field" placeholder="Thread name" ref="name" />
                <button type="submit" className="btn btn-primary">Add thread</button>
              </form>
            </AccordionItemBody>
          </AccordionItem>
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

export default enhance(Forum);
