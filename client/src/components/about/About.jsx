import React from "react";
import Classes from "./About.module.css";
import HabboWaving from "../../img/habbo-wave.gif";
import Linkedin from "../../img/linkedin.png";
import Github from "../../img/github.png";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div className={Classes.container}>
      <main className={Classes.main}>
        <NavLink to="/home">
          <button>BACK TO HOME</button>
        </NavLink>
        <h1>About me</h1>
        <p>Hi! My name is Axel and I am the creator of this SPA.</p>
        <p>
          It's made from bottom to top by me, meaning i developed both backend
          and frontend.
        </p>
        <p>
          If you are interested in my skills, you can get in touch with me, via
          my social media below:
        </p>
        <div className={Classes.main__images}>
          <a
            rel="noreferrer"
            href="https://www.linkedin.com/in/axel-lois-dev/"
            target="_blank"
          >
            <img alt="linkedin" src={Linkedin} />
          </a>
          <a
            rel="noreferrer"
            href="https://github.com/axel-lois"
            target="_blank"
          >
            <img alt="github" src={Github} />
          </a>
        </div>
      </main>
      <aside className={Classes.aside}>
        <img alt="waving" src={HabboWaving} />
      </aside>
    </div>
  );
};

export default About;
