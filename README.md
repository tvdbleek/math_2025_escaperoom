# Math 2025 Escape Room

This is a React Application built with Vite.

## Build and Deployment

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD). 

### Workflow

We use a dual-branch deployment strategy to host both the production and development versions of the application on GitHub Pages.

- **Main Branch (`main`)**: 
  - Deployed to the **root** of the GitHub Pages site.
  - URL: `https://<username>.github.io/math_2025_escaperoom/`
  - This is the stable, production-ready version.

- **Develop Branch (`develop`)**:
  - Deployed to the **/dev** subfolder.
  - URL: `https://<username>.github.io/math_2025_escaperoom/dev/`
  - This is for testing new features before merging to main.

### Automated Process

The workflow is defined in `.github/workflows/deploy.yml`. 

1.  **Trigger**: Pushes to `main` or `develop` trigger the workflow.
2.  **Build**: The project is built using `npm run build`.
    - `main` is built with base path `/math_2025_escaperoom/`.
    - `develop` is built with base path `/math_2025_escaperoom/dev/`.
3.  **Deploy**: The build artifacts are deployed to the `gh-pages` branch.
    - `main` updates the root, preserving the `dev` folder.
    - `develop` updates the `dev` folder, preserving the root.

### Manual Build

To build locally:

```bash
# For Main/Root
vite build --base=/math_2025_escaperoom/

# For Develop/Dev
vite build --base=/math_2025_escaperoom/dev/
```

## Development

To run the development server:

```bash
npm run dev
```
