import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Grip Invest. All rights reserved.</p>
        <p className="mt-2">
          Made with ❤️ for the Winter Internship.
        </p>
      </div>
    </footer>
  );
};

export default Footer;