# Bathroom Graffiti WIP

This application is an attempt to be able to place virtual stickers into a room using Augmented Reality. The model of the room has been prebuilt and, when calibrated with the real environment, mimics the surfaces of the real world. Allowing a user to draw a sticker and place it (seemingly) on the wall of the room they are in. 

Right now this is just a proof of concept app - and a large part of the code is just experimentation. 


NOTES: 
1. Uploading images drawn on the canvas to a digital ocean space called "bathroom-graffiti". 


# TODO:
12/25/23: Update the server to return the unique path of the image (including unique ID), save that record in a MongoDB (or similar). Then -- the AR front end can use the link to that image to use to place in the AR app, and update the coordinates of the Image in the mongoDB. 

