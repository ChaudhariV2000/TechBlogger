
TechBlogger Hub


Deployed On: Amazon EC2 (Ubuntu)

Containerized With: Docker

Authentication Using: AWS Cognito

Media/Image Storage: AWS S3 

Blog Data Storage: DynamoDB

Developed By: Vedant Manish Chaudhari






Problem Statement:
Traditional blog applications rely on local servers for image storage and relational databases for blog content, which may lead to scalability and availability issues. For a modern, scalable, and cost-efficient solution, integrating cloud-native services is essential.
Objective:
Develop a blog application that stores user-generated content (title, content, and images) securely and scalably using AWS S3 for image storage and AWS DynamoDB for content storage.

Project Goals:
•	Allow users to create blog posts with image uploads.
•	 Store images in AWS S3 (cloud object storage).
•	 Store blog metadata (title, content, image URL) in AWS DynamoDB (NoSQL DB).
•	 Use Express.js for server-side handling and rendering views.
•	 Make the application portable and scalable for cloud hosting (e.g., EC2).
•	Authentication using Cognito

 ![image](https://github.com/user-attachments/assets/70f05db3-051b-4fd9-b002-0574cf7a86ec)

 Development Phase
1. Initialize the Project
npm init -y
npm install express aws-sdk multer multer-s3 ejs dotenv

2. Folder Structure
   
![image](https://github.com/user-attachments/assets/f4b2d54f-2e50-4cc2-b07d-dda332fd2269)

4. Backend Features (Node.js)
•	Routes:
o	/  → Landing Page
o	/createblog → POST route for blog with image
o	/authRoutes → Display list of blogs
o	/test-s3 → Check if S3 is connected

5. AWS Configuration
AWS.config.update({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_KEY
    }
});

6. S3 and DynamoDB Initialization
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

7. Configure Multer with S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'my-blog-images-vedant',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            cb(null, `uploads/${name}-${Date.now()}${ext}`);
        }
    })

});

O/P:-
Landing Page

![image](https://github.com/user-attachments/assets/7fc360f7-51f4-437e-92a4-9385b5e49897)

![image](https://github.com/user-attachments/assets/b78a1856-b84d-491b-84c4-bd66aa94d09f)

Authentication using Cognito:-

![image](https://github.com/user-attachments/assets/b38fec10-3dec-421d-9555-e3c4e3338474)

![image](https://github.com/user-attachments/assets/0687f946-8782-40ef-ba54-f5c3ff83caf3)

Home Page(Running on EC2):-

![image](https://github.com/user-attachments/assets/6c468f1a-9186-4ca5-b176-24e1a17bc88a)

Blog Creation:-

![image](https://github.com/user-attachments/assets/f749325c-0b9e-4ac5-a6d4-c774a82892c2)

![image](https://github.com/user-attachments/assets/395bde65-b8cd-495b-b517-8b769e2644e7)

![image](https://github.com/user-attachments/assets/91192582-ae19-4a44-9d41-80d2e0bd7d21)


Blog Content Stored in DynamoDB:-

![image](https://github.com/user-attachments/assets/32a66dc6-fb0f-434a-a5d5-fa0dae1ded86)

Blog Image Stored in S3 Bucket:-

![image](https://github.com/user-attachments/assets/06756c3a-1629-4d6a-8060-3dfad17fd777)

Steps to Dockerize the Web App:-

1.	Add the Dockerfile to project
   
 ![image](https://github.com/user-attachments/assets/9d36b566-bd98-437f-a9a5-351db9b29d1e)

3.	Add .dockerignore

4.	Build Docker image 
![image](https://github.com/user-attachments/assets/08a71f86-bc44-43b4-b431-ddd7cc756d53)

5.  Run File locally
   
![image](https://github.com/user-attachments/assets/fbaba36a-e9da-450d-805d-64f3f7d0bcac)
   
![image](https://github.com/user-attachments/assets/7bc9a07c-a24a-40f6-85c8-1ffa76f9977a)

5.	Tag the image for Docker Hub

docker tag blog-app vedantchaudhari2000/my-blog-app:latest

6.	Docker hub login

7.	Push the image to Docker Hub

docker push vedantchaudhari174/my-blog-app:latest


8.	Create the EC2 Instance to run the Dockerize Containers
   
![image](https://github.com/user-attachments/assets/8e249ca6-cda2-4acd-b0bc-6e88253386d2)

10.	 Connect to powershell

![image](https://github.com/user-attachments/assets/f1a9534e-015e-4b54-a616-2577e2208d8e)

11 .Run apt Update

![image](https://github.com/user-attachments/assets/b7d33e4d-73e6-4cd6-8cda-3150a21a55e9)

12. Cmd  for docker 
  
sudo apt install -y docker.io

sudo systemctl start docker

sudo systemctl enable docker

sudo usermod -aG docker ubuntu

newgrp docker

docker –version

docker pull vedantchaudhari2000/my-blog-app:latest

![image](https://github.com/user-attachments/assets/053a59f9-d9f1-4da2-9aa3-57cac7624df4)

![image](https://github.com/user-attachments/assets/3954bb01-8e3f-4304-b313-93176d3df7e7)

Run docker

![image](https://github.com/user-attachments/assets/eeaae1c2-41f7-4087-b386-17407f77dabb)

12 . IAM (Roles to access the S3 n DynamoDB)

![image](https://github.com/user-attachments/assets/b0d00fe7-1b64-49f3-aad9-4a3226ef3457)

13. Automation
    Deployment Script
    
    ![image](https://github.com/user-attachments/assets/1f2c92f2-79bc-40ff-b066-a99c65da1f93)
    
    chmod +x ~/deploy.sh

    Set up daily Auto updates
crontab -e

0 3 * * * /home/ubuntu/deploy.sh >> /home/ubuntu/deploy.log 2>&1

![image](https://github.com/user-attachments/assets/267c2cd1-a871-4a78-a77a-98694b0e22b8)



