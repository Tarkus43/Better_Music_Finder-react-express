import DB from "../connect";

async function createSong(req, res){
  const { title, artist, genre_id, duration, release_date, album, language, is_lyrics_available, popularity, tempo, is_explicit, mood, is_favorite} = req.body

  try {
    const sql = "INSERT INTO tracks"
  } catch (error) {
    
  }
}