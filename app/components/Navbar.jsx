import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {cyan500} from 'material-ui/styles/colors';
import {spacing, typography, zIndex} from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class Navbar extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {open: false};

    this.handleTouchTapHeader = this.handleTouchTapHeader.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }



  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  handleTouchTapHeader = () => {
    this.setState({open: false});
    this.context.router.push('/');
  };

  handleToAddAnIssue = () => {
    this.setState({open: false});
    this.context.router.push('/add-an-issue');
  }
  handleToViewIssue = () => {
    this.setState({open: false});
    this.context.router.push('/view-issues');
  }

  render() {
    const navbarStyle = {
      position: 'fixed',
      top: '5px',
      left: '5px',
      background: 'none',
    };
    const styles = {
      logo: {
        cursor: 'pointer',
        fontSize: 24,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan500,
        paddingLeft: spacing.desktopGutter,
        marginBottom: 8,
      },
    };
    return (
      <div>
        <IconButton
          onTouchTap={this.handleToggle}
          style={navbarStyle}
        >
          <FontIcon className="material-icons">menu</FontIcon>
        </IconButton>
        <Drawer docked={false} width={200} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
          <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
            Fix Our City
          </div>
          <MenuItem onTouchTap={this.handleToAddAnIssue}>Add Issue</MenuItem>
          <MenuItem onTouchTap={this.handleToViewIssue}>View Issue</MenuItem>
        </Drawer>
      </div>
    );
  }
}

Navbar.contextTypes = {
  router: PropTypes.object,
};