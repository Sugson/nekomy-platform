import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Appear, BlockQuote, Cite, CodePane, Code, Deck, Fill, Fit,
  Heading, Image, Layout, ListItem, List, Quote, Slide, Text
} from 'spectacle';
import createTheme from 'spectacle/lib/themes/default';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { setLoading } from '../../../../core/actions/actions';

const theme = createTheme({
  primary: '#3c3c3c',
  secondary: '#fff'
});

class Lesson extends Component {
  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
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

  render() {
    return (
      <div className={'lesson__presentation'}>
        <Deck transition={['slide']} progress={'bar'} theme={theme}>
          <Slide>
            <Text>Hello</Text>
            <BlockQuote>
              <Quote>Ken Wheeler is amazing</Quote>
              <Cite>Everyone</Cite>
            </BlockQuote>
          </Slide>
          <Slide>
            <Text>Hello2</Text>
            <List ordered start={2} type="A">
              <ListItem>Item 1</ListItem>
              <ListItem>Item 2</ListItem>
              <ListItem>Item 3</ListItem>
              <ListItem>Item 4</ListItem>
            </List>
          </Slide>
          <Slide>
            <Text>Hello2</Text>
            <List ordered start={2} type="A">
              <ListItem>Item 1</ListItem>
              <ListItem>Item 2</ListItem>
              <ListItem>Item 3</ListItem>
              <ListItem>Item 4</ListItem>
            </List>
          </Slide>
        </Deck>
      </div>
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

export default enhance(Lesson);
