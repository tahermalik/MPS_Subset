import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store,{persistor} from './redux/store'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>   {/* ✅ HERE */}
          <App />
          <Toaster />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)