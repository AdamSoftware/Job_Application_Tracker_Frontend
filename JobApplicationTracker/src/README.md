# Frontend structure

`main.jsx` mounts the React app. `App.jsx` is the coordinator: it owns the active page, saved applications, contacts, work history, settings, and the actions that update them. Page and form components receive data and callbacks as props, then report user actions back to `App.jsx`.

## Folders

- `components/applications`, `interviews`, `offers`, `work-history`, `contacts`, `dashboard`, and `celebration` contain UI for those parts of the product.
- `components/forms` contains the dialogs used to add or edit records.
- `components/shared` contains reusable controls such as icons and company logos.
- `components/auth` and `components/settings` contain the preview sign-in and account settings UI.
- `data/initialData.js` provides starter records and status labels for a fresh preview.
- `utils/dateUtils.js` handles date display and calendar exports. `utils/jobUtils.js` holds shared job and work-history helpers.

## Following a change

For a new field, update the form component that edits it, then update the save handler in `App.jsx` if the field needs special behavior. For a new page or feature, add its UI under the matching `components` folder and connect it from `App.jsx`. Feature styles currently live in `App.css`; global reset and typography live in `index.css`.

The web preview currently persists its records and preferences in browser `localStorage`. The sign-in screen is a prototype and does not authenticate users.
