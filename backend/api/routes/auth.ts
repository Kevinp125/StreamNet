import express from "express";
import { supabase } from "../../supabaseclient";
const router = express.Router(); //making a router
//here you could import a controller (what actuall queries database)

router
  .route("/check-user") // `/api/auth`
  .get(async (req, res) => {
    const token = req.headers.authorization?.split('')[1]; //splits string at the space and grabs the second part which is the actual token

    if (!token) return res.status(401).send('Missing token'); //if we dont have a token return with an error

    console.log(token);
    const { data: { user }, error } = await supabase.auth.getUser(token); //get the user from supabase using their token
    
    if (error || !user) return res.status(401).send('Invalid token');

    console.log(user);

  });

export default router;
