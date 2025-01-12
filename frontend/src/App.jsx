import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PodcastGenerator from './pages/podcastForm.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PodcastGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;
