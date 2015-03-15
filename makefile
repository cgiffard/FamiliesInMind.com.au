# Build the templates and assets, for remote
# deployment

build: install test assets templates

install:
	npm install

test:
	@echo "No tests for now."

assets:
	@echo "No asset generation for now."

templates:
	@echo "jade here";