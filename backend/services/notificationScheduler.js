const { supabase } = require("./supabaseclient");
const { sendNotificationToUser } = require("../websocket/websocketServer");

//function will check what users fall within
//active window during a set interval and call a helper function
//that updates each users notifications
async function deliverPendingNotifications() {}

//function will change noitfication status from pending to delievered
//to individual users
async function deliverUserPendingNotifications(userId) {}
