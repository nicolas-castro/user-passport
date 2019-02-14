const express = require('express');
const router  = express.Router();

const Room = require('../models/room-model');
const User = require('../models/user-model');

const fileUploader = require('../config/upload-setup/cloudinary');



router.get('/rooms/add', isLoggedIn, (req, res, next) => {
  res.render('room-pages/addRoom');
});

                    //  <input type="file" name="imageUrl" id="">
//                                                  |
router.post('/create/room', fileUploader.single('imageUrl'),(req, res, next) => {
  // console.log('body: ', req.body);
  // console.log(' - - -- - -- - -- - - -- - - ');
  // console.log('file: ', req.file);
  const { name, description } = req.body;
  Room.create({
    name,
    description,
    imageUrl: req.file.secure_url,
    owner: req.user._id
  })
  .then( newRoom => {
    // console.log('room created: ', newRoom)
    res.redirect('/rooms');
  } )
  .catch( err => next(err) )
})

router.get('/rooms', (req, res, next) => {
  Room.find().populate('owner')
  .then(roomsFromDB => {
    roomsFromDB.forEach(oneRoom => {
      if(oneRoom.owner.equals(req.user._id)){
        oneRoom.isOwner = true;
      }
    })
    res.render('room-pages/room-list', { roomsFromDB })
  })
})

router.post('/rooms/:theRoomId/delete', (req,res,next)=> {
  Room.findByIdAndDelete(req.params.theRoomId)
  .then( theRoom => {
    res.redirect('/rooms')
    console.log("The Deleted Room is : ", theRoom)
  })
  .catch( err => next(err) )
})

router.get('/rooms/edit',(req, res, next) => {
  res.render('room-pages/edit-room');
});

router.get('/rooms/:theRoomId/edit', (req,res, next)=>{
  Room.findById(req.params.theRoomId)
  .then( foundRoom => {
      res.render('room-pages/edit-room', { foundRoom })
    })
    .catch( err => next(err) )
  })

  router.post('/rooms/:theRoomId/update', fileUploader.single('imageUrl'), (req, res, next)=>{

    const { name, description } = req.body;

    const updatedRoom = {
      name,
      description,
      owner: req.user._id
    }
    if(req.file){
      updatedRoom.imageUrl = req.file.secure_url;
    }

    Room.findByIdAndUpdate(req.params.theRoomId, updatedRoom)
    .then( updatedRoom => {
      console.log("This Room is updated: ",{updatedRoom})
      res.redirect(`/rooms/${updatedRoom._id}/edit`)
    })
    .catch( err => next(err) )
  })

function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else  {
    res.redirect('/login');
  }

}

module.exports = router;
