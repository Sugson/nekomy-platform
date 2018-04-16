import React from 'react';
import _ from 'lodash';
import { RadioGroup, RadioButton } from 'react-radio-buttons';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  handleChange(selected) {
    this.setState({
      selected: Number(selected)
    });
  }

  handlePrevious() {
    const { setCurrent, setScore } = this.props;

    setCurrent(this.props.current - 1);
    setScore(this.props.score - 1);
  }

  handleNext() {
    const { setCurrent, setScore, question } = this.props;
    const { selected } = this.state;

    setCurrent(this.props.current + 1);
    if (_.includes(question.correct, Number(selected)) || question.correct === Number(selected)) {
      setScore(this.props.score + 1);
    }
  }

  render() {
    const { question } = this.props;

    return (
      <div className="well">
        <h3>{question.text}</h3>
        <hr />
        <ul className="list-group">
          <RadioGroup onChange={e => this.handleChange(e)}>
            {
              _.values(question.choices).map((choice, index) => (
                <RadioButton value={`${index + 1}`} iconSize={20} pointColor={'#138CE4'} rootColor={'#000'} key={index}>
                  {choice}
                </RadioButton>
              ))
            }
          </RadioGroup>
        </ul>
        <div className={'question__pagination'}>
          <button type="button" onClick={this.handleNext} className="btn btn-primary">Next</button>
        </div>
      </div>
    );
  }
}

export default Question;
