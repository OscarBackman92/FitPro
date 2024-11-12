import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="flex justify-center gap-6">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Instagram
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Facebook
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          X (Twitter)
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
      </div>
      <p className="text-center mt-4 text-sm">© 2024 Your Company</p>
    </footer>
  );
};

export default Footer;
