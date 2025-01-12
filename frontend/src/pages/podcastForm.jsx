import React, { useState } from "react";

const PodcastGenerator = () => {
  
  const [formData, setFormData] = useState({
    maleHostName: "",
    maleHostPersonality: "",
    femaleHostName: "",
    femaleHostPersonality: "",
    length: "",
    podcastTopic: "",
  });

  const [audioId, setAudioId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/podcast/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.audioId) {
        setAudioId(data.audioId);
      }
    } catch (error) {
      console.error("Error generating podcast:", error);
    }
  };

  return (
    <div>
      <h1>Podcast Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="maleHostName">Male Host Name:</label>
          <input
            type="text"
            id="maleHostName"
            name="maleHostName"
            value={formData.maleHostName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="maleHostPersonality">Male Host Personality:</label>
          <input
            type="text"
            id="maleHostPersonality"
            name="maleHostPersonality"
            value={formData.maleHostPersonality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="femaleHostName">Female Host Name:</label>
          <input
            type="text"
            id="femaleHostName"
            name="femaleHostName"
            value={formData.femaleHostName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="femaleHostPersonality">Female Host Personality:</label>
          <input
            type="text"
            id="femaleHostPersonality"
            name="femaleHostPersonality"
            value={formData.femaleHostPersonality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="length">Length of Podcast (in minutes):</label>
          <input
            type="number"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="podcastTopic">Podcast Topic:</label>
          <input
            type="text"
            id="podcastTopic"
            name="podcastTopic"
            value={formData.podcastTopic}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Generate Podcast</button>
      </form>

      {audioId && (
        <div>
          <h2>Podcast Generated!</h2>
          <audio controls>
            <source
              src={`/api/podcast/audio/${audioId}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
          <a href={`/api/podcast/audio/${audioId}/download`} download>
            Download Podcast
          </a>
        </div>
      )}
    </div>
  );
};

export default PodcastGenerator;