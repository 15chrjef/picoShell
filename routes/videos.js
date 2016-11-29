const express = require('express');
const router = express.Router();
const utils = require('../utils/videoHelpers.js');
const Video = require('../models/Videos.js');
const request = require('request');
const keys = require('../utils/keys.js');

router.post('/submitVideo', function(req, res, next) {
	const options = {
		method: 'GET',
		uri: 'https://www.googleapis.com/youtube/v3/videos',
		qs: {
			id: req.body.videoId,
			key: keys.youtubeKey,
			part: 'snippet',
			type: 'video'
		}
	}

	request(options, function(err, response, body) {
		if (err) {
			console.error(error)
		} else {
			const parsedBody = JSON.parse(body);
			const snippet = parsedBody.items[0].snippet;
			console.log(snippet);
			let videoImage = '';

			if (snippet.thumbnails.medium) {
				videoImage = 'http://img.youtube.com/vi/' + req.body.videoId +'/mqdefault.jpg';
			} else if (snippet.thumbnails.default) {
				videoImage = 'http://img.youtube.com/vi/' + req.body.videoId + '/default.jpg';
			}


			Video.create({
				videoId: req.body.videoId,
				videoUrl: req.body.videoUrl,
				videoTitle: snippet.title,
				videoDescription: snippet.description,
				videoImage: videoImage
			})
			.then(function() {
				console.log('successfully sent to the database');
				res.send(201);
			})
		}
	});
});

router.post('/incrementVideoClickCounter', function(req, res) {
	console.log('incrementing video counter', req.body);
	Video.findOne({
		where: {
			videoId: req.body.videoId
		}
	})
	.then(function(video) {
		var newCount = video.dataValues.videoClicks + 1;
		video.update({
			videoClicks: newCount
		})
		.then(function(response) {
			res.status(201).send(response);
		})
	});
})

router.get('/getVideos', function(req, res, next) {
	Video.findAll({
	})
	.then(function(data) {
		res.send(data);
	});
});

router.get('/checkVideoIdInDB', function(req, res, next) {
	Video.findOne({
		where: {videoId: req.query.videoId}
	})
	.then(function(video) {
		if (video) {
			res.send(200, video);
		} else {
			res.send(400, false);
		}
	})
	.catch(function(err) {
		console.error(err);
		res.send(404);
	});
});

router.get('/mostPopularVideos', function(req, res) {
  Video.findAll({
    limit: 8,
    order: 'videoClicks DESC'
  })
  .then(function(results) {
  	console.log('in here', results)
    res.status(200).send(results);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});


module.exports = router;
