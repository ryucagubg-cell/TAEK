import axios from 'axios';
async function test() {
  const url = `http://localhost:3000/api/photos/list-folder/1HJ4xxBExUhHGCSAykfxzwiP2bGJOFM9S`;
  try {
    const response = await axios.get(url);
    console.log("Total photos returned from API:", response.data.files.length);
  } catch (err) {
    console.error("Error from API:", err.message);
  }
}
test();
