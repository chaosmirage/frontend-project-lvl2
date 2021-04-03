install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test -- --watchAll

test-coverage:
	npm test -- --coverage --coverageProvider=v8
