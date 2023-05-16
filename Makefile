build: 
	docker build -t tarik26/queries .

run: 
	docker run -d -p 3000:3000 --name queries --rm tarik26/queries