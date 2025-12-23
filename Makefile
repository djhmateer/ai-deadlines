.PHONY: install start test clean

install:
	@echo "Installing dependencies..."
	pnpm install

start:
	@echo "Starting the application..."
	# Assuming your main entry point is index.js or similar
	# You might need to adjust this command based on your project setup
	# For example, if you use a specific start script: pnpm start
	# Or directly run the main file: node index.js
	@echo "Please define a 'start' script in your package.json or modify this Makefile target."

test:
	@echo "Running tests..."
	pnpm test

clean:
	@echo "Cleaning up build artifacts..."
	rm -rf node_modules
	@echo "Clean complete."
