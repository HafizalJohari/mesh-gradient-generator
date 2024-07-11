Sure, here is a `README.md` file for your GitHub project:

```markdown
# Mesh Gradient Generator

A dynamic and customizable mesh gradient generator built with React. This application allows you to create animated mesh gradients and export them as GIFs, videos, or SVG files. Additionally, you can apply various filters such as blur, opacity, grain, contrast, brightness, and hue to your gradients.

## Features

- Create and customize gradient points.
- Apply filters: Blur, Opacity, Grain, Contrast, Brightness, Hue.
- Animated gradients with smooth transitions.
- Export animations as GIFs or videos.
- Download gradients as SVG files.
- Dark mode support.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HafizalJohari/mesh-gradient-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mesh-gradient-generator
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm start
```

This will launch the application in your default web browser at `http://localhost:3000`.

### Building for Production

To create a production build of the application, run:

```bash
npm run build
```

### Exporting Animations

- **GIF**: Click the "Start Recording" button, and after 5 seconds, click "Download GIF".
- **Video**: Click the "Start Recording" button, and after 5 seconds, click "Download Video".
- **SVG**: Click "Download SVG" to save the current gradient as an SVG file.

## Usage

1. Adjust the gradient points using the X and Y sliders and change the colors using the color picker.
2. Use the Blur, Opacity, Grain, Contrast, Brightness, and Hue sliders to apply filters to your gradient.
3. Click the "Start Recording" button to capture the animation frames.
4. Click the "Stop Recording" button to finish capturing and enable the download buttons.
5. Click "Download GIF", "Download Video", or "Download SVG" to save your creation.

## Code Structure

- `src/MeshGradientGenerator.js`: Main component that handles the gradient generation and animation.
- `src/components/Slider.js`: Reusable slider component for filter controls.
- `src/components/Button.js`: Reusable button component for various actions.
- `src/components/ColorInput.js`: Color input component for gradient point color selection.
- `src/components/GradientPointCard.js`: Component for individual gradient point controls.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Hafizal Johari - [hafizaljohari@gmail.com](mailto:hafizaljohari@gmail.com)

Project Link: [https://github.com/HafizalJohari/mesh-gradient-generator](https://github.com/HafizalJohari/mesh-gradient-generator)

---

### Notes

This project was built as a part of my exploration into dynamic and interactive UI components using React. Feel free to reach out if you have any questions or suggestions!

```

You can save this as a `README.md` file in the root directory of your project. Let me know if you need any further adjustments or additions!