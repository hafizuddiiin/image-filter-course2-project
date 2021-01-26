import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { error } from 'console';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (request: Request, response:Response) => {
      const image_url  = request.query.image_url;
      if(!image_url)
      {
        return response.status(400).send({ result: "Fail", returnMsg: "image_url is required!"});
      }
      const filteredImage = await filterImageFromURL(image_url);
      const filteredImageAbsolutePath = [filteredImage];
      response.status(200).sendFile(filteredImage, (err) => {
        if (!err)
        {
          deleteLocalFiles(filteredImageAbsolutePath);
        }
      });
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();