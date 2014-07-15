build: install index.js
	mkdir -p build
	browserify --standalone iframify index.js -o build/iframify.js
  
install:
	npm install

.PHONY: make, install
