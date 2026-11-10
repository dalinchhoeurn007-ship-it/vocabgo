# VocabGo – English Vocabulary Learning App

Pure HTML + CSS + vanilla JavaScript. No build step, no backend.

## Run in VS Code
1. Open the `english-vocabulary-app` folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.
   (Or just double-click `index.html`; it works from the file system too.)
3. Use Chrome or Edge for best pronunciation (Web Speech API) support. Internet is needed for Poppins/Font Awesome.

## Files
- `index.html` – page shell (sidebar, top bar, view container)
- `css/style.css` – light-blue theme, responsive layout, flip animation
- `js/vocabulary.js` – categories, 50 words, helpers (pictures, speech, toast)
- `js/storage.js` – LocalStorage progress, streak and activity log
- `js/flashcards.js` – flashcard deck and keyboard-friendly UI
- `js/quiz.js` – 5 quiz types, scoring, review
- `js/app.js` – pages, navigation, add/edit/delete, search, favorites, settings

## Tips
- Keyboard (Flashcards): ← → navigate, Space flip, K known, L still learning, S speak.
- Pictures are emoji illustrations so they never break. To use a photo, edit a word and paste an image URL in "Picture".
- Reset everything under Settings → *Reset all progress*.
