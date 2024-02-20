Sample project using the [Video Games Dataset from Kaggle](https://www.kaggle.com/datasets/sidtwr/videogames-sales-dataset/data?select=Video_Games_Sales_as_at_22_Dec_2016.csv).

Allows searching video games by name and, upon selection of a matching game, displays basic release and sales information.

[Try It Here](https://ambroselittle.github.io/flowy/)

## Contributing

### Getting Started

1. Ensure you're on relevant node version. `nvm` is recommended: `nvm install`
2. Install deps: `npm i`
3. Run: `npm run dev`

### Key Technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Victory Charts](https://commerce.nearform.com/open-source/victory/)

This was generated with `vite` and `tailwind` and customized from there.

Prefer to use/extend the above rather than adding new.

### Structure

Follows standard core assets structure shared by vite/CRA/etc.

#### Shared Components

Any shared (cross-view) components should be added to a root `src/components` folder.

#### Views

Views (pages) are off the src root. It's recommended to make a folder per feature or feature area (with features below it).
Organize feature-dependent assets/components/styles in the relevant feature folder.

#### Error Handling

TODO: Add common logging library. Until then, catch and log error details to console.error.
Be sure to handle and display usable error messages where appropriate.

### Testing

TODO: Will use [vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
Prefer co-locating tests with the view/component they test (rather than a root tests structure that mirrors runtime structure).

### Releasing

Run `npm run deploy`. This will build and publish to GitHub pages. (You will need permissions to do this.)

## Next Steps/Issues

See the [issues](https://github.com/ambroselittle/flowy/issues) for open work items.
