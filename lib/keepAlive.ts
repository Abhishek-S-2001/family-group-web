// Pings the backend every 10 minutes to prevent Render from sleeping
export function startKeepAlive() {
  const url = process.env.NEXT_PUBLIC_API_URL + '/';
  
  const ping = () => {
    fetch(url).catch(() => {}); // silent fail is fine
  };

  ping(); // immediate ping on load
  setInterval(ping, 10 * 60 * 1000); // every 10 minutes
}