.PHONY: build clean

build: index.html

index.html: build.js recipes/*.md
	node build.js

clean:
	rm -f index.html
