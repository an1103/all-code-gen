// // LanguageModal.js

// import React, { useState } from 'react';
// import './LanguageModal.css';

// const LanguageModal = ({ selectedLanguage, onLanguageChange }) => {
//   const [language, setLanguage] = useState(selectedLanguage);
//   const languages = ['English', 'Tamil', 'Kannada', 'Telugu'];

//   const handleConfirm = () => {
//     onLanguageChange(language);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Select Language</h2>
//         <div className="language-grid">
//           {languages.map((lang) => (
//             <label key={lang} className="language-option">
//               <input
//                 type="radio"
//                 name="language"
//                 value={lang}
//                 checked={language === lang}
//                 onChange={(e) => setLanguage(e.target.value)}
//               />
//               {lang}
//             </label>
//           ))}
//         </div>
//         <button onClick={handleConfirm} className="confirm-button">Confirm</button>
//       </div>
//     </div>
//   );
// };

// export default LanguageModal;

// LanguageModal.js
import React, { useState } from 'react';
import './LanguageModal.css';

const LanguageModal = ({ selectedLanguage, onLanguageChange }) => {
  const [language, setLanguage] = useState(selectedLanguage);
  const languages = [
    { label: 'English', code: 'en' },
    { label: 'Tamil', code: 'ta' },
    { label: 'Kannada', code: 'kn' },
    { label: 'Telugu', code: 'te' }
  ];

  const handleConfirm = () => {
    const selectedLang = languages.find(lang => lang.label === language).label;
    onLanguageChange(selectedLang);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Language</h2>
        <div className="language-grid">
          {languages.map((lang) => (
            <label key={lang.code} className="language-option">
              <input
                type="radio"
                name="language"
                value={lang.label}
                checked={language === lang.label}
                onChange={(e) => setLanguage(e.target.value)}
              />
              {lang.label}
            </label>
          ))}
        </div>
        <button onClick={handleConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
  );
};

export default LanguageModal;
