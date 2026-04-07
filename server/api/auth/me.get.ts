export default defineEventHandler(async (event) => {
  // In a real application, you would extract user info from the session or token
  const cookie = parseCookies(event);
  const cookieHeader = getHeader(event, 'cookie') || ''

  console.log('cookie', cookie);
  console.log('cookieHeader', cookieHeader);

  const res = await $fetch('http://localhost:4000/auth/me', {
    headers: {
      cookie: cookieHeader
    }
  });
  console.log('res', res);
  return res;
});