// src/App.jsx
/**
 * App (routing)
 * Syfte: definierar sidrutter: "/" (Home), "/product/:id" (ProductDetail).
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route
          path='*'
          element={<div style={{ padding: 12 }}>404 – okänd sida</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
