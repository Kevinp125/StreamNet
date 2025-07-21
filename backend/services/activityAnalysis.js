const { supabase } = require("../services/supabaseclient");

//function will check activity table and times
//to determine in what 3 hour interval user is the most
//active
async function calculateActiveWindow(userId) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: activities, error } = await supabase
      .from("user_activity")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!activities || activities.length < 5) {
      return { start: 19, end: 22, count: 0 };
    }

    //we are working in military time
    //making 8 windows (3 hour chunks)
    //updating count whenever activity takes place
    //within those windows
    const windows = [
      { start: 0, end: 3, count: 0 }, 
      { start: 3, end: 6, count: 0 }, 
      { start: 6, end: 9, count: 0 }, 
      { start: 9, end: 12, count: 0 }, 
      { start: 12, end: 15, count: 0 }, 
      { start: 15, end: 18, count: 0 }, 
      { start: 18, end: 21, count: 0 }, 
      { start: 21, end: 24, count: 0 }, 
    ];
  } catch (err) {}
}
