const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const fs = require("fs");

class HeadForgeDevServer {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.configDir = path.join(this.rootDir, "config");
    this.distDir = path.join(this.rootDir, "dist");
    this.port = process.env.PORT || 3000;
  }

  async start() {
    console.log("🚀 Starting HeadForge development server...");
    console.log("=".repeat(50));

    try {
      // Clean previous builds
      await this.clean();

      // Start webpack dev server
      await this.startWebpackDevServer();
    } catch (error) {
      console.error("❌ Development server failed:", error.message);
      process.exit(1);
    }
  }

  async clean() {
    console.log("🧹 Cleaning previous builds...");

    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }

    // Create dist directory
    fs.mkdirSync(this.distDir, { recursive: true });
  }

  async startWebpackDevServer() {
    // Load webpack config
    const configPath = path.join(this.configDir, "webpack.dev.js");
    const config = require(configPath);

    // Set development environment
    process.env.NODE_ENV = "development";
    process.env.BROWSER = "chrome";

    // Create dev server
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, {
      ...config.devServer,
      port: this.port,
      host: "localhost",
      hot: true,
      liveReload: true,
      open: false,
      compress: true,
      historyApiFallback: true,
      static: [
        {
          directory: path.join(this.rootDir, "dist"),
          publicPath: "/",
        },
        {
          directory: path.join(this.rootDir, "src"),
          publicPath: "/src",
        },
        {
          directory: path.join(this.rootDir, "src/styles"),
          publicPath: "/styles",
        },
        {
          directory: path.join(this.rootDir, "src/popup"),
          publicPath: "/popup",
        },
        {
          directory: path.join(this.rootDir, "src/options"),
          publicPath: "/options",
        },
      ],
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      setupMiddlewares: (middlewares, devServer) => {
        const express = require("express");

        // Serve CSS files directly from src directory
        devServer.app.use(
          "/styles",
          express.static(path.join(this.rootDir, "src/styles"), {
            setHeaders: (res, path) => {
              res.setHeader("Content-Type", "text/css; charset=utf-8");
            },
          })
        );

        // Handle favicon.ico requests
        devServer.app.get("/favicon.ico", (req, res) => {
          res.status(204).end();
        });

        return middlewares;
      },
      onListening: (devServer) => {
        if (!devServer) {
          throw new Error("Webpack dev server is not defined");
        }

        const port = devServer.server.address().port;
        console.log(`\n✅ Development server started!`);
        console.log(`🌐 Local: http://localhost:${port}`);
        console.log(`📱 Network: http://0.0.0.0:${port}`);
        console.log("\n📋 Available endpoints:");
        console.log(`  • Popup: http://localhost:${port}/popup/popup.html`);
        console.log(
          `  • Options: http://localhost:${port}/options/options.html`
        );
        console.log(
          `  • Background: http://localhost:${port}/background/background.js`
        );
        console.log(
          `  • Content: http://localhost:${port}/content/content-script.js`
        );
        console.log("\n🔧 Development tips:");
        console.log("  • Hot reload is enabled");
        console.log("  • Source maps are available");
        console.log("  • Use Chrome DevTools for debugging");
        console.log("  • Press Ctrl+C to stop the server");
      },
    });

    // Start server
    devServer.startCallback((err) => {
      if (err) {
        console.error("❌ Failed to start dev server:", err);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down development server...");
      devServer.stopCallback(() => {
        console.log("✅ Development server stopped");
        process.exit(0);
      });
    });
  }

  async startWithHotReload() {
    console.log("🔥 Starting with hot reload...");

    // Watch for file changes
    const chokidar = require("chokidar");
    const watcher = chokidar.watch(
      [
        path.join(this.rootDir, "src/**/*"),
        path.join(this.rootDir, "config/**/*"),
      ],
      {
        ignored: /node_modules/,
        persistent: true,
      }
    );

    watcher.on("change", (filePath) => {
      console.log(`📝 File changed: ${path.relative(this.rootDir, filePath)}`);
    });

    watcher.on("add", (filePath) => {
      console.log(`➕ File added: ${path.relative(this.rootDir, filePath)}`);
    });

    watcher.on("unlink", (filePath) => {
      console.log(`➖ File removed: ${path.relative(this.rootDir, filePath)}`);
    });

    // Start dev server
    await this.start();
  }

  async startWithProxy() {
    console.log("🔄 Starting with proxy...");

    // Load webpack config
    const configPath = path.join(this.configDir, "webpack.dev.js");
    const config = require(configPath);

    // Add proxy configuration
    config.devServer = {
      ...config.devServer,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "",
          },
        },
      },
    };

    // Start server
    await this.start();
  }

  async startWithMockData() {
    console.log("🎭 Starting with mock data...");

    // Create mock data endpoint
    const mockData = {
      languages: [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
      ],
      licenses: [
        { value: "MIT", label: "MIT License" },
        { value: "Apache-2.0", label: "Apache 2.0" },
        { value: "GPL-3.0", label: "GPL 3.0" },
      ],
    };

    // Start server with mock data
    await this.start();
  }
}

// CLI usage
if (require.main === module) {
  const devServer = new HeadForgeDevServer();
  const command = process.argv[2];

  switch (command) {
    case "hot":
      devServer.startWithHotReload();
      break;
    case "proxy":
      devServer.startWithProxy();
      break;
    case "mock":
      devServer.startWithMockData();
      break;
    default:
      devServer.start();
  }
}

module.exports = HeadForgeDevServer;
