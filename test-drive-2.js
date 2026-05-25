import axios from 'axios';
async function test() {
  const url = `https://drive.google.com/embeddedfolderview?id=1HJ4xxBExUhHGCSAykfxzwiP2bGJOFM9S`;
  const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }});
  const html = response.data;
  
  const domMatches = html.matchAll(/id="entry-([a-zA-Z0-9-_]{25,})"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g);
  let files = [];
  const seenIds = new Set();

  for (const match of domMatches) {
    const id = match[1];
    const name = match[2];
    if (!seenIds.has(id)) {
      files.push({ id, name });
      seenIds.add(id);
    }
  }
  
  console.log("Total matched files:", files.length);
  console.log(files.slice(0, 5));
  
  // Now test image filtering
  const filtered = files.filter(f => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(f.name));
  console.log("Total filtered images:", filtered.length);
  console.log(filtered.slice(0, 5));
}
test();
