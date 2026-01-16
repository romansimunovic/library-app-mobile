// index.js (ROOT)
import { registerRootComponent } from 'expo';
import App from './App';  // ✅ App.js u ROOTU (ne ./app/App.js)
registerRootComponent(App);
