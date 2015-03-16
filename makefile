# Build the templates and assets, for remote
# deployment

build: install test assets html

install:
	@echo "Checking installed dependencies...";
	npm install

test:
	@echo "No tests for now.";

assets: install
	@mkdir -p build/css
	@for style in $$(ls style);\
	do\
		echo "Generating $$style";\
		./node_modules/.bin/myth ./style/$$style > ./build/css/$$style;\
	done;
	@echo "CSS Generation complete.";

html:
	@./build.js

clean:
	@echo "Deleting...";
	@rm -rfv ./build/*.html ./build/css ./build/.htaccess;

watch:
	./watch.js