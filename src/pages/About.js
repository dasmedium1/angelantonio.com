import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <img src="/images/AAlogo.jpg" alt="AAlogo" className="artist-image" />
        <div className="bio">
          <h1>About Me</h1>
          <p>
            Your compelling artist biography goes here. Share your story,
            influences, and journey.
          </p>
          <p>
            Additional paragraphs about your musical style, achievements, and
            vision.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
