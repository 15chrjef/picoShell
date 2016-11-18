const React = require('react');
const axios = require('axios');
const utils = require('../../utils/validationHelpers');
import InlineEdit from 'react-edit-inline';

class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.dataChanged = this.dataChanged.bind(this);
    this.style = {
      backgroundColor: '#191919',
      minWidth: 300,
      fontFamily: 'Roboto-Regular',
      display: 'inline-block',
      margin: 0,
      padding: 0,
      fontSize: 15,
      outline: 0,
      border: 0
    }

    this.state = {
      username: this.props.username,
      email: this.props.email,
      github: this.props.github
    }
  }

  dataChanged(data) {

    if (data.email && utils.isValidEmail(data.email)) {
      this.setState({
        email: data.email
      });

      const toUpdate = {
        email: data.email
      }

      axios.post('/updateUser', { username: this.state.username, toUpdate: toUpdate})
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    if (data.github && utils.isValidName(data.github)) {
      this.setState({
        github: data.github
      })

      const toUpdate = {
        githubHandle: data.github
      }

      axios.post('/updateUser', { username: this.state.username, toUpdate: toUpdate})
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }

  render() {
    return (
        <div className="card-container user-info-container">
          <div className="title">
            Username
          </div>
          <div className="info">
            {this.props.username}
          </div>
          <div className="title">
            Email
          </div>
          <div className="info">
            <InlineEdit
              activeClassName="editing"
              text={this.state.email}
              paramName="email"
              change={this.dataChanged}
              style = {this.style}
            />
            {this.props.email}
          </div>
          <div className="title">
            Github
          </div>
          <div className="info">
            <InlineEdit
              activeClassName="editing"
              text={this.state.github}
              paramName="github"
              change={this.dataChanged}
              style = {this.style}
            />
            {this.props.github}
          </div>
        </div>
      );
  }
}

module.exports = UserInfo;