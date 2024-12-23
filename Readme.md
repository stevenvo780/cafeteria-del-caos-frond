Aquí tienes el archivo README refactorizado para reflejar el cambio al proyecto **Cafeteria del Caos**:

# Cafeteria del Caos - Next.js Project

**Cafeteria del Caos** is a digital cultural group whose purpose is to foster dialogue and learning in areas such as literature, debates, philosophy, art, science, and technology. Our goal is to create an inclusive space where ideas and knowledge can flourish through meaningful and respectful interactions.

## Project Description

This project is an open-source web platform built with [Next.js](https://nextjs.org/), designed to support the mission of Cafeteria del Caos by providing a space for community participation, content sharing, and event organization. The platform acts as a hub for intellectual and cultural exchange, welcoming professionals, teachers, students, and anyone interested in broadening their horizons.

### Key Features

- **Event Management**: Schedule and manage cultural and intellectual events such as debates, readings, and conferences.
- **Content Publishing**: Publish and share articles, essays, and discussions in a blog-style format.
- **Community Interaction**: Foster meaningful conversations and collaborations within a safe and respectful environment.
- **Open Source**: The project is open to community contributions to improve and expand its functionality.

## Getting Started

### Prerequisites

- Node.js 18.x
- npm >= 6.x or yarn >= 1.x
- Git
- Docker

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/stevenvo780/cafeteriadelcaos-frontend.git
    cd cafeteria-del-caos
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. Create a `.env.local` file in the root directory and configure your environment variables:

    ```bash
    NEXT_PUBLIC_API_URL=<Your API URL>
    NEXT_PUBLIC_FIREBASE_API_KEY=<Your Firebase API Key>
    # Add other environment variables as needed
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Using Docker

1. Build the Docker image:

    ```bash
    docker build -t cafeteria-del-caos .
    ```

2. Run the container:

    ```bash
    docker run -p 3000:3000 cafeteria-del-caos
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running in Docker.

### Production Build

To create an optimized production build:

```bash
npm run build
```

or

```bash
yarn build
```

Then, start the server:

```bash
npm start
```

or

```bash
yarn start
```

### Deployment

For deployment, you can use platforms like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any hosting service that supports Node.js applications. Be sure to configure your environment variables on the hosting platform as you did in the `.env.local` file.

## Contributions

We welcome community contributions! If you're interested in contributing, please fork the repository and create a pull request with your changes. Before submitting a pull request, ensure your code adheres to our coding standards and passes all tests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions, feedback, or contributions, feel free to contact the Cafeteria del Caos team.