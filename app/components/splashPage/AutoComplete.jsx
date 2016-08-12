import React from 'react';
import TextField from 'material-ui/TextField';

class AutoCompleteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log("work");
    // send to backend
  }
  render() {
    const formStyle = {
      width: '80%',
      marginBottom: '5%',
    };
    return (
      <div>
        <form onSubmit={this.onSubmit} style={formStyle}>
        {/*
          <AutoComplete
          hintText="Type anything"
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleUpdateInput}
        />
        */}
        <TextField
          hintText="City"
          floatingLabelText="Your Location"
          value={this.state.city}
          fullWidth={true}
          onChange={e => this.setState({ city: e.target.value })}
        />
        </form>
      </div>
    );
  }
}

export default AutoCompleteInput;