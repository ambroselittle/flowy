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

There's a root [src/components](./src/components/) folder that houses core shared components.

#### Views/Pages

Simple views can be off the src root. Anything more complex may warrant its own folder, and can optionally have feature-specific sub folders for greater organization.
Prefer the organization by feature/feature area as the core organizing principle over asset type.

### Testing

TODO: Will use [vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

### Releasing

Run `npm run deploy`. This will build and publish to GitHub pages. (You will need permissions to do this.)

## Next Steps/Issues

See the [issues](https://github.com/ambroselittle/flowy/issues) for open work items.
