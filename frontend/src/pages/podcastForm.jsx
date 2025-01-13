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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAudioId(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gray-900">
      <div className="w-11/12 max-w-sm p-6 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <h1 className="text-2xl font-semibold text-center text-gray-300 mb-6">
          Podcast <span className="text-blue-500">Generator</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Male Host Name</span>
            </label>
            <input
              type="text"
              name="maleHostName"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
              value={formData.maleHostName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Male Host Personality</span>
            </label>
            <input
              type="text"
              name="maleHostPersonality"
              placeholder="E.g., Enthusiastic"
              className="w-full input input-bordered h-10"
              value={formData.maleHostPersonality}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Female Host Name</span>
            </label>
            <input
              type="text"
              name="femaleHostName"
              placeholder="Jane Doe"
              className="w-full input input-bordered h-10"
              value={formData.femaleHostName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Female Host Personality</span>
            </label>
            <input
              type="text"
              name="femaleHostPersonality"
              placeholder="E.g., Calm"
              className="w-full input input-bordered h-10"
              value={formData.femaleHostPersonality}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Length (Minutes)</span>
            </label>
            <input
              type="number"
              name="length"
              placeholder="Enter duration (1-3)"
              className="w-full input input-bordered h-10"
              value={formData.length}
              onChange={handleChange}
              min="1"
              max="3"
            />
          </div>

          <div className="mb-6">
            <label className="label">
              <span className="text-sm font-medium text-gray-400">Podcast Topic</span>
            </label>
            <input
              type="text"
              name="podcastTopic"
              placeholder="Enter topic"
              className="w-full input input-bordered h-10"
              value={formData.podcastTopic}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Generate Podcast"
            )}
          </button>
        </form>

        {isLoading && (
          <div className="mt-4 text-center text-gray-400 animate-pulse">
            Podcast is generating...
          </div>
        )}

        {audioId && (
          <div className="mt-6 text-center text-gray-300">
            <h2 className="text-lg font-semibold mb-4">Podcast Generated!</h2>
            <audio controls className="w-full">
              <source
                src={`/api/podcast/audio/${audioId}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
            <a
              href={`/api/podcast/audio/${audioId}/download`}
              download
              className="btn btn-secondary btn-sm mt-4 w-full"
            >
              Download Podcast
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastGenerator;
