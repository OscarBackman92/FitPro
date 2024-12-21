import React from 'react';
import { User } from 'lucide-react';

// Avatar component that displays either an image, initials or default user icon
const Avatar = ({ src, height = 128, text, className = '' }) => {
 const showInitials = !src && text;

 return (
   <span className={`inline-flex items-center ${className}`}>
     {src ? (
       // Display image if src provided
       <img
         className="rounded-full object-cover"
         src={src}
         alt={text || 'avatar'} 
         style={{ width: `${height}px`, height: `${height}px` }}
       />
     ) : (
       // Display initials or default icon if no image
       <div
         className="rounded-full bg-gray-700 flex items-center justify-center"
         style={{ width: `${height}px`, height: `${height}px` }}
       >
         {showInitials ? (
           // Show first letter of text capitalized
           <span className="font-medium text-gray-300">
             {text.charAt(0).toUpperCase()}
           </span>
         ) : (
           // Show default user icon
           <User className="w-3/4 h-3/4 text-gray-400" />
         )}
       </div>
     )}
   </span>
 );
};

export default Avatar;