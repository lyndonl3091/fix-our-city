import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import geocode from '../../api/geocoder';
import { setUserLocation } from '../../actions/locationActions'


const buttonStyle = {
  marginTop: '6%',
  width: '100%',
  marginBottom: '2%',
};

class IssueButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.validateGeocode = this.validateGeocode.bind(this);
  }

  validateGeocode(address) {
    const { locationValidated } = this.props;
    geocode(address)
      .then(location => {
        const coords = {
          latitude: location.lat(),
          longitude: location.lng(),
        };
        locationValidated(coords);
        this.context.router.push('/view-issues');
      })
      .catch(status => {
        console.log(status);
      });
  }
  render() {
    const { locationInput } = this.props;
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <Link to="/add-an-issue">
              <RaisedButton label="Add Issue" primary style={buttonStyle} />
            </Link>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <RaisedButton
              onClick={() => this.validateGeocode(locationInput)}
              label="View Issues"
              primary
              style={buttonStyle}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
// <Link to="/view-issues">
// </Link>

IssueButton.propTypes = {
  locationInput: PropTypes.func.isRequired,
  locationValidated: PropTypes.func.isRequired,
};

IssueButton.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = (state) => ({
  locationInput: state.input.location,
});

const mapDispatchToProps = (dispatch) => ({
  locationValidated: (coords) => dispatch(setUserLocation(coords)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueButton);
