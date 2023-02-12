const express = require("express");
const router = express.Router();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

router.get("/", async (req, res, next) => {
  try {
    res.render("index.hbs");
  } catch (err) {
    console.log(err);
  }
});

router.get("/artist-search", (req, res, next) => {
  // console.log(req.query.artist)
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const { items } = data.body.artists;
      // console.log(items);
      const info = [];
      items.forEach((eachArtist) => {
        info.push({
          name: eachArtist.name,
          image: eachArtist.images[0],
          id: eachArtist.id,
        });
      });
      // console.log("The received data from the API: ", info);
      res.render("artist-search-results.hbs", {
        artistInfo: info,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
router.get("/albums/:id", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then((data) => {
    const { items } = data.body;
    const info = [];
    items.forEach((eachAlbum) => {
      info.push({
        name: eachAlbum.name,
        image: eachAlbum.images[0],
        id: eachAlbum.id
      })
    })
      console.log('Artist albums', info);
      res.render("albums.hbs", {
        albumInfo: info
      })
  })
  .catch ((err) => {
    console.log(err)
  })
  
});


module.exports = router;
