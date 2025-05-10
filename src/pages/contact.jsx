import { FaLinkedin, FaTelegramPlane, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <p>you can find me in</p>
      <div className="flex space-x-6">
        <a
          href="https://www.linkedin.com/in/pavlo-kostyshyn-5871b8196/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={30} />
        </a>
        <a
          href="https://t.me/Pasha2Pa2ha"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegramPlane size={30} />
        </a>
        <a
          href="https://github.com/2pasha"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={30} />
        </a>
      </div>
    </div>
  );
}