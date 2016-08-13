import AWS from 'aws-sdk';
import path from 'path';
import geolib from 'geolib';
import Issue from '../models/issues';


const s3 = new AWS.S3();
const s3BaseUrl = 'https://s3-us-west-2.amazonaws.com/fix-our-city/';
AWS.config.loadFromPath('./awsconfig.json');

export function all(req, res) {
  Issue.find({}).exec((err, issues) => {
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }

    return res.json(issues);
  });
}

/**
 * Add a Issue
 */
export function add(req, res) {
  console.log('in add', req.file);
  const fileExt = path.extname(req.file.originalname);
  const issueObj = JSON.parse(req.body.issueObj);

  Issue.create(issueObj, (err, savedIssue) => { // eslint-disable-line consistent-return
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }
    // add the image to s3
    console.log('saved issue:', savedIssue);
    s3.putObject({
      Bucket: 'fix-our-city',
      Key: savedIssue._id + fileExt, // eslint-disable-line no-underscore-dangle
      Body: req.file.buffer,
      ACL: 'public-read',
    }, (err) => { // eslint-disable-line consistent-return
      if (err) return res.status(400).send(err);

      // add the s3 url to the db
      savedIssue.imgUrl = s3BaseUrl + savedIssue._id + fileExt;  // eslint-disable-line no-underscore-dangle,max-len,no-param-reassign
      console.log('savedIssue:', savedIssue);
      savedIssue.save(err => {
        if (err) {
          return res.status(400).send(err);
        }
        return res.status(200).send('Saved Issue');
      });
    });
  });
}

export function findNearLocation(req, res) {
  console.log('req.body:', req.body);
  const centerLongitude = req.body.center.lng;
  const centerLatitude = req.body.center.lat;
  const cornerLongitude = req.body.corner.lng;
  const cornerLatitude = req.body.corner.lat;

  const distance = geolib.getDistance(
    { latitude: centerLatitude, longitude: centerLongitude },
    { latitude: cornerLatitude, longitude: cornerLongitude }
    );
  const meters = distance * 1609.34;


  const point = { type: 'Point', coordinates: [centerLongitude, centerLatitude] };
  Issue.geoNear(point, { maxDistance: meters, spherical: true }, (err, issues) => {
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }
    console.log('issues:', issues);
    const output = { issues, meters };
    return res.json(output);
  });
  // Issue.find({ location: { $nearSphere:
  //   { $geommetry:
  //   {
  //     type: 'Point', coordinates: [centerLongitude, centerLatitude],
  //   },
  //    $maxDistance: miles } } })
  // .exec((err, issues) => {
  //   if (err) {
  //     console.log('Error in first query');
  //     return res.status(500).send('Something went wrong getting the data');
  //   }
  //   return res.json(issues);
  // });
}

export function toggleFixed(req, res) {
  Issue.findById(req.body.id).exec((err, issue) => { // eslint-disable-line consistent-return
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }
    if (issue) {
      issue.isFixed = !issue.isFixed; // eslint-disable-line no-param-reassign
      issue.save((err, savedIssue) => {
        if (err) {
          return res.status(400).send('Something went wrong saving the data');
        }
        return res.json(savedIssue);
      });
    } else {
      return res.status(500).send('No issue with that ID found');
    }
  });
}


export function upvote(req, res) {
  Issue.findById(req.body.id).exec((err, issue) => { // eslint-disable-line consistent-return
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }
    if (issue) {
      issue.votes += 1; // eslint-disable-line no-param-reassign
      issue.save((err, savedIssue) => {
        if (err) {
          return res.status(400).send('Something went wrong saving the data');
        }
        return res.json(savedIssue);
      });
    } else {
      return res.status(500).send('No issue with that ID found');
    }
  });
}


export function downvote(req, res) {
  Issue.findById(req.body.id).exec((err, issue) => { // eslint-disable-line consistent-return
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }
    if (issue) {
      issue.votes -= 1; // eslint-disable-line no-param-reassign
      issue.save((err, savedIssue) => {
        if (err) {
          return res.status(400).send('Something went wrong saving the data');
        }
        return res.json(savedIssue);
      });
    } else {
      return res.status(500).send('No issue with that ID found');
    }
  });
}


export default {
  all,
  add,
  findNearLocation,
  toggleFixed,
  upvote,
  downvote,
};
