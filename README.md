# Perfect Studymate

A Learning Chatbot Powered by RAG Technology

Meet your own AI Studymate! <br>
Upload your documents, and a more accurate and secure personalized chatbot is born

## Table of Contents
- [Project Overview](#project-overview)
- [Team Members](#team-members)
- [Project Duration](#project-duration)

## Project Overview
Chatbots often confuse users by producing false responses. This
 is also a reason why users are reluctant to use chatbots for learning. So we propose
 a RAG-based chatbot service named "Perfect StudyMate" that allows students to experience
 fewer hallucinations. The user uploads the '.pdf' formatted resources used in courses to the
 chatroom, and the model embeds the uploaded data and stores it in a database. Then, when
 the user asks chatbot a question related to the data, the model extracts the context related
 to the question from the embedding database and reflects it in the answer. At the same time,
 an interactive conversation is implemented by utilizing the history of conversation between
 the user and the chatbot. Users can enjoy an improved learning experience by talking to
 chatbots with less hallucination based on the content of the course material they want.

## Architecture
![](/assets/service_flow.png)

## Demo Video
[Demo Video](https://drive.google.com/file/d/1mpum80qOI3IvpLGFNY9DpOXoRZSUhwhP/view?usp=drive_link)

## My Contributions
Role: Backend Development
* Backend Architecture Design
    ![](/assets/backend_architecture.png)
* Database Design
    ![](/assets/database_design.png)

* REST API
    * [API Documentation (Swagger UI)](https://wndyd0131.github.io/perfectstdm_api_doc/)
    * User
        * Signup
        * Read user
        
    * Authentication & Authorization
        * Login
        * Jwt authentication

    * Chatting Session
        * Create session
        * Read session
        * Update session
        * Delete session

    * Message
        * Send back response from RAG
        * Delete message
        * Delete messages

    * File Management
        * Upload files
        * Read files
        * Delete files

## Course Repository
https://github.com/SecAI-Lab/SWE3028-Fall-2024/tree/main/Team%20K

## Team Members
- **Member 1**: Juyong Rhee (Team leader)
- **Member 2**: Yewon Chun
- **Member 3**: Jihee Hwang
- **Member 4**: Jorge Alcorta

## Project Duration
- **Start Date**: 2024-09-02
- **End Date**: 2024-12-13