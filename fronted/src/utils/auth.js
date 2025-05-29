export async function isLoggedIn(token) {
  try {
    if (!token) return [false, null];
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const res = await fetch("http://backend:3001/api/auth/verificar", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.error) return [true, data];

    console.log("Error in auth.js: ", data);
    
    return [false, null];
  } catch (error) {
  console.log('Error en isLoggedIn:', error);  // Esto es clave
  return [false, null];
}
}

