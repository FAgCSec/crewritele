export async function isLoggedIn(token) {
  try {
    if (!token) return [false, null];

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const res = await fetch("https://localhost:3001/api/auth", {
      method: "POST",
      headers: {
        "token": token,
      },
    });
    const data = await res.json();
    if (!data.error) return [true, data];

    console.log("Error in auth.js: ", data);
    
    return [false, null];
  } catch (error) {
    return [false, null];
  }
}
