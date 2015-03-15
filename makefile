# Build the templates and assets, for remote
# deployment

build: install test assets html

install:
	npm install

test:
	@echo "No tests for now."

assets:
	@echo "No asset generation for now."

html:
	@./build.js

clean:
	@echo "Deleting..."
	@rm -rfv ./build/*.html