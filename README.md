# Profile Parser

### Running as Docker container (on Ubuntu Linux)

##### Requirements

- [Docker >= 18.03](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
    ```bash
    sudo su
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt update
    apt install -y docker-ce
    curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    usermod -aG docker $USER
    ```

##### Build and run Docker image
Execute inside the root of cloned repository  
```bash
docker-compose up -d
```
> Note: if you receive error like `Couldn't connect to Docker daemon` try to reboot your system.

##### Access server:
```bash
http://localhost:8000/profiles
```

### Running Locally (on Ubuntu Linux)

##### Requirements

- [Node.js](http://nodejs.org/)
- `build-essentials` package

##### Setup server:
Execute inside the root of cloned repository
```bash
npm install
```

##### Configurations
> Copy `.env.example` template to `.env` and modify according to your environment 
```bash
cp .env.example .env
```

##### Run server
+ Development mode:
```bash
    npm run start-dev
```

+ Production mode:
```bash
    npm run build
    npm start
```

##### Access server:
```bash
http://localhost:8000/profiles
```

---

## API Description

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ data: [{...}, {...}, ...] }`
 
* **Error Response:**

  * **Code:** 500 <br />
    **Content:** `{ errors : ["...", "....", ...] }`
------

***Show Profiles***
----
  Return available profiles.

* **URL**

  /profiles

* **Method:**

  `GET`
  
* **Response:**

  Object key | Value Type | Description | Examples
  --- | --- | --- | ---
  name |  string | Full Name | `John Doe`
  skills |  string array | Skills list | `['Java', 'Node.js']`
 
------
