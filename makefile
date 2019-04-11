# Build the templates and assets, for remote
# deployment

build: test assets html

test:
	@echo "No tests for now.";

assets:
	@./node_modules/.bin/postcss style/*.css --use autoprefixer --dir build/css
	@echo "CSS Generation complete.";

html:
	@./build.js

clean:
	@echo "Deleting...";
	@rm -rfv ./build/*.html ./build/css ./build/.htaccess;

watch:
	./watch.js
