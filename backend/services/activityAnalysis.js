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
  } catch (err) {}
}
