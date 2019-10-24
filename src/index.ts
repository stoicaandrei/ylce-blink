import app from './App';
import CONFIG from './config/config'
import './config/db'

const PORT = CONFIG.PORT

app.listen(PORT, (err: any) => {
  if (err) return console.error(err);

  console.log(`Server is listening on port ${PORT}`);
})