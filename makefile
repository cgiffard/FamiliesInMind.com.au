# Build the templates and assets, for remote
# deployment

build: test assets html

test:
	@echo "No tests for now.";

assets:
	@./node_modules/.bin/postcss style/*.css --use autoprefixer --dir build/css
	@echo "CSS Generation complete.";

html:
	@for file in $$(cd content && find . -type f -not -name "*.jade" -not -name "README.md");\
	do\
		mkdir -p build/$$(dirname $$file);\
		cp content/$$file build/$$(dirname $$file);\
	done;
	@./build.js

clean:
	@echo "Deleting...";
	@rm -rf build;

watch:
	./watch.js
