import './config/db'
import app from './App';
import CONFIG from './config/config'

const PORT = CONFIG.PORT

app.listen(PORT, (err: any) => {
  if (err) return console.error(err);

  console.log(`Server is listening on port ${PORT}`);
})