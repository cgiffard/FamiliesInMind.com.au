# Build the templates and assets, for remote
# deployment

build: test assets html

test:
	@echo "No tests for now.";

assets:
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
