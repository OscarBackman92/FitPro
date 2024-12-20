import React from 'react';

// Footer component with social media links and copyright info
const Footer = () => {
 return (
   <footer className="bg-gray-900 text-white py-8 mt-auto border-t border-gray-700">
     <div className="container mx-auto px-6 md:px-12">
       <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
         {/* Copyright notice */}
         <div className="text-center md:text-left text-sm text-gray-400">
           <p>&copy; 2024 Your Company. All rights reserved.</p>
         </div>

         {/* Social media links with icons */}
         <div className="flex justify-center space-x-6">
           {/* Facebook */}
           <a 
             href="https://www.facebook.com/your-profile" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white"
           >
             <i className="fab fa-facebook-f text-2xl"></i>
           </a>

           {/* Twitter */}
           <a 
             href="https://twitter.com/your-profile" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white"
           >
             <i className="fab fa-twitter text-2xl"></i>
           </a>

           {/* Instagram */}
           <a 
             href="https://www.instagram.com/your-profile" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white"
           >
             <i className="fab fa-instagram text-2xl"></i>
           </a>

           {/* LinkedIn */}
           <a 
             href="https://www.linkedin.com/in/your-profile" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white"
           >
             <i className="fab fa-linkedin-in text-2xl"></i>
           </a>

           {/* GitHub */}
           <a 
             href="https://github.com/OscarBackman92" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white"
           >
             <i className="fab fa-github text-2xl"></i>
           </a>
         </div>
       </div>
     </div>
   </footer>
 );
};

export default Footer;